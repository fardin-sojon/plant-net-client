import { useState } from 'react'
import { FaHistory, FaSearch, FaFilter, FaUserCheck, FaBoxOpen, FaEdit, FaKey } from 'react-icons/fa'

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  const logs = [
    { id: 1, user: 'Admin User', role: 'Admin', action: 'Created new discount coupon (SUMMER20)', category: 'Coupons', time: '10 mins ago', icon: FaEdit, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { id: 2, user: 'Sophia Green', role: 'Seller', action: 'Added new plant product "Variegated Monstera"', category: 'Inventory', time: '42 mins ago', icon: FaBoxOpen, color: 'text-lime-500 bg-lime-50 dark:bg-lime-950/40' },
    { id: 3, user: 'Alex Johnson', role: 'Customer', action: 'Placed order #ORD-9821 for $124.50', category: 'Orders', time: '2 hours ago', icon: FaUserCheck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { id: 4, user: 'Admin User', role: 'Admin', action: 'Updated user role for seller@plantnet.com', category: 'Security', time: '5 hours ago', icon: FaKey, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { id: 5, user: 'Emma Watson', role: 'Customer', action: 'Submitted a review for Fiddle Leaf Fig', category: 'Reviews', time: '1 day ago', icon: FaEdit, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 6, user: 'Michael Brown', role: 'Seller', action: 'Updated stock count for Succulent Mix', category: 'Inventory', time: '2 days ago', icon: FaBoxOpen, color: 'text-lime-500 bg-lime-50 dark:bg-lime-950/40' },
  ]

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'All' || log.category === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
            <FaHistory className='text-lime-500' /> System Activity Logs
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Real-time audit trail of administrative and user actions across the platform
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm'>
        <div className='relative w-full sm:w-80'>
          <FaSearch className='absolute left-3.5 top-3.5 text-gray-400 text-sm' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search logs by user or action...'
            className='w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none'
          />
        </div>

        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <FaFilter className='text-gray-400 text-xs' />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className='px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:outline-none w-full sm:w-auto'
          >
            <option value='All'>All Categories</option>
            <option value='Coupons'>Coupons</option>
            <option value='Inventory'>Inventory</option>
            <option value='Orders'>Orders</option>
            <option value='Security'>Security</option>
            <option value='Reviews'>Reviews</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-6'>
        <div className='space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700'>
          {filteredLogs.map((log) => {
            const Icon = log.icon
            return (
              <div key={log.id} className='relative flex items-start gap-4 z-10'>
                <div className={`p-3 rounded-xl ${log.color} flex-shrink-0 shadow-xs`}>
                  <Icon className='text-base' />
                </div>

                <div className='flex-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-gray-800 dark:text-white text-sm'>
                        {log.user}
                      </span>
                      <span className='text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
                        {log.role}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                      {log.action}
                    </p>
                  </div>

                  <div className='flex sm:flex-col items-center sm:items-end justify-between text-xs text-gray-400 gap-1'>
                    <span className='px-2 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-700 dark:text-lime-300 font-medium'>
                      {log.category}
                    </span>
                    <span>{log.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActivityLogs
