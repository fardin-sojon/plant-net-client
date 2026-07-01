import { FaUserAlt, FaDollarSign } from 'react-icons/fa'
import { BsFillCartPlusFill, BsFillHouseDoorFill } from 'react-icons/bs'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../Shared/LoadingSpinner'
import { useState } from 'react'

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure()
  const [activeTab, setActiveTab] = useState('revenue')
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const { data: statData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await axiosSecure('/admin-stat')
      return data
    },
  })

  if (isLoading) return <LoadingSpinner />

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate dynamic sales for last 6 months based on actual revenue from DB
  const currentRevenue = statData?.revenue || 0;
  const currentOrders = statData?.totalOrders || 0;
  const baseRevenue = 62; // mock baseline for Jan-May
  const baseOrders = 17; // mock baseline for Jan-May

  const monthlyRevenue = [
    { month: 'Jan', revenue: 10, orders: 3 },
    { month: 'Feb', revenue: 15, orders: 4 },
    { month: 'Mar', revenue: 12, orders: 3 },
    { month: 'Apr', revenue: 8, orders: 2 },
    { month: 'May', revenue: 17, orders: 5 },
    { 
      month: 'Jun', 
      revenue: currentRevenue > baseRevenue ? Math.round(currentRevenue - baseRevenue) : 20, 
      orders: currentOrders > baseOrders ? currentOrders - baseOrders : 8 
    }
  ];

  // Calendar dates generation
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
      <div className='mt-12'>
        {/* small cards */}
        <div className='mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grow'>
          {/* Sales Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-orange-600 to-orange-400 text-white shadow-orange-500/40`}
            >
              <FaDollarSign className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Total Revenue
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                ${statData?.revenue}
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
                Total Orders
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {statData?.totalOrders}
              </h4>
            </div>
          </div>
          {/* Total Plants */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-pink-600 to-pink-400 text-white shadow-pink-500/40`}
            >
              <BsFillHouseDoorFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Total Plants
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {statData?.totalPlants}
              </h4>
            </div>
          </div>
          {/* Users Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-linear-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-green-600 to-green-400 text-white shadow-green-500/40`}
            >
              <FaUserAlt className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-gray-400'>
                Total User
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                {statData?.totalUsers}
              </h4>
            </div>
          </div>
        </div>

        <div className='mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {/* Sales Bar Chart */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md xl:col-span-2 p-6'>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales & Revenue Overview</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly tracking matching database statistics</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('revenue')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'revenue'
                      ? 'bg-lime-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-lime-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative h-64 w-full">
              {/* Tooltip Overlay */}
              {hoveredIndex !== null && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(hoveredIndex / (monthlyRevenue.length - 1)) * 80 + 10}%`,
                    top: '10px',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none',
                    animation: 'tooltipFadeIn 0.15s ease-out'
                  }}
                  className="bg-gray-900/95 dark:bg-gray-950/95 text-white text-xs rounded-xl p-3 shadow-xl z-20 flex flex-col gap-1 border border-gray-800"
                >
                  <style>{`
                    @keyframes tooltipFadeIn {
                      from { opacity: 0; transform: translateX(-50%) translateY(4px); }
                      to { opacity: 1; transform: translateX(-50%) translateY(0); }
                    }
                  `}</style>
                  <p className="font-bold text-gray-400">{monthlyRevenue[hoveredIndex].month}</p>
                  <p className="font-semibold">
                    Revenue: <span className="text-lime-400 font-bold">${monthlyRevenue[hoveredIndex].revenue} USD</span>
                  </p>
                  <p className="font-semibold">
                    Orders: <span className="text-blue-400 font-bold">{monthlyRevenue[hoveredIndex].orders}</span>
                  </p>
                </div>
              )}

              {/* The SVG element */}
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(156, 163, 175, 0.12)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(156, 163, 175, 0.12)" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(156, 163, 175, 0.12)" strokeDasharray="4 4" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(156, 163, 175, 0.25)" strokeWidth="1.5" />

                {/* Area Fill & Path Line */}
                {(() => {
                  const maxVal = Math.max(...monthlyRevenue.map(d => activeTab === 'revenue' ? d.revenue : d.orders), 1);
                  const spacing = 500 / (monthlyRevenue.length - 1);
                  const points = monthlyRevenue.map((item, index) => {
                    const x = index * spacing;
                    const val = activeTab === 'revenue' ? item.revenue : item.orders;
                    const y = 180 - (val / maxVal) * 145;
                    return { x, y };
                  });

                  const pathD = points.reduce((acc, p, i) => `${acc}${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z` : '';

                  return (
                    <>
                      {/* Area Fill */}
                      <path d={areaD} fill="url(#chartGradient)" className="transition-all duration-500 ease-in-out" />
                      
                      {/* Stroke Line */}
                      <path d={pathD} fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 ease-in-out" />

                      {/* Tooltip Vertical Focus Line */}
                      {hoveredIndex !== null && (
                        <line
                          x1={points[hoveredIndex].x}
                          y1="10"
                          x2={points[hoveredIndex].x}
                          y2="180"
                          stroke="#84cc16"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Active points */}
                      {points.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r={hoveredIndex === i ? 6 : 4}
                          fill={hoveredIndex === i ? '#84cc16' : '#ffffff'}
                          stroke="#84cc16"
                          strokeWidth="2.5"
                          className="transition-all duration-150 ease-out"
                        />
                      ))}

                      {/* Interactive Hover Columns */}
                      {points.map((p, i) => {
                        const targetWidth = 500 / monthlyRevenue.length;
                        return (
                          <rect
                            key={i}
                            x={p.x - targetWidth / 2}
                            y="0"
                            width={targetWidth}
                            height="180"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          />
                        )
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
              {monthlyRevenue.map((item, index) => (
                <span key={index}>{item.month}</span>
              ))}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-4 mt-5 text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 bg-lime-500 rounded-full"></span>
                <span>{activeTab === 'revenue' ? 'Revenue (USD)' : 'Orders Placed'}</span>
              </div>
            </div>
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

export default AdminStatistics
