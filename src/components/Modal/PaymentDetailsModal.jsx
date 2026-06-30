import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'

const PaymentDetailsModal = ({ isOpen, closeModal, payment, loading }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center'
                >
                  Payment Details
                  <button
                    onClick={closeModal}
                    className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                  >
                    <AiOutlineClose className='h-5 w-5' />
                  </button>
                </Dialog.Title>

                {loading ? (
                  <div className='mt-4 flex justify-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500'></div>
                  </div>
                ) : payment ? (
                  <div className='mt-4 space-y-3'>
                    <div className='border-b dark:border-gray-700 pb-2'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Transaction ID</p>
                      <div className='flex items-center justify-between gap-2 mt-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-white break-all'>
                          {payment.paymentIntentId 
                            ? `${payment.paymentIntentId.slice(0, 10)}...${payment.paymentIntentId.slice(-6)}` 
                            : 'N/A'}
                        </p>
                        {payment.paymentIntentId && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(payment.paymentIntentId)
                              toast.success('Copied to clipboard!')
                            }}
                            className='cursor-pointer text-xs bg-lime-100 hover:bg-lime-200 dark:bg-lime-900 dark:hover:bg-lime-800 text-lime-800 dark:text-lime-200 px-2 py-1 rounded transition'
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>

                    <div className='border-b dark:border-gray-700 pb-2'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Customer</p>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {payment.customerName ? `${payment.customerName} (${payment.customer})` : payment.customer}
                      </p>
                    </div>

                    <div className='border-b dark:border-gray-700 pb-2'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Amount</p>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {payment.currency?.toLowerCase() === 'bdt' ? '৳' : '$'}{payment.amount} {payment.currency?.toUpperCase()}
                      </p>
                    </div>

                    <div className='border-b dark:border-gray-700 pb-2'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Payment Status</p>
                      <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                        {payment.paymentStatus}
                      </p>
                    </div>

                    {payment.address && (
                      <div className='border-b dark:border-gray-700 pb-2'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Shipping Address</p>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {payment.address}
                        </p>
                      </div>
                    )}

                    {payment.phone && (
                      <div className='border-b dark:border-gray-700 pb-2'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Phone Number</p>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {payment.phone}
                        </p>
                      </div>
                    )}

                    <div className='border-b dark:border-gray-700 pb-2'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Items</p>
                      <div className='mt-2 space-y-2'>
                        {payment.items?.map((item, index) => (
                          <div key={index} className='text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded'>
                            <p className='font-medium'>{item.name}</p>
                            <p className='text-xs text-gray-600 dark:text-gray-300'>
                              Qty: {item.quantity} × {payment.currency?.toLowerCase() === 'bdt' ? '৳' : '$'}{item.price} = {payment.currency?.toLowerCase() === 'bdt' ? '৳' : '$'}{item.quantity * item.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Date</p>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='mt-4'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      No payment information found for this order.
                    </p>
                  </div>
                )}

                <div className='mt-6'>
                  <button
                    type='button'
                    className='w-full inline-flex justify-center rounded-md border border-transparent bg-lime-100 dark:bg-lime-900 px-4 py-2 text-sm font-medium text-lime-900 dark:text-lime-100 hover:bg-lime-200 dark:hover:bg-lime-800 focus:outline-none'
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

PaymentDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  payment: PropTypes.object,
  loading: PropTypes.bool
}

export default PaymentDetailsModal
