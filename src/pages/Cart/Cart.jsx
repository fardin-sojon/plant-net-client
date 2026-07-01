import useCart from '../../hooks/useCart'
import Container from '../../components/Shared/Container'
import { Link, useNavigate } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')

  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const email = user?.email || user?.providerData?.[0]?.email

  // Fetch dbUser to get saved address and phone
  const { data: dbUser } = useQuery({
    queryKey: ['dbUser', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/users/${email}`)
      return res.data
    }
  })

  useEffect(() => {
    if (dbUser) {
      if (dbUser.name) setRecipientName(dbUser.name)
      else if (user?.displayName) setRecipientName(user.displayName)

      if (dbUser.address) setAddress(dbUser.address)
      if (dbUser.phone) setPhone(dbUser.phone)
    } else if (user?.displayName) {
      setRecipientName(user.displayName)
    }
  }, [dbUser, user])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const { data } = await axiosSecure.post('/coupons/apply', {
        code: couponCode.trim(),
        cartTotal: cartTotal
      })
      setDiscount(data.discount)
      setAppliedCoupon(couponCode.trim().toUpperCase())
      toast.success(`Coupon "${couponCode.toUpperCase()}" applied! Saved $${data.discount.toFixed(2)}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code')
      setDiscount(0)
      setAppliedCoupon('')
    }
  }

  // Recalculate coupon if cart total changes
  useEffect(() => {
    if (appliedCoupon) {
      const recalculate = async () => {
        try {
          const { data } = await axiosSecure.post('/coupons/apply', {
            code: appliedCoupon,
            cartTotal: cartTotal
          })
          setDiscount(data.discount)
        } catch (err) {
          setDiscount(0)
          setAppliedCoupon('')
        }
      }
      recalculate()
    } else {
      setDiscount(0)
    }
  }, [cartTotal, appliedCoupon, axiosSecure])

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!recipientName.trim() || !address.trim() || !phone.trim()) {
      toast.error('Please fill in name, address and phone number!')
      return
    }

    setLoading(true)
    try {
      // 1. Send cart items to backend to create order and get payment session
      const { data } = await axiosSecure.post('/create-checkout-session', {
        items: cart,
        couponCode: appliedCoupon || null,
        customer: {
            name: user?.displayName,
            email: user?.email || user?.providerData?.[0]?.email,
            image: user?.photoURL,
            recipientName: recipientName.trim(),
            address: address.trim(),
            phone: phone.trim()
        },
      })
      
      // 2. Redirect to Stripe
      window.location.replace(data.url)

    } catch (err) {
      console.error(err)
      toast.error('Checkout failed')
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <Container>
      <div className='py-10 max-w-4xl mx-auto'>
        <h2 className='text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white'>Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className='text-center'>
             <p className='text-lg text-gray-600 mb-4'>Your cart is empty.</p>
             <Link to='/' className='btn btn-outline btn-success'>Continue Shopping</Link>
          </div>
        ) : (
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Cart Items */}
            <div className='flex-1 flex flex-col gap-4'>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className='flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-20 h-20 object-cover rounded-lg'
                  />
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>{item.name}</h3>
                    <p className='text-gray-500 dark:text-gray-300'>${item.price}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className='flex items-center gap-2'>
                     <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className='px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded'
                        disabled={item.quantity <= 1}
                     >-</button>
                     <span className='font-medium dark:text-white'>{item.quantity}</span>
                     <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className='px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded'
                        disabled={item.quantity >= item.stock} // Assuming logic if stock exists
                     >+</button>
                  </div>

                  <div className='font-bold text-gray-700 dark:text-gray-200 w-20 text-right'>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className='text-red-500 hover:text-red-700 p-2'
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
               <button onClick={clearCart} className='text-red-500 text-sm hover:underline self-start mt-2'>Clear Cart</button>
            </div>

            {/* Order Summary */}
            <div className='w-full md:w-80 h-fit bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700'>
              <h3 className='text-xl font-bold mb-4 border-b pb-2 dark:text-white dark:border-gray-700'>Order Summary</h3>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-600 dark:text-gray-300'>Subtotal</span>
                <span className='font-semibold dark:text-white'>${cartTotal.toFixed(2)}</span>
              </div>
               <div className='flex justify-between items-center mb-4'>
                <span className='text-gray-600 dark:text-gray-300'>Shipping</span>
                <span className='font-semibold dark:text-white'>Free</span>
              </div>

              {/* Promo Coupon Section */}
              <div className="border-t pt-4 mb-4 dark:border-gray-700">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="flex-1 text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase disabled:opacity-50"
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={() => {
                        setAppliedCoupon('')
                        setCouponCode('')
                        setDiscount(0)
                      }}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-lime-500 text-white text-xs font-bold rounded-md hover:bg-lime-600 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-lime-600 dark:text-lime-400 font-bold mt-1.5">
                    ✓ Code "{appliedCoupon}" applied
                  </p>
                )}
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center mb-4 text-lime-600 dark:text-lime-400 font-bold text-sm">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className='flex justify-between items-center mb-6 text-xl font-bold border-t pt-4 dark:border-gray-700 dark:text-white'>
                 <span>Total</span>
                 <span>${(cartTotal - discount).toFixed(2)}</span>
              </div>

              {/* Shipping Info Inputs */}
              <div className='mb-6 space-y-3 pt-4 border-t dark:border-gray-700'>
                <h4 className='text-sm font-bold text-gray-700 dark:text-gray-200'>Shipping Details</h4>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>Shipping Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter shipping address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!recipientName.trim() || !address.trim() || !phone.trim()}
                className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition duration-300 disabled:cursor-not-allowed'
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default Cart
