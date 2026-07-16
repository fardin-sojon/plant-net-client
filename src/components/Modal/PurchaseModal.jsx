import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PurchaseModal = ({ closeModal, isOpen, plant, buyQuantity = 1 }) => {
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()
  const {_id, name, category, quantity, price, description, image, seller } = plant
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')

  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const email = user?.email || user?.providerData?.[0]?.email

  // Fetch dbUser to get saved address and phone
  const { data: dbUser } = useQuery({
    queryKey: ['dbUser', email],
    enabled: !!email && isOpen,
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
  }, [dbUser, user, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setCouponCode('')
      setDiscount(0)
      setAppliedCoupon('')
    }
  }, [isOpen])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const { data } = await axiosSecure.post('/coupons/apply', {
        code: couponCode.trim(),
        cartTotal: price * buyQuantity
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

  const navigate = useNavigate()
  const handlePayment = async()=>{
    if (!user) {
      toast.error('Please log in first!')
      navigate('/login')
      return
    }

    if (quantity <= 0) {
      toast.error('This plant is out of stock!')
      return
    }



    if (!address.trim() || !phone.trim()) {
      toast.error('Please fill in both address and phone number!')
      return
    }

    if (!recipientName.trim() || !address.trim() || !phone.trim()) {
      toast.error('Please fill in name, address and phone number!')
      return
    }

    const loadingToast = toast.loading('Initializing payment checkout...')
    try {
      // Format data to match backend API structure
      const paymentData = {
        items: [{
          _id: _id,
          plantId: _id,
          name, 
          category, 
          price, 
          description,
          quantity: buyQuantity,
          image,
          seller
        }],
        couponCode: appliedCoupon || null,
        customer: {
          name: user?.displayName,
          email: user?.email || user?.providerData?.[0]?.email,
          image: user?.photoURL,
          recipientName: recipientName.trim(),
          address: address.trim(),
          phone: phone.trim()
        }
      }
      
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`, paymentData)
      toast.dismiss(loadingToast)
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Payment error:', error)
      toast.error('Payment failed: ' + (error.response?.data?.message || error.message || 'Unknown error'))
    }
  }

  const handleCOD = async () => {
    if (!user) {
      toast.error('Please log in first!')
      navigate('/login')
      return
    }

    if (quantity <= 0) {
      toast.error('This plant is out of stock!')
      return
    }

    if (!recipientName.trim() || !address.trim() || !phone.trim()) {
      toast.error('Please fill in name, address and phone number!')
      return
    }

    const loadingToast = toast.loading('Placing Cash on Delivery order...')
    try {
      const paymentData = {
        items: [{
          _id: _id,
          plantId: _id,
          name, 
          category, 
          price, 
          description,
          quantity: buyQuantity,
          image,
          seller
        }],
        couponCode: appliedCoupon || null,
        customer: {
          name: user?.displayName,
          email: user?.email || user?.providerData?.[0]?.email,
          image: user?.photoURL,
          recipientName: recipientName.trim(),
          address: address.trim(),
          phone: phone.trim()
        }
      }

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/create-cod-order`, paymentData)
      toast.dismiss(loadingToast)
      if (data.success) {
        toast.success('Order placed successfully (Cash on Delivery)!')
        closeModal()
        navigate('/dashboard/my-orders')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('COD error:', error)
      toast.error('Order failed: ' + (error.response?.data?.message || error.message || 'Unknown error'))
    }
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md bg-white dark:bg-gray-800 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl"
          >
            <DialogTitle
              as="h3"
              className="text-lg font-medium text-center leading-6 text-gray-900 dark:text-white"
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Plant: {name}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Category: {category}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Customer: {user?.displayName}</p>
            </div>

            <div className="mt-2 flex justify-between items-center text-sm font-semibold">
              <p className="text-gray-500 dark:text-gray-300">Quantity: {buyQuantity}</p>
            </div>
            <div className="mt-2 flex justify-between items-center text-sm font-semibold">
              <p className="text-gray-500 dark:text-gray-300">Price: ${price} x {buyQuantity} = ${price * buyQuantity}</p>
              {discount > 0 && (
                <p className="text-lime-600 dark:text-lime-400">Discount: -${discount.toFixed(2)}</p>
              )}
            </div>
            <div className="mt-2 text-right text-sm font-bold text-gray-800 dark:text-white border-t border-dashed dark:border-gray-700 pt-2">
              Total Price: ${(price * buyQuantity - discount).toFixed(2)}
            </div>

            {/* Coupon Code Section */}
            <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  className="w-full text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase disabled:opacity-50"
                />
                {appliedCoupon ? (
                  <button
                    onClick={() => {
                      setAppliedCoupon('')
                      setCouponCode('')
                      setDiscount(0)
                    }}
                    type="button"
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition cursor-pointer"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    type="button"
                    className="px-3 py-1.5 bg-lime-500 text-white text-xs font-bold rounded-md hover:bg-lime-600 transition cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-xs text-lime-600 dark:text-lime-400 font-bold mt-1">
                  ✓ Code "{appliedCoupon}" applied
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="mt-4 border-t border-gray-150 dark:border-gray-700 pt-4">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="radio radio-primary radio-xs"
                  />
                  <span>Online Payment (Stripe)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="radio radio-primary radio-xs"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
            
            {/* Address & Phone Inputs */}
            <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Recipient Name
                </label>
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
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Shipping Address
                </label>
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
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Phone Number
                </label>
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

            <div className="flex mt-6 justify-around">
              <button
                onClick={paymentMethod === 'stripe' ? handlePayment : handleCOD}
                disabled={!recipientName.trim() || !address.trim() || !phone.trim()}
                type="button"
                className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-green-100 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {paymentMethod === 'stripe' ? 'Pay Online' : 'Place COD Order'}
              </button>
              <button
                type="button"
                className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
