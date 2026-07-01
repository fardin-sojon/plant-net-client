import { useState } from 'react'
import UpdateUserRoleModal from '../../Modal/UpdateUserRoleModal'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const UserDataRow = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const axiosSecure = useAxiosSecure()

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/users/${id}`)
      refetch()
      toast.success('User deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete user')
    }
  }
  const handleApprove = async () => {
    try {
      const targetRole = user?.role === 'customer' ? 'seller' : user?.role
      await axiosSecure.patch(`/users/update/${user?.email}`, {
        role: targetRole,
        status: 'Verified'
      })
      refetch()
      toast.success('User verified successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
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
        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full capitalize ${
          user?.role === 'admin' 
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
            : user?.role === 'seller'
              ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
        }`}>
          {user?.role}
        </span>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
            user?.status === 'Verified' 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
              : user?.status === 'Requested'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              user?.status === 'Verified' 
                ? 'bg-emerald-500' 
                : user?.status === 'Requested'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
            }`} />
            {user?.status || 'Unavailable'}
          </span>
          
          {(user?.status !== 'Verified' && (user?.status === 'Requested' || user?.role === 'admin' || user?.role === 'seller')) && (
            <button
              onClick={handleApprove}
              className='px-2.5 py-1 text-2xs font-extrabold text-white bg-lime-500 hover:bg-lime-600 rounded-lg cursor-pointer transition shadow-xs whitespace-nowrap'
              style={{ fontSize: '10px' }}
            >
              Approve
            </button>
          )}
        </div>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setIsOpen(true)}
            className='px-3 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg cursor-pointer transition'
          >
            Update Role
          </button>
          
          <button
            onClick={() => setIsDeleteOpen(true)}
            className='px-3 py-1 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-lg cursor-pointer transition'
          >
            Delete
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
        <DeleteModal
          isOpen={isDeleteOpen}
          closeModal={() => setIsDeleteOpen(false)}
          handleDelete={handleDelete}
          id={user?._id}
          itemName={user?.email}
        />
      </td>
    </tr>
  )
}

export default UserDataRow
