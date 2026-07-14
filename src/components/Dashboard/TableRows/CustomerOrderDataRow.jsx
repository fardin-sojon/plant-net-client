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

  const { transactionId, items } = order || {}
  const firstItem = items?.[0] || {}
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

      {/* Category column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex flex-col gap-2 justify-around min-h-[40px]'>
          {items?.map((item, idx) => (
            <p key={idx} className='text-gray-900 dark:text-white h-10 flex items-center'>{item.category}</p>
          ))}
        </div>
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

      {/* Status column */}
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <div className='flex flex-col gap-2 justify-around min-h-[40px]'>
          {items?.map((item, idx) => {
            const { status } = item;
            if (status === 'Cancelled') {
              return (
                <div key={idx} className="h-10 flex items-center">
                  <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    Cancelled
                  </span>
                </div>
              )
            }
            let step = 0
            if (status === 'In Progress' || status === 'Shipped') step = 1
            if (status === 'Delivered') step = 2

            return (
              <div key={idx} className="h-10 flex items-center">
                <div className="flex flex-col gap-0.5 w-32">
                  <div className="flex items-center justify-between relative w-full px-2">
                    <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
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
                  <div className="text-[9px] font-bold text-lime-600 dark:text-lime-400 uppercase text-center mt-0.5">
                    {status}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </td>

      {/* Action column */}
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
            disabled={!canCancel}
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
          id={firstItem._id}
        />
        <PaymentDetailsModal isOpen={isPaymentModalOpen} closeModal={closePaymentModal} payment={payment} loading={loadingPayment} />
      </td>
    </tr>
  )
}

export default CustomerOrderDataRow
