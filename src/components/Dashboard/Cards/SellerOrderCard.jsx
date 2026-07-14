import { useState } from 'react'
import { MdPayment } from 'react-icons/md'
import DeleteModal from '../../Modal/DeleteModal'
import PaymentDetailsModal from '../../Modal/PaymentDetailsModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const SellerOrderCard = ({ order, handleDelete, handleStatusChange }) => {
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
  const totalAmount = items?.reduce((sum, item) => sum + item.price * item.quantity, 0)
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
    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-4'>
       {/* Header: Customer and Transaction details */}
       <div className='flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-100 dark:border-gray-700'>
          <span>Order: #{transactionId?.slice(-8)}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' :
            status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' :
            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
          }`}>
             {status}
          </span>
       </div>

       {/* Customer & Address details */}
       <div className='text-sm space-y-1 text-gray-600 dark:text-gray-300'>
          <p><span className='font-semibold'>Customer:</span> {customerName || customer?.name || customer?.email || customer}</p>
          <p><span className='font-semibold'>Address:</span> {address}</p>
          {phone && <p><span className='font-semibold'>Phone:</span> {phone}</p>}
       </div>

       {/* Items list for this seller */}
       <div className='space-y-3 pt-2'>
         {items?.map((item, idx) => (
           <div key={idx} className='flex items-center gap-3 justify-between border-b border-dashed border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0'>
              <div className='flex items-center gap-3'>
                <img
                  alt='product'
                  src={item.image}
                  className='object-cover rounded h-12 w-12'
                />
                <div>
                  <p className='font-bold text-sm text-gray-900 dark:text-white'>{item.name}</p>
                  <p className='text-xs text-lime-600 dark:text-lime-400 font-semibold'>Qty: {item.quantity} x ${item.price}</p>
                </div>
              </div>
           </div>
         ))}
       </div>

       <div className='grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-2.5 rounded'>
          <div>
             <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>Seller Revenue</p>
             <p className='font-bold text-base text-lime-600 dark:text-lime-400'>${totalAmount?.toFixed(2)}</p>
          </div>
          <div className='text-right flex flex-col justify-center'>
              <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>Total Qty</p>
              <p className='font-medium dark:text-gray-100'>{items?.reduce((sum, i) => sum + i.quantity, 0)}</p>
          </div>
       </div>

       <hr className='border-gray-100 dark:border-gray-700'/>
      
       {/* Actions */}
       <div className='flex items-center gap-2 mt-2'>
         <select
             required
             className='p-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1'
             name='category'
             value={status}
             onChange={(e)=> handleStatusChange(firstItem._id, e.target.value)}
             disabled={status === 'Delivered'}
         >
             <option value='Pending'>Pending</option>
             <option value='In Progress'>In Progress</option>
             <option value='Delivered'>Delivered</option>
         </select>
         
         <button
             onClick={handleViewPayment}
             className='bg-blue-100 dark:bg-blue-200 text-blue-700 dark:text-blue-900 p-2.5 rounded-md hover:bg-blue-200 dark:hover:bg-blue-300 transition'
             title='View Payment'
         >
             <MdPayment className='h-5 w-5' />
         </button>
         
         <button
             onClick={() => setIsOpen(true)}
             disabled={!canCancel}
             className='disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed  bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-900 px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition'
         >
             Cancel
         </button>
       </div>

       <DeleteModal isOpen={isOpen} closeModal={closeModal} handleDelete={handleDelete} id={firstItem._id}/>
       <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
    </div>
  )
}

export default SellerOrderCard
