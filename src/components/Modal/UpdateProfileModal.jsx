import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { imageUpload, saveOrUpdateUser } from '../../utils'
import useAuth from '../../hooks/useAuth'

const UpdateProfileModal = ({ isOpen, setIsOpen }) => {
    const { user, updateUserProfile, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(user?.photoURL)
    const { register, handleSubmit } = useForm()

    const onSubmit = async data => {
        setLoading(true)
        try {
            const name = data.name
            const image = data.image[0]
            let imageUrl = user?.photoURL

            if (image) {
                imageUrl = await imageUpload(image)
            }

            await updateUserProfile(name, imageUrl)
            // Immediately update local state while preserving prototype
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
                address: data.address
            })
            toast.success('Profile Updated Successfully')
            setIsOpen(false)
        } catch (err) {
            // console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = image => {
        setImagePreview(URL.createObjectURL(image))
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
                                                defaultValue={user?.displayName}
                                                {...register('name', { required: true })}
                                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Address</label>
                                            <input
                                                type='text'
                                                defaultValue={user?.address} // Assuming user object will eventually have address, or we might need to fetch it separately if it's not in auth object. 
                                                // Note: Firebase auth user object doesn't have address. We might need to fetch user from DB to get address pre-filled.
                                                // For now, let's allow saving it.
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
