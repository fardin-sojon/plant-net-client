import { useState } from 'react'
import { MdPayment } from 'react-icons/md'
import DeleteModal from '../../Modal/DeleteModal'
import PaymentDetailsModal from '../../Modal/PaymentDetailsModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
const CustomerOrderDataRow = ({ order, handleDelete }) => {
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

  const { _id, image, name, category, price, quantity, status, address, transactionId } = order || {}

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
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex items-center'>
          <div className='shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={image}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
        </div>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white'>{category}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-white'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
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
            <div className="flex flex-col gap-1 w-32">
              <div className="flex items-center justify-between relative w-full px-2">
                <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
                  <div 
                    className="h-full bg-lime-500 transition-all duration-500" 
                    style={{ width: `${step === 0 ? '0%' : step === 1 ? '50%' : '100%'}` }}
                  />
                </div>

                <div 
                  className={`w-3 h-3 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                    step >= 0 ? 'bg-lime-500 border border-lime-500 shadow-sm' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  title="Ordered"
                />
                <div 
                  className={`w-3 h-3 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                    step >= 1 ? 'bg-lime-500 border border-lime-500 shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                  }`}
                  title="In Progress"
                />
                <div 
                  className={`w-3 h-3 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                    step >= 2 ? 'bg-lime-500 border border-lime-500 shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                  }`}
                  title="Delivered"
                />
              </div>
              <div className="text-[10px] font-bold text-lime-600 dark:text-lime-400 uppercase text-center mt-1">
                {status}
              </div>
            </div>
          )
        })()}
      </td>

      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex items-center gap-2'>
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
            disabled={status === 'Delivered' || status === 'In Progress'}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-lime-900 dark:text-white disabled:text-gray-400 dark:disabled:text-gray-500 leading-tight disabled:opacity-50'
          >
            <span className='absolute cursor-pointer inset-0 bg-red-200 opacity-50 dark:bg-red-600 dark:opacity-100 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-full'></span>
            <span className='relative cursor-pointer'>Cancel</span>
          </button>
        </div>

        <DeleteModal
          handleDelete={handleDelete}
          isOpen={isOpen}
          closeModal={closeModal}
          id={_id}
        />
        <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
      </td>
    </tr>
  )
}

export default CustomerOrderDataRow
