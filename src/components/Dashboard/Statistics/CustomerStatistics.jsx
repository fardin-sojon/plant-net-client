import { FaDollarSign, FaHeart } from 'react-icons/fa'
import { BsFillCartPlusFill } from 'react-icons/bs'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../Shared/LoadingSpinner'

const CustomerStatistics = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()
  const userEmail = user?.email || user?.providerData?.[0]?.email

  // Fetch Customer Orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['customer-orders', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/my-orders/${userEmail}`)
      return data
    },
  })

  // Fetch Wishlist Items
  const { data: wishlist = [], isLoading: isWishlistLoading } = useQuery({
    queryKey: ['customer-wishlist', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/wishlist/${userEmail}`)
      return data
    },
  })

  if (isOrdersLoading || isWishlistLoading) return <LoadingSpinner />

  // Calculations
  const totalSpend = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0)

  // Calendar dates generation
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>
        Welcome to Customer Dashboard, {user?.displayName || 'Customer'}!
      </h1>

      <div className='mt-12'>
        {/* small cards */}
        <div className='mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 grow'>
          {/* Total Spend */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-orange-600 to-orange-400 text-white shadow-orange-500/40`}
            >
              <FaDollarSign className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Total Spent
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                ${totalSpend.toFixed(2)}
              </h4>
            </div>
          </div>

          {/* Total Orders */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-blue-600 to-blue-400 text-white shadow-blue-500/40`}
            >
              <BsFillCartPlusFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                My Orders
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {orders.length}
              </h4>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-pink-600 to-pink-400 text-white shadow-pink-500/40`}
            >
              <FaHeart className='w-5 h-5 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Wishlist Items
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {wishlist.length}
              </h4>
            </div>
          </div>
        </div>

        {/* Calendar and Info section */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Welcome Info Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md p-6 lg:col-span-2 justify-center'>
            <h2 className='text-2xl font-bold text-lime-600 dark:text-lime-400 mb-3'>Nature Enthusiast Center</h2>
            <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
              Welcome back to your personalized gardening hub! 
              Here you can view your total spending, keep track of your order shipments, and review the products you've received. 
              Don't forget to check out our latest catalog on the shop page, apply your coupons, and add more green friends to your home!
            </p>
          </div>

          {/* Calendar Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md p-6'>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{monthNames[currentMonth]} {currentYear}</p>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="grid grid-cols-7 gap-y-3 text-center text-sm font-medium">
              {daysArray.map((day, index) => {
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                return (
                  <div key={index} className="flex items-center justify-center h-8">
                    {day ? (
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                        isToday 
                          ? 'bg-lime-500 text-white font-bold shadow-md shadow-lime-500/30' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                      }`}>
                        {day}
                      </span>
                    ) : (
                      <span className="w-8 h-8"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Purchases Tracker */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mt-8 border border-gray-100 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-bold text-gray-800 dark:text-white'>Recent Purchases</h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Track status and delivery details of your green friends</p>
            </div>
            <span className='text-xs bg-lime-100 dark:bg-lime-950/30 text-lime-700 dark:text-lime-400 font-semibold px-3 py-1 rounded-full'>
              Order Status
            </span>
          </div>

          <div className='overflow-x-auto rounded-xl'>
            <table className='table w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-750 text-gray-600 dark:text-gray-400 text-xs font-bold uppercase'>
                  <th className='py-3 px-4'>Plant</th>
                  <th className='py-3 px-4'>Quantity</th>
                  <th className='py-3 px-4'>Price Paid</th>
                  <th className='py-3 px-4'>Shipment Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                {orders.slice(0, 4).length === 0 ? (
                  <tr>
                    <td colSpan='4' className='py-8 text-center text-gray-500 dark:text-gray-400 italic'>
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 4).map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50/50 dark:hover:bg-gray-900/30 text-gray-750 dark:text-gray-300'>
                      <td className='py-3 px-4 flex items-center gap-3 font-semibold'>
                        <img
                          src={order.image || 'https://i.ibb.co.com/CFxm3Oy/placeholder.jpg'}
                          alt={order.name}
                          className='w-8 h-8 rounded-lg object-cover'
                        />
                        <span>{order.name}</span>
                      </td>
                      <td className='py-3 px-4'>{order.quantity}</td>
                      <td className='py-3 px-4 font-bold text-lime-600 dark:text-lime-400'>
                        ${(order.price * order.quantity).toFixed(2)}
                      </td>
                      <td className='py-3 px-4'>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-lime-50 dark:bg-lime-950/20 text-lime-600 dark:text-lime-400'
                            : order.status === 'In Progress'
                            ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                            : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerStatistics
