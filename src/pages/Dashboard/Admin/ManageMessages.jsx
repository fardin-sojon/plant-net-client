import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'

const ManageMessages = () => {
  const axiosSecure = useAxiosSecure()

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data } = await axiosSecure(`/contact-messages`)
      return data
    },
  })

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/contact-messages/${id}`)
      toast.success('Message deleted successfully')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Delete failed')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className='container mx-auto px-4 sm:px-8'>
      <div className='py-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>Contact Messages</h2>
        </div>
        <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
          <div className='inline-block min-w-full shadow rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            {messages.length === 0 ? (
              <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                No messages found.
              </div>
            ) : (
              <>
                {/* Desktop view */}
                <table className='min-w-full leading-normal hidden md:table'>
                  <thead>
                    <tr>
                      <th className='px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider'>
                        Sender
                      </th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider'>
                        Subject
                      </th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider'>
                        Message
                      </th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg._id}>
                        <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm'>
                          <p className='text-gray-900 dark:text-white font-semibold'>{msg.name}</p>
                          <p className='text-gray-500 dark:text-gray-400 text-xs'>{msg.email}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm'>
                          <p className='text-gray-900 dark:text-white font-medium'>{msg.subject}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm max-w-xs truncate'>
                          <p className='text-gray-700 dark:text-gray-300' title={msg.message}>
                            {msg.message}
                          </p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm'>
                          <p className='text-gray-900 dark:text-white'>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm'>
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold focus:outline-none'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile view */}
                <div className='md:hidden divide-y divide-gray-200 dark:divide-gray-700'>
                  {messages.map((msg) => (
                    <div key={msg._id} className='p-4 space-y-2'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='text-sm font-semibold text-gray-900 dark:text-white'>{msg.name}</p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{msg.email}</p>
                        </div>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase'>Subject</p>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>{msg.subject}</p>
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase'>Message</p>
                        <p className='text-sm text-gray-700 dark:text-gray-300 break-words'>{msg.message}</p>
                      </div>
                      <div className='pt-2 flex justify-end'>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className='text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-900/50'
                        >
                          Delete Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageMessages
