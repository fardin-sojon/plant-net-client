import { useState } from 'react'
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { FaStore, FaCheck, FaCreditCard, FaShieldAlt, FaRocket, FaChartLine } from 'react-icons/fa'

const BecomeSellerModal = ({ closeModal, isOpen }) => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [loading, setLoading] = useState(false)

  // 1-Click Instant Payment & Application Submission Handler
  const handleInstantPayment = async () => {
    setLoading(true)

    try {
      // Simulate 1 second payment processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userEmail = user?.email || user?.providerData?.[0]?.email
      const txnId = 'TXN-SEL-' + Math.floor(100000 + Math.random() * 900000)

      await axiosSecure.patch(`/users/update/${userEmail}`, {
        status: 'Requested',
        transactionId: txnId,
        paymentStatus: 'Paid',
        fee: 29
      })

      toast.success(`Payment of $29 Successful! (Txn ID: ${txnId}). Application submitted! 🎉`)
      closeModal()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to complete registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-50 focus:outline-none'
      onClose={closeModal}
    >
      <div className='fixed inset-0 z-50 w-screen overflow-y-auto bg-black/60 backdrop-blur-xs'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white dark:bg-gray-800 p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-2xl rounded-3xl border border-gray-100 dark:border-gray-700'
          >
            {/* Header Icon & Title */}
            <div className='text-center mb-5'>
              <div className='w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs text-2xl'>
                <FaStore />
              </div>
              <DialogTitle
                as='h3'
                className='text-xl font-bold text-gray-900 dark:text-white'
              >
                Become a Seller on PlantNet!
              </DialogTitle>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Start selling your home garden plants and nursery products to thousands of plant lovers.
              </p>
            </div>

            {/* Seller Fee & Perks Card */}
            <div className='bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 mb-5'>
              <div className='flex items-baseline justify-between mb-3 border-b border-emerald-100 dark:border-emerald-900/40 pb-3'>
                <div>
                  <span className='text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider'>Seller Registration Fee</span>
                  <p className='text-[11px] text-gray-500 dark:text-gray-400'>One-time nursery verification</p>
                </div>
                <div className='text-right'>
                  <span className='text-2xl font-black text-emerald-600 dark:text-emerald-400'>$29</span>
                  <span className='text-xs text-gray-500 font-semibold'> USD</span>
                </div>
              </div>

              {/* Perks List */}
              <div className='space-y-2 text-xs text-gray-700 dark:text-gray-300'>
                <div className='flex items-center gap-2'>
                  <FaCheck className='text-emerald-500 flex-shrink-0' />
                  <span>Unlimited Plant & Inventory Listings 🪴</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaRocket className='text-emerald-500 flex-shrink-0' />
                  <span>Personalized Seller Dashboard & Store 🏪</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaChartLine className='text-emerald-500 flex-shrink-0' />
                  <span>Real-time Sales Analytics & Order Tracking 📊</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaShieldAlt className='text-emerald-500 flex-shrink-0' />
                  <span>Verified Nursery Badge on Marketplace 🎖️</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-2.5'>
              <button
                onClick={handleInstantPayment}
                disabled={loading}
                type='button'
                className='w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 text-sm'
              >
                <FaCreditCard />
                <span>{loading ? 'Processing $29 Payment...' : 'Proceed to Pay $29 USD'}</span>
              </button>

              <button
                type='button'
                onClick={closeModal}
                disabled={loading}
                className='w-full py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-semibold transition cursor-pointer'
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default BecomeSellerModal
