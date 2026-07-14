import { useState } from 'react'
import { MdPayment } from 'react-icons/md'
import DeleteModal from '../../Modal/DeleteModal'
import PaymentDetailsModal from '../../Modal/PaymentDetailsModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
const SellerOrderDataRow = ({order, handleDelete, handleStatusChange}) => {
  let [isOpen, setIsOpen] = useState(false)
  let [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  let [payment, setPayment] = useState(null)
  let [loadingPayment, setLoadingPayment] = useState(false)
  const axiosSecure = useAxiosSecure()
  const closeModal = () => setIsOpen(false)
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setPayment(null)
  }

  const { transactionId, customer, customerName, address, phone, items } = order
  const firstItem = items?.[0] || {}
  const status = firstItem.status || 'Pending'
  const canCancel = items?.every(item => item.status !== 'Delivered' && item.status !== 'In Progress')

  // Fetch payment details
  const handleViewPayment = async () => {
    setIsPaymentModalOpen(true)
    setLoadingPayment(true)
    try {
      const { data } = await axiosSecure.get(`/payment/${transactionId}`)
      setPayment(data)
    } catch (error) {
      console.error('Error fetching payment:', error)
      setPayment(null)
    } finally {
      setLoadingPayment(false)
    }
  }

  return (
    <tr>
      {/* Image column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex flex-col gap-2'>
          {items?.map((item, idx) => (
            <div key={idx} className='flex items-center'>
              <div className='shrink-0'>
                <div className='block relative'>
                  <img
                    alt='plant'
                    src={item.image}
                    className='mx-auto object-cover rounded h-10 w-15 '
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </td>

      {/* Name column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex flex-col gap-2 justify-around min-h-[40px]'>
          {items?.map((item, idx) => (
            <p key={idx} className='text-gray-900 dark:text-white h-10 flex items-center'>{item.name}</p>
          ))}
        </div>
      </td>

      {/* Customer column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        {customerName && (
          <p className='text-gray-900 dark:text-white font-medium whitespace-no-wrap'>{customerName}</p>
        )}
        <p className='text-gray-500 dark:text-gray-400 text-xs mt-0.5 whitespace-no-wrap'>
          {customer?.email || customer?.name || customer}
        </p>
      </td>

      {/* Price column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex flex-col gap-2 justify-around min-h-[40px]'>
          {items?.map((item, idx) => (
            <p key={idx} className='text-gray-900 dark:text-white h-10 flex items-center'>${item.price}</p>
          ))}
        </div>
      </td>

      {/* Quantity column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex flex-col gap-2 justify-around min-h-[40px]'>
          {items?.map((item, idx) => (
            <p key={idx} className='text-gray-900 dark:text-white h-10 flex items-center'>{item.quantity}</p>
          ))}
        </div>
      </td>

      {/* Address column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{address}</p>
        {phone && (
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-no-wrap'>
            Phone: {phone}
          </p>
        )}
      </td>

      {/* Status column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white whitespace-no-wrap font-semibold text-lime-600 dark:text-lime-400'>{status}</p>
      </td>

      {/* Action column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex items-center gap-2'>
          <select
            required
            className='p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800'
            name='category'
            value={status}
            onChange={(e)=> handleStatusChange(firstItem._id, e.target.value)}
            disabled={status === 'Delivered'}
          >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Delivered'>Delivered</option>
          </select>
          {/* Payment Icon */}
          <button
            onClick={handleViewPayment}
            className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2'
            title='View Payment Details'
          >
            <MdPayment className='h-5 w-5' />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            disabled={!canCancel}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 dark:text-white disabled:text-gray-400 dark:disabled:text-gray-500 leading-tight disabled:opacity-50'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 dark:bg-red-600 dark:opacity-100 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-full'
            ></span>
            <span className='relative'>Cancel</span>
          </button>
        </div>
        <DeleteModal isOpen={isOpen} closeModal={closeModal} handleDelete={handleDelete} id={firstItem._id}/>
        <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
      </td>
    </tr>
  )
}

export default SellerOrderDataRow
