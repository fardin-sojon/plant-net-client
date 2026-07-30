import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router'
import axios from 'axios'
import toast from 'react-hot-toast'
import Container from '../../components/Shared/Container'
import { FaSearch, FaCopy, FaTruck, FaBox, FaClock, FaCheckCircle, FaQuestionCircle, FaArrowLeft, FaFlask, FaMapMarkerAlt, FaPhoneAlt, FaUser } from 'react-icons/fa'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'

const DEMO_ORDERS = [
  {
    orderId: 'PN-ORD-123456',
    transactionId: 'PN-TX-COD-123456',
    customer: 'demo@plantnet.com',
    customerName: 'Fardin Rahman Sojon',
    status: 'Shipped',
    name: 'Swiss Cheese Monstera Deliciosa',
    category: 'Indoor Plants',
    quantity: 2,
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=60',
    address: '742 Evergreen Terrace, Rajshahi / Dhaka',
    phone: '+880 1712-345678',
    paymentType: 'COD / PlantNet',
    createdAt: new Date()
  },
  {
    orderId: 'PN-ORD-123456',
    transactionId: 'PN-TX-COD-123456',
    customer: 'demo@plantnet.com',
    customerName: 'Fardin Rahman Sojon',
    status: 'Shipped',
    name: 'Fiddle Leaf Fig Tree',
    category: 'Indoor Plants',
    quantity: 1,
    price: 49.50,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=60',
    address: '742 Evergreen Terrace, Rajshahi / Dhaka',
    phone: '+880 1712-345678',
    paymentType: 'COD / PlantNet',
    createdAt: new Date()
  }
]

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [orderIdInput, setOrderIdInput] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e, overrideQuery) => {
    if (e) e.preventDefault()
    const query = (overrideQuery !== undefined ? overrideQuery : orderIdInput).trim()
    if (!query) {
      toast.error('Please enter an Order ID or Transaction ID')
      return
    }

    setLoading(true)
    setError('')
    setOrders([])
    setSearched(true)

    // Instant client-side check for Demo Order
    const qLower = query.toLowerCase()
    if (qLower.includes('demo') || qLower === 'pn-ord-123456' || qLower === 'pn-tx-cod-123456' || qLower === 'ord-demo123' || qLower === 'demo') {
      setTimeout(() => {
        setOrders(DEMO_ORDERS)
        setLoading(false)
      }, 200)
      return
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/track/${encodeURIComponent(query)}`)
      if (res.data && res.data.orders && res.data.orders.length > 0) {
        setOrders(res.data.orders)
      } else {
        setError('No order found with this Order ID or Transaction ID.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No order found with this Order ID.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const stateId = location.state?.searchId
    const paramId = searchParams.get('id')
    const targetId = stateId || paramId

    if (paramId) {
      // Clean query params so URL stays clean (localhost:5173/dashboard/track-order)
      setSearchParams({}, { replace: true })
    }

    if (targetId) {
      setOrderIdInput(targetId)
      handleTrack(null, targetId)
    }
  }, [location.state])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleTryDemo = () => {
    setOrderIdInput('PN-ORD-123456')
    handleTrack(null, 'PN-ORD-123456')
  }

  // Determine highest progress status from order items
  const mainOrder = orders[0]

  const getStatusStep = (status) => {
    const s = (status || 'Pending').toLowerCase()
    if (s === 'delivered') return 4
    if (s === 'shipped') return 3
    if (s === 'in progress' || s === 'processing') return 2
    return 1 // Pending
  }

  const currentStep = mainOrder ? getStatusStep(mainOrder.status) : 1
  const totalPrice = orders.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)

  return (
    <div className='py-12 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 transition-colors'>
      <Container>
        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Header */}
          <div className='text-center space-y-3'>
            <span className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-700 dark:text-lime-300 font-semibold text-xs uppercase tracking-wider'>
              <FaTruck /> Live Order Tracking
            </span>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white'>
              Track Your Plant Order
            </h1>
            <p className='text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto'>
              Enter your Order ID, Transaction ID, or Email address to track live status and shipment updates.
            </p>
          </div>

          {/* Search Box & Quick Demo */}
          <div className='bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/80 max-w-2xl mx-auto space-y-4'>
            <form onSubmit={handleTrack} className='flex flex-col sm:flex-row gap-3'>
              <div className='relative flex-1'>
                <FaSearch className='absolute left-4 top-4 text-gray-400 text-sm' />
                <input
                  type='text'
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder='Enter Order ID (e.g. PN-84920, PN-COD-7X9K, or Email)'
                  className='w-full pl-11 pr-4 py-3.5 text-sm sm:text-base rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition'
                />
              </div>
              <button
                type='submit'
                className='px-6 py-3.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base'
              >
                <FaSearch /> Track Order
              </button>
            </form>

            {/* Quick Demo Button */}
            <div className='flex items-center justify-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs'>
              <span className='text-gray-400'>Want to test right now?</span>
              <button
                onClick={handleTryDemo}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl shadow transition cursor-pointer'
              >
                <FaFlask /> Click to Test Demo Order (PN-DEMO123)
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className='py-12 flex justify-center'>
              <LoadingSpinner />
            </div>
          )}

          {/* Error / Not Found */}
          {error && !loading && (
            <div className='bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-6 rounded-3xl text-center space-y-4 max-w-2xl mx-auto'>
              <div>
                <p className='text-red-600 dark:text-red-400 font-bold text-base'>{error}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  If you haven't placed an order yet, you can test the tracking timeline instantly using our Demo Order!
                </p>
              </div>
              <button
                onClick={handleTryDemo}
                className='px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-2xl shadow transition text-sm cursor-pointer'
              >
                <FaFlask className='inline mr-2' /> Load Demo Order Tracking
              </button>
            </div>
          )}

          {/* Order Details & Stepper */}
          {orders.length > 0 && !loading && (
            <div className='space-y-6'>
              {/* Top Banner Card */}
              <div className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase text-gray-400'>
                    <span>Order Reference</span>
                  </div>
                  <div className='flex items-center gap-2 mt-1'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-mono'>
                      {mainOrder.orderId || mainOrder.transactionId}
                    </h2>
                    <button
                      onClick={() => handleCopy(mainOrder.orderId || mainOrder.transactionId)}
                      className='p-1.5 text-gray-400 hover:text-lime-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer'
                      title='Copy Order ID'
                    >
                      <FaCopy />
                    </button>
                  </div>
                  <p className='text-xs text-gray-400 mt-1'>
                    Placed on {new Date(mainOrder.createdAt || mainOrder.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                <div className='flex items-center gap-3'>
                  <span className={`px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider ${
                    mainOrder.status === 'Delivered'
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : mainOrder.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {mainOrder.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Status Stepper Progress */}
              <div className='bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700'>
                <h3 className='text-base font-bold text-gray-900 dark:text-white mb-8'>Shipment Progress</h3>
                
                <div className='relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0'>
                  {/* Progress Line Behind Icons (Desktop) */}
                  <div className='hidden md:block absolute left-8 right-8 top-5 h-1 bg-gray-100 dark:bg-gray-700 -z-0'>
                    <div
                      className='h-full bg-lime-500 transition-all duration-500'
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>
                  </div>

                  {/* Step 1 */}
                  <div className='relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition ${
                      currentStep >= 1 ? 'bg-lime-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <FaBox />
                    </div>
                    <div>
                      <p className='font-bold text-sm text-gray-800 dark:text-white'>Order Placed</p>
                      <p className='text-xs text-gray-400'>Order confirmed</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className='relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition ${
                      currentStep >= 2 ? 'bg-lime-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <FaClock />
                    </div>
                    <div>
                      <p className='font-bold text-sm text-gray-800 dark:text-white'>Processing</p>
                      <p className='text-xs text-gray-400'>Preparing plants</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className='relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition ${
                      currentStep >= 3 ? 'bg-lime-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <FaTruck />
                    </div>
                    <div>
                      <p className='font-bold text-sm text-gray-800 dark:text-white'>Shipped</p>
                      <p className='text-xs text-gray-400'>On the way</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className='relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition ${
                      currentStep >= 4 ? 'bg-lime-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className='font-bold text-sm text-gray-800 dark:text-white'>Delivered</p>
                      <p className='text-xs text-gray-400'>Package received</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Info Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Shipping Details */}
                <div className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4'>
                  <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <FaMapMarkerAlt className='text-lime-500' /> Delivery Information
                  </h3>
                  <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                    <p className='flex items-center gap-2'>
                      <FaUser className='text-gray-400 text-xs' />
                      <span className='font-semibold text-gray-800 dark:text-white'>{mainOrder.customerName || 'Customer'}</span>
                    </p>
                    <p className='flex items-center gap-2'>
                      <FaMapMarkerAlt className='text-gray-400 text-xs' />
                      <span>{mainOrder.address}</span>
                    </p>
                    {mainOrder.phone && (
                      <p className='flex items-center gap-2'>
                        <FaPhoneAlt className='text-gray-400 text-xs' />
                        <span>{mainOrder.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className='bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4'>
                  <h3 className='text-base font-bold text-gray-900 dark:text-white'>Payment Overview</h3>
                  <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                    <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-700/50'>
                      <span>Payment Method</span>
                      <span className='font-semibold text-gray-800 dark:text-white uppercase'>{mainOrder.paymentType || 'Card / Stripe'}</span>
                    </div>
                    <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-700/50'>
                      <span>Total Items</span>
                      <span className='font-semibold text-gray-800 dark:text-white'>{orders.length} Plant(s)</span>
                    </div>
                    <div className='flex justify-between py-1 pt-2 font-bold text-base text-gray-900 dark:text-white'>
                      <span>Total Amount</span>
                      <span className='text-lime-600 dark:text-lime-400'>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
                <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
                  <h3 className='text-base font-bold text-gray-900 dark:text-white'>Ordered Items</h3>
                </div>

                <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                  {orders.map((item, idx) => (
                    <div key={idx} className='p-4 sm:p-5 flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-gray-700'
                        />
                        <div>
                          <h4 className='font-bold text-gray-800 dark:text-white text-base'>{item.name}</h4>
                          <p className='text-xs text-gray-400'>{item.category} • Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold text-gray-900 dark:text-white text-base'>${(item.price * item.quantity).toFixed(2)}</p>
                        <p className='text-xs text-gray-400'>${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Guide Box explaining all 4 ways to track */}
          {!searched && (
            <div className='bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 max-w-2xl mx-auto'>
              <h3 className='font-bold text-gray-900 dark:text-white text-base flex items-center gap-2'>
                <FaQuestionCircle className='text-lime-500' /> What can you search with?
              </h3>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
                <div className='p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60'>
                  <p className='font-bold text-gray-900 dark:text-white mb-1'>1️⃣ Order ID</p>
                  <p className='text-xs text-gray-400'>e.g., <code className='text-lime-600 dark:text-lime-400 font-mono'>PN-ORD-849201</code> (Found on order success screen & My Orders)</p>
                </div>

                <div className='p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60'>
                  <p className='font-bold text-gray-900 dark:text-white mb-1'>2️⃣ Transaction ID</p>
                  <p className='text-xs text-gray-400'>e.g., <code className='text-lime-600 dark:text-lime-400 font-mono'>PN-TX-COD-749201</code> or <code className='text-lime-600 dark:text-lime-400 font-mono'>pi_3Tnj...</code></p>
                </div>

                <div className='p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60'>
                  <p className='font-bold text-gray-900 dark:text-white mb-1'>3️⃣ Cash On Delivery ID</p>
                  <p className='text-xs text-gray-400'>e.g., <code className='text-lime-600 dark:text-lime-400 font-mono'>PN-TX-COD-749201</code> (From COD order placement)</p>
                </div>

                <div className='p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60'>
                  <p className='font-bold text-gray-900 dark:text-white mb-1'>4️⃣ Your Account Email</p>
                  <p className='text-xs text-gray-400'>e.g., <code className='text-lime-600 dark:text-lime-400 font-mono'>your.email@example.com</code> (Searches all your active orders)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default TrackOrder
