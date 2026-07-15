import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Container from '../Shared/Container'
import { FaTag, FaCopy, FaCheck } from 'react-icons/fa'

const CouponsOffers = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios(`${import.meta.env.VITE_API_URL}/public-coupons`)
        setCoupons(data)
      } catch (err) {
        console.error('Error fetching public coupons:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code "${code}" copied!`)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  if (loading) return null // Hide section during initial loading
  if (coupons.length === 0) return null // Hide if no active coupons exist

  return (
    <div className='py-10 bg-lime-50/30 dark:bg-gray-900/40 border-y border-lime-100/30 dark:border-gray-800 transition-colors duration-300'>
      <Container>
        <div className='text-center max-w-xl mx-auto mb-8'>
          <span className='px-3 py-1 bg-lime-100 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400 text-xs font-bold rounded-full uppercase tracking-wider'>
            Special Deals
          </span>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mt-3'>
            Active Promotional Offers
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            Apply these limited-time coupon codes at checkout to save big on your green friends!
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'>
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-dashed border-lime-200 dark:border-gray-700 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden'
            >
              {/* Ticket cut-outs (Left/Right side cutouts for a real ticket effect) */}
              <div className='absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-lime-50/80 dark:bg-gray-950 border-r-2 border-dashed border-lime-200 dark:border-gray-700 z-10' />
              <div className='absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-lime-50/80 dark:bg-gray-950 border-l-2 border-dashed border-lime-200 dark:border-gray-700 z-10' />

              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='p-3 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400'>
                    <FaTag className='text-lg' />
                  </div>
                  <div>
                    <h3 className='font-black text-2xl text-lime-600 dark:text-lime-400'>
                      {coupon.discountType === 'percent' ? `${coupon.discountAmount}% OFF` : `$${coupon.discountAmount} OFF`}
                    </h3>
                    <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider font-bold'>
                      {coupon.discountType === 'percent' ? 'Percentage Discount' : 'Fixed Flat discount'}
                    </p>
                  </div>
                </div>

                <p className='text-sm text-gray-650 dark:text-gray-300 mb-6 px-1 line-clamp-2'>
                  Save big on all plants in your cart. Valid for all users.
                </p>
              </div>

              {/* Coupon Code copy section */}
              <div className='flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800'>
                <span className='font-mono font-extrabold text-gray-800 dark:text-white select-all text-base tracking-wider px-2'>
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className='p-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold'
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <FaCheck className='text-[10px]' />
                      Copied
                    </>
                  ) : (
                    <>
                      <FaCopy className='text-[10px]' />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default CouponsOffers
