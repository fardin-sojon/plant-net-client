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

  const { transactionId, items } = order || {}
  const firstItem = items?.[0] || {}
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
      {/* Transaction ID & Date Header */}
      <div className='flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-100 dark:border-gray-700'>
        <span>Order: #{transactionId?.slice(-8)}</span>
        <span>{items?.[0]?.createdAt && new Date(items[0].createdAt).toLocaleDateString()}</span>
      </div>

      {/* Items List */}
      <div className='space-y-3'>
        {items?.map((item, idx) => {
          const { image, name, category, price, quantity, status } = item;
          return (
            <div key={idx} className='flex items-center gap-3 justify-between border-b border-dashed border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0'>
              <div className='flex items-center gap-3'>
                <img
                  alt='plant'
                  src={image}
                  className='object-cover rounded h-12 w-16'
                />
                <div>
                  <p className='font-bold text-sm text-gray-900 dark:text-white'>{name}</p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>{category}</p>
                  <p className='text-xs text-lime-600 dark:text-lime-400 font-semibold mt-0.5'>Qty: {quantity} x ${price}</p>
                </div>
              </div>
              <div>
                {status === 'Cancelled' ? (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Cancelled
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold text-lime-600 dark:text-lime-400 uppercase">
                    {status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Grid: Summary */}
      <div className='grid grid-cols-2 gap-2 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded'>
         <div>
            <p className='text-xs uppercase text-gray-500 dark:text-gray-300'>Order Total</p>
            <p className='font-bold text-lg dark:text-gray-100 text-lime-600 dark:text-lime-400'>${totalAmount?.toFixed(2)}</p>
         </div>
         <div className='text-right flex flex-col justify-center'>
             <p className='text-xs uppercase text-gray-500 dark:text-gray-300'>Total Items</p>
             <p className='font-medium dark:text-gray-100'>{items?.reduce((sum, i) => sum + i.quantity, 0)}</p>
         </div>
      </div>

      {/* Actions */}
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
          disabled={!canCancel}
          className='disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-900 px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-200 dark:hover:bg-red-300 transition'
        >
          Cancel Order
        </button>
      </div>

      <DeleteModal
        handleDelete={handleDelete}
        isOpen={isOpen}
        closeModal={closeModal}
        id={firstItem._id}
      />
      <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
    </div>
  )
}

export default CustomerOrderCard
