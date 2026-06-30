import { useState } from 'react'
import UpdateUserRoleModal from '../../Modal/UpdateUserRoleModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const UserDataRow = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const axiosSecure = useAxiosSecure()

  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete user ${user?.email}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/users/${user?._id}`)
          refetch()
          toast.success('User deleted successfully!')
        } catch (err) {
          toast.error(err.message || 'Failed to delete user')
        }
      }
    })
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{user?.name || 'N/A'}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{user?.email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white whitespace-no-wrap capitalize'>{user?.role}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        {user?.status ? (
          <p
            className={`${
              user.status === 'Verified' ? 'text-green-500' : user.status === 'Requested' ? 'text-yellow-500' : 'text-red-500'
            } whitespace-no-wrap`}
          >
            {user.status}
          </p>
        ) : (
          <p className='text-red-500 whitespace-no-wrap'>Unavailable</p>
        )}
      </td>

      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setIsOpen(true)}
            className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 dark:text-white leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-green-200 opacity-50 dark:bg-green-600 dark:opacity-100 rounded-full'
            ></span>
            <span className='relative text-xs'>Update Role</span>
          </button>
          
          <button
            onClick={handleDelete}
            className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-red-900 dark:text-white leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 dark:bg-red-600 dark:opacity-100 rounded-full'
            ></span>
            <span className='relative text-xs'>Delete</span>
          </button>
        </div>
        
        {/* Modal */}
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
              toast.error(err.message)
            }
          }}
          user={user}
          refetch={refetch}
        />
      </td>
    </tr>
  )
}

export default UserDataRow
