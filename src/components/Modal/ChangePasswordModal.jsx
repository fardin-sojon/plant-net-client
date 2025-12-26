import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, getAuth } from 'firebase/auth'
import { app } from '../../firebase/firebase.config'
const auth = getAuth(app)

const ChangePasswordModal = ({ isOpen, setIsOpen }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm()

    const onSubmit = async data => {
        setLoading(true)
        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, data.oldPassword)
            await reauthenticateWithCredential(auth.currentUser, credential)

            await updatePassword(auth.currentUser, data.newPassword)
            toast.success('Password Changed Successfully')
            reset()
            setIsOpen(false)
        } catch (err) {
            // console.log(err)
            if (err.code === 'auth/wrong-password') {
                setError('oldPassword', {
                    type: 'manual',
                    message: 'Incorrect Old Password',
                })
                // toast.error('Incorrect Old Password')
            } else if (err.code === 'auth/requires-recent-login') {
                toast.error('Please logout and login again to change password')
            } else {
                toast.error(err.message)
            }
        } finally {
            setLoading(false)
        }
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
                            <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all'>
                                <DialogTitle
                                    as='h3'
                                    className='text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4'
                                >
                                    Change Password
                                </DialogTitle>

                                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Old Password</label>
                                        <input
                                            type='password'
                                            {...register('oldPassword', { required: true })}
                                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                        />
                                        {errors.oldPassword && (
                                            <p className='text-red-500 text-xs mt-1'>{errors.oldPassword.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>New Password</label>
                                        <input
                                            type='text'
                                            {...register('newPassword', { required: true, minLength: 6 })}
                                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                        />
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
                                            {loading ? 'Changing...' : 'Change Password'}
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

export default ChangePasswordModal
