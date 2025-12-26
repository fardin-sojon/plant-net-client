import { useState } from 'react'
import { MdPayment } from 'react-icons/md'
import DeleteModal from '../../Modal/DeleteModal'
import PaymentDetailsModal from '../../Modal/PaymentDetailsModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const CustomerOrderCard = ({ order, handleDelete }) => {
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

  const { _id, image, name, category, price, quantity, status, transactionId } = order || {}

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
       {/* Top Row: Image & Name */}
       <div className='flex items-center gap-3'>
          <img
            alt='plant'
            src={image}
            className='object-cover rounded h-12 w-16'
          />
          <div>
            <p className='font-bold text-gray-900 dark:text-white'>{name}</p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>{category}</p>
          </div>
          <div className='ml-auto'>
              <span className={`text-xs px-2 py-1 rounded-full ${
                status === 'Delivered' ? 'bg-green-100 text-green-800' :
                status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {status}
            </span>
          </div>
       </div>

      {/* Details Grid */}
      <div className='grid grid-cols-2 gap-2 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded'>
         <div>
            <p className='text-xs uppercase text-gray-500 dark:text-gray-300'>Price</p>
            <p className='font-medium dark:text-gray-100'>${price}</p>
         </div>
         <div className='text-right'>
             <p className='text-xs uppercase text-gray-500 dark:text-gray-300'>Quantity</p>
             <p className='font-medium dark:text-gray-100'>{quantity}</p>
         </div>
      </div>

       <div className='flex justify-end gap-2 pt-2'>
        <button
          onClick={handleViewPayment}
          className='bg-blue-100 dark:bg-blue-200 text-blue-700 dark:text-blue-900 px-3 py-2 rounded-md font-semibold text-sm hover:bg-blue-200 dark:hover:bg-blue-300 transition flex items-center gap-1'
        >
          <MdPayment className='h-4 w-4' />
          Payment
        </button>
        <button
          onClick={() => setIsOpen(true)}
          disabled={status === 'Delivered' || status === 'In Progress'}
          className='disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-900 px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-200 dark:hover:bg-red-300 transition'
        >
          Cancel Order
        </button>
       </div>

        <DeleteModal
          handleDelete={handleDelete}
          isOpen={isOpen}
          closeModal={closeModal}
          id={_id}
        />
        <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
    </div>
  )
}

export default CustomerOrderCard
