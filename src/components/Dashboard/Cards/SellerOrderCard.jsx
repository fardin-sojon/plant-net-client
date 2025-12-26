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

  const { _id, name, customer, price, quantity, status, address, image, transactionId } = order

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
    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-3'>
       {/* Name & Image  */}
       <div className='flex justify-between items-center gap-3'>
          <div className='flex items-center gap-3'>
            <img
              alt='product'
              src={image}
              className='object-cover rounded h-12 w-12'
            />
            <p className='font-bold text-gray-900 dark:text-white'>{name}</p>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'Delivered' ? 'bg-green-100 text-green-800' :
            status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
             {status}
          </span>
       </div>
       
       <div className='text-sm space-y-1 text-gray-600 dark:text-gray-300'>
          <p><span className='font-semibold'>Customer:</span> {customer?.email || customer?.name || customer}</p>
          <p><span className='font-semibold'>Address:</span> {address}</p>
       </div>

      <div className='grid grid-cols-2 gap-4 text-sm'>
         <div className='bg-gray-50 dark:bg-gray-700 p-2 rounded'>
            <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>Price</p>
            <p className='font-medium dark:text-gray-100'>${price}</p>
         </div>
         <div className='bg-gray-50 dark:bg-gray-700 p-2 rounded'>
             <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>Qty</p>
             <p className='font-medium dark:text-gray-100'>{quantity}</p>
         </div>
      </div>

       <hr className='border-gray-100 dark:border-gray-700'/>
      
      {/* Actions */}
      <div className='flex items-center gap-2 mt-2'>
        <select
            required
            className='p-1 border border-gray-300 rounded-md text-sm text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1'
            name='category'
            value={status}
            onChange={(e)=> handleStatusChange(_id, e.target.value)}
            disabled={status === 'Delivered'}
        >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Delivered'>Delivered</option>
        </select>
        
        <button
            onClick={handleViewPayment}
            className='bg-blue-100 dark:bg-blue-200 text-blue-700 dark:text-blue-900 p-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-300 transition'
            title='View Payment'
        >
            <MdPayment className='h-5 w-5' />
        </button>
        
        <button
            onClick={() => setIsOpen(true)}
            disabled={status === 'Delivered' || status === 'In Progress'}
            className='disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed  bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-900 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition'
        >
            Cancel
        </button>
      </div>

       <DeleteModal isOpen={isOpen} closeModal={closeModal} handleDelete={handleDelete} id={_id}/>
       <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
    </div>
  )
}

export default SellerOrderCard
