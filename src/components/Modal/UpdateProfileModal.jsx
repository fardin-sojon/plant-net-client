import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { imageUpload, saveOrUpdateUser } from '../../utils'
import useAuth from '../../hooks/useAuth'

const UpdateProfileModal = ({ isOpen, setIsOpen, dbUser, refetch }) => {
    const { user, updateUserProfile, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(user?.photoURL)
    const [coverPreview, setCoverPreview] = useState(dbUser?.cover)
    const [coverPosition, setCoverPosition] = useState(dbUser?.coverPosition ? parseInt(dbUser.coverPosition) : 50)
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        if (isOpen) {
            setImagePreview(user?.photoURL)
            setCoverPreview(dbUser?.cover)
            setCoverPosition(dbUser?.coverPosition ? parseInt(dbUser.coverPosition) : 50)
        }
    }, [isOpen, user, dbUser])

    const onSubmit = async data => {
        setLoading(true)
        try {
            const name = data.name
            const image = data.image[0]
            const coverImage = data.coverImage[0]
            let imageUrl = user?.photoURL
            let coverUrl = dbUser?.cover || ''

            if (image) {
                imageUrl = await imageUpload(image)
            }
            if (coverImage) {
                coverUrl = await imageUpload(coverImage)
            }

            await updateUserProfile(name, imageUrl)
            // Immediately update local state
            setUser({
                ...user,
                displayName: name,
                photoURL: imageUrl,
                email: user?.email || user?.providerData[0]?.email,
                uid: user.uid,
                providerData: user.providerData,
            })
            // Update user data in backend
            await saveOrUpdateUser({
                name,
                image: imageUrl,
                email: user?.email || user?.providerData[0]?.email,
                address: data.address,
                phone: data.phone,
                cover: coverUrl,
                coverPosition: `${coverPosition}%`
            })
            toast.success('Profile Updated Successfully')
            refetch()
            setIsOpen(false)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = image => {
        if (image) setImagePreview(URL.createObjectURL(image))
    }

    const handleCoverChange = image => {
        if (image) setCoverPreview(URL.createObjectURL(image))
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
                <TransitionChild
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/25' />
                </TransitionChild>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <TransitionChild
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white'>
                                <DialogTitle
                                    as='h3'
                                    className='text-lg font-medium leading-6 text-gray-900 text-center mb-4 dark:text-white'
                                >
                                    Update Profile
                                </DialogTitle>

                                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Email</label>
                                            <input
                                                type='email'
                                                disabled
                                                value={user?.email || user?.providerData[0]?.email || ''}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Name</label>
                                            <input
                                                type='text'
                                                defaultValue={dbUser?.name || user?.displayName}
                                                {...register('name', { required: true })}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Phone Number</label>
                                            <input
                                                type='tel'
                                                defaultValue={dbUser?.phone || ''}
                                                {...register('phone')}
                                                onInput={(e) => {
                                                  e.target.value = e.target.value.replace(/[^\d+]/g, '');
                                                }}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Address</label>
                                            <input
                                                type='text'
                                                defaultValue={dbUser?.address || ''}
                                                {...register('address')}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Profile Image</label>
                                            <input
                                                type='file'
                                                id='profile_image'
                                                {...register('image')}
                                                onChange={e => handleImageChange(e.target.files[0])}
                                                className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100'
                                            />
                                            {imagePreview && (
                                                <div className="flex justify-start mt-2">
                                                    <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {imagePreview !== user?.photoURL && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setImagePreview(user?.photoURL);
                                                                    document.getElementById('profile_image').value = '';
                                                                }}
                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-md z-10 cursor-pointer"
                                                            >
                                                                X
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Cover Photo</label>
                                            <input
                                                type='file'
                                                id='cover_image'
                                                {...register('coverImage')}
                                                onChange={e => handleCoverChange(e.target.files[0])}
                                                className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100'
                                            />
                                            {coverPreview && (
                                                <div className="space-y-2 mt-2">
                                                    <div className="relative w-full h-24 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                                                        <img
                                                            src={coverPreview}
                                                            alt="Preview"
                                                            style={{ objectPosition: `center ${coverPosition}%` }}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {coverPreview !== dbUser?.cover && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setCoverPreview(dbUser?.cover);
                                                                    document.getElementById('cover_image').value = '';
                                                                }}
                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-md z-10 cursor-pointer"
                                                            >
                                                                X
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div>
                                                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                                        Reposition Cover (Drag slider to adjust vertical alignment):
                                                      </label>
                                                      <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={coverPosition}
                                                        onChange={(e) => setCoverPosition(parseInt(e.target.value))}
                                                        className="w-full accent-lime-500 cursor-pointer"
                                                      />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='mt-4 flex justify-end gap-2'>
                                        <button
                                            type='button'
                                            className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type='submit'
                                            disabled={loading}
                                            className='inline-flex justify-center rounded-md border border-transparent bg-lime-500 px-4 py-2 text-sm font-medium text-white hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2'
                                        >
                                            {loading ? 'Updating...' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default UpdateProfileModal
