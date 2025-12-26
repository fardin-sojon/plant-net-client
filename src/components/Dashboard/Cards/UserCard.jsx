import { useState } from 'react'
import UpdateUserRoleModal from '../../Modal/UpdateUserRoleModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const UserCard = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const axiosSecure = useAxiosSecure()

  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-3'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold'>Email</p>
          <p className='text-gray-900 dark:text-white font-medium break-all'>{user?.email}</p>
        </div>
        <div className='text-right'>
           <p className='text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold'>Role</p>
           <p className='text-gray-900 dark:text-white capitalize'>{user?.role}</p>
        </div>
      </div>
      
      <div className='flex justify-between items-center'>
         <div>
             <p className='text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold'>Status</p>
             {user?.status ? (
              <p
                className={`${
                  user.status === 'Verified' ? 'text-green-500' : user.status === 'Requested' ? 'text-yellow-500' : 'text-red-500'
                } font-medium`}
              >
                {user.status}
              </p>
            ) : (
              <p className='text-red-500 font-medium'>Unavailable</p>
            )}
         </div>
         
         <button
            onClick={() => setIsOpen(true)}
            className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 dark:text-white leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-green-200 opacity-50 dark:bg-green-600 dark:opacity-100 rounded-full'
            ></span>
            <span className='relative'>Update Role</span>
          </button>
      </div>

      <UpdateUserRoleModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        closeModal={() => setIsOpen(false)}
        role={user?.role}
        updateRole={async (selectedRole) => {
          if (user?.role === selectedRole) return setIsOpen(false)
          try {
            await axiosSecure.patch(`/users/update/${user?.email}`, { role: selectedRole })
            refetch()
            toast.success('Role updated successfully!')
            setIsOpen(false)
          } catch (err) {
            // console.log(err)
            toast.error(err.message)
          }
        }}
        user={user}
        refetch={refetch}
      />
    </div>
  )
}

export default UserCard
