import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { FaDollarSign, FaLeaf, FaShoppingBag, FaClock } from 'react-icons/fa'

const SellerAnalytics = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()
  const userEmail = user?.email || user?.providerData?.[0]?.email

  // Fetch Seller Inventory
  const { data: plants = [], isLoading: isPlantsLoading } = useQuery({
    queryKey: ['seller-plants-analytics', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/my-inventory/${userEmail}`)
      return data
    },
  })

  // Fetch Seller Orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['seller-orders-analytics', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/manage-orders/${userEmail}`)
      return data
    },
  })

  if (isPlantsLoading || isOrdersLoading) return <LoadingSpinner />

  // Calculations
  const deliveredOrders = orders.filter(o => o.status === 'Delivered')
  const pendingOrders = orders.filter(o => o.status === 'Pending')
  const inProgressOrders = orders.filter(o => o.status === 'In Progress')

  const totalEarnings = deliveredOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0)
  const pendingEarnings = [...pendingOrders, ...inProgressOrders].reduce((sum, o) => sum + (o.price * o.quantity), 0)
  const totalItemsSold = deliveredOrders.reduce((sum, o) => sum + o.quantity, 0)
  const totalStock = plants.reduce((sum, p) => sum + parseInt(p.quantity || 0), 0)

  // Chart Data: Status breakdown for Pie Chart
  const statusData = [
    { name: 'Delivered', value: deliveredOrders.length, color: '#84cc16' },
    { name: 'In Progress', value: inProgressOrders.length, color: '#3b82f6' },
    { name: 'Pending', value: pendingOrders.length, color: '#eab308' },
  ].filter(d => d.value > 0)

  // Chart Data: Top 5 plants by earnings / stock
  const topPlantsData = plants
    .map(p => ({
      name: p.name?.substring(0, 12) + (p.name?.length > 12 ? '..' : ''),
      Stock: p.quantity,
      Price: p.price,
    }))
    .slice(0, 5)

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Seller Analytics</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          Track earnings, order statuses, and inventory performance of your nursery
        </p>
      </div>

      {/* Metric Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10'>
        {/* Total Earnings */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
          <div className='p-4 rounded-xl bg-lime-100 dark:bg-lime-950/30 text-lime-600 dark:text-lime-400'>
            <FaDollarSign className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 font-semibold'>Total Earnings</p>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white mt-1'>
              ${totalEarnings.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Pending Revenue */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
          <div className='p-4 rounded-xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'>
            <FaClock className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 font-semibold'>Pending Revenue</p>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white mt-1'>
              ${pendingEarnings.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Items Sold */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
          <div className='p-4 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'>
            <FaShoppingBag className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 font-semibold'>Items Sold</p>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white mt-1'>
              {totalItemsSold} Units
            </h3>
          </div>
        </div>

        {/* Total Stock */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
          <div className='p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'>
            <FaLeaf className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 font-semibold'>Plants In Stock</p>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white mt-1'>
              {totalStock} Items
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Plant Inventory Stock & Price Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 lg:col-span-2 text-xs'>
          <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-6'>Plant Listings Overview (Top 5)</h3>
          <div className='h-80 w-full'>
            {topPlantsData.length === 0 ? (
              <div className='h-full flex items-center justify-center text-gray-400'>
                No plants listed yet.
              </div>
            ) : (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={topPlantsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='rgba(156, 163, 175, 0.1)' />
                  <XAxis dataKey='name' tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='Stock' fill='#84cc16' radius={[4, 4, 0, 0]} />
                  <Bar dataKey='Price' fill='#3b82f6' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 text-xs flex flex-col justify-between'>
          <div>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-6'>Orders Status Breakdown</h3>
            <div className='h-60 w-full relative flex items-center justify-center'>
              {statusData.length === 0 ? (
                <div className='text-gray-400'>No orders received yet.</div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey='value'
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          {/* Status Legends */}
          <div className='flex justify-around border-t border-gray-100 dark:border-gray-700 pt-4 mt-4 font-semibold'>
            {statusData.map((d, i) => (
              <div key={i} className='flex items-center gap-1.5'>
                <span className='w-3.5 h-1.5 rounded-full' style={{ backgroundColor: d.color }}></span>
                <span className='text-gray-500 dark:text-gray-400'>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerAnalytics
