import { useState } from 'react'
import UpdateUserRoleModal from '../../Modal/UpdateUserRoleModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const UserDataRow = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const axiosSecure = useAxiosSecure()

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{user?.email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap capitalize'>{user?.role}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
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

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <button
          onClick={() => setIsOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Update Role</span>
        </button>
        {/* Modal */}
        <UpdateUserRoleModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={() => setIsOpen(false)}
          role={user?.role}
          updateRole={async (selectedRole) => {
            if (user?.role === selectedRole) return setIsOpen(false)
            try {
              // Note: using fetch/axios inside here requires hook/auth which UserDataRow has access to via parent or context?
              // Wait, refetch and user are passed. We need axiosSecure here. Or better, pass handleUpdate function from parent?
              // No, UserDataRow can use hooks if it's a component.
              // Let's assume we can fetch or use axios here. But hooks rules... UserDataRow is a component.
              // I will use useAxiosSecure inside UserDataRow.
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
      </td>
    </tr>
  )
}

export default UserDataRow
