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
      </div>
    </div>
  )
}

export default SellerStatistics
