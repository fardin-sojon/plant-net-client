import { FaDollarSign } from 'react-icons/fa'
import { BsFillCartPlusFill, BsFillHouseDoorFill, BsBarChart } from 'react-icons/bs'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../Shared/LoadingSpinner'

const SellerStatistics = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()
  const userEmail = user?.email || user?.providerData?.[0]?.email

  // Fetch Seller Plants (Inventory)
  const { data: plants = [], isLoading: isPlantsLoading } = useQuery({
    queryKey: ['seller-plants', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/my-inventory/${userEmail}`)
      return data
    },
  })

  // Fetch Seller Orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['seller-orders', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/manage-orders/${userEmail}`)
      return data
    },
  })

  if (isPlantsLoading || isOrdersLoading) return <LoadingSpinner />

  // Calculations
  const deliveredOrders = orders.filter(order => order.status === 'Delivered')
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
  const totalStock = plants.reduce((sum, plant) => sum + parseInt(plant.quantity || 0), 0)

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
        Welcome to Seller Dashboard, {user?.displayName || 'Seller'}!
      </h1>

      <div className='mt-12'>
        {/* small cards */}
        <div className='mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grow'>
          {/* Earnings Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-orange-600 to-orange-400 text-white shadow-orange-500/40`}
            >
              <FaDollarSign className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                My Earnings
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                ${totalRevenue.toFixed(2)}
              </h4>
            </div>
          </div>

          {/* Orders Received */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-blue-600 to-blue-400 text-white shadow-blue-500/40`}
            >
              <BsFillCartPlusFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Orders Received
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {orders.length}
              </h4>
            </div>
          </div>

          {/* Unique Plant Listings */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-pink-600 to-pink-400 text-white shadow-pink-500/40`}
            >
              <BsFillHouseDoorFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Unique Plants
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {plants.length}
              </h4>
            </div>
          </div>

          {/* Total Stock */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-green-600 to-green-400 text-white shadow-green-500/40`}
            >
              <BsBarChart className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Total Stock
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {totalStock}
              </h4>
            </div>
          </div>
        </div>

        {/* Calendar and Info section */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Welcome Info Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md p-6 lg:col-span-2 justify-center'>
            <h2 className='text-2xl font-bold text-lime-600 dark:text-lime-400 mb-3'>Nursery Operations</h2>
            <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
              As a seller, you have control over your nursery stock and customer delivery requests. 
              Keep your plant listings updated with high-quality descriptions and images to boost sales. 
              Ensure prompt shipping and transition order status quickly from <em>Pending</em> to <em>In Progress</em>, and finally <em>Delivered</em> to reflect earnings in your dashboard!
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

        {/* Recent Orders and Stock Alerts Grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8'>
          {/* Recent Orders Table (2/3 width) */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 lg:col-span-2'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-bold text-gray-800 dark:text-white'>Recent Orders Received</h3>
              <span className='text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-full'>
                Latest {orders.slice(0, 5).length}
              </span>
            </div>

            <div className='overflow-x-auto rounded-xl'>
              <table className='table w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-750 text-gray-600 dark:text-gray-400 text-xs font-bold uppercase'>
                    <th className='py-3 px-4'>Plant</th>
                    <th className='py-3 px-4'>Qty</th>
                    <th className='py-3 px-4'>Total</th>
                    <th className='py-3 px-4'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                  {orders.slice(0, 5).length === 0 ? (
                    <tr>
                      <td colSpan='4' className='py-8 text-center text-gray-500 dark:text-gray-400 italic'>
                        No orders received yet.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className='hover:bg-gray-50/50 dark:hover:bg-gray-900/30 text-gray-750 dark:text-gray-300'>
                        <td className='py-3 px-4 font-semibold flex items-center gap-2'>
                          <img
                            src={order.image}
                            alt={order.name}
                            className='w-7 h-7 rounded object-cover'
                          />
                          <span>{order.name}</span>
                        </td>
                        <td className='py-3 px-4'>{order.quantity}</td>
                        <td className='py-3 px-4 font-bold text-lime-600 dark:text-lime-400'>
                          ${(order.price * order.quantity).toFixed(2)}
                        </td>
                        <td className='py-3 px-4'>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-lime-100 text-lime-700'
                              : order.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
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

          {/* Low Stock Alerts (1/3 width) */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between'>
            <div>
              <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
                ⚠️ Low Stock Alert
              </h3>
              <div className='flex flex-col gap-3 overflow-y-auto max-h-60'>
                {plants.filter(plant => parseInt(plant.quantity || 0) < 5).length === 0 ? (
                  <p className='text-sm text-gray-400 italic'>All plants have healthy stock levels!</p>
                ) : (
                  plants.filter(plant => parseInt(plant.quantity || 0) < 5).map((plant) => (
                    <div key={plant._id} className='flex items-center justify-between p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/50'>
                      <div className='flex items-center gap-2'>
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className='w-8 h-8 rounded object-cover border border-rose-200'
                        />
                        <span className='font-semibold text-sm text-gray-800 dark:text-gray-200'>
                          {plant.name?.substring(0, 15)}
                        </span>
                      </div>
                      <span className='text-xs font-bold bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-2 py-1 rounded-full'>
                        {plant.quantity} Left
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className='text-xs text-gray-400 mt-4 border-t border-gray-100 dark:border-gray-700 pt-3'>
              Update stock quantity in the "My Inventory" section to resolve alerts.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerStatistics
