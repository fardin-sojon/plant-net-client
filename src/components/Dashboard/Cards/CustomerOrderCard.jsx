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
              {(() => {
                if (status === 'Cancelled') {
                  return (
                    <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                      Cancelled
                    </span>
                  )
                }
                let step = 0
                if (status === 'In Progress' || status === 'Shipped') step = 1
                if (status === 'Delivered') step = 2

                return (
                  <div className="flex flex-col gap-1 w-28">
                    <div className="flex items-center justify-between relative w-full px-1">
                      <div className="absolute top-1/2 left-1.5 right-1.5 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
                        <div 
                          className="h-full bg-lime-500 transition-all duration-500" 
                          style={{ width: `${step === 0 ? '0%' : step === 1 ? '50%' : '100%'}` }}
                        />
                      </div>

                      <div 
                        className={`w-2.5 h-2.5 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                          step >= 0 ? 'bg-lime-500 border border-lime-500 shadow-sm' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        title="Ordered"
                      />
                      <div 
                        className={`w-2.5 h-2.5 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                          step >= 1 ? 'bg-lime-500 border border-lime-500 shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}
                        title="In Progress"
                      />
                      <div 
                        className={`w-2.5 h-2.5 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                          step >= 2 ? 'bg-lime-500 border border-lime-500 shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}
                        title="Delivered"
                      />
                    </div>
                    <div className="text-[9px] font-bold text-lime-600 dark:text-lime-400 uppercase text-center mt-1">
                      {status}
                    </div>
                  </div>
                )
              })()}
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
