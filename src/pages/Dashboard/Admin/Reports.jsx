import { useState } from 'react'
import { FaFileAlt, FaDownload, FaChartLine, FaShoppingBag, FaUsers, FaArrowUp } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Reports = () => {
  const [dateRange, setDateRange] = useState('This Month')

  const reportsList = [
    { id: 1, title: 'Monthly Sales & Revenue Report', type: 'Financial', size: '2.4 MB', date: 'Jul 2026', icon: FaChartLine },
    { id: 2, title: 'Inventory Stock & Reorder Analysis', type: 'Inventory', size: '1.8 MB', date: 'Jul 2026', icon: FaShoppingBag },
    { id: 3, title: 'Customer Acquisition & Growth', type: 'Analytics', size: '3.1 MB', date: 'Jul 2026', icon: FaUsers },
    { id: 4, title: 'Seller Performance Summary', type: 'Performance', size: '1.2 MB', date: 'Jun 2026', icon: FaFileAlt },
    { id: 5, title: 'Tax & Invoice Audit Export', type: 'Compliance', size: '4.5 MB', date: 'Q2 2026', icon: FaFileAlt },
  ]

  const handleDownload = (title) => {
    toast.success(`Downloading ${title}...`)
  }

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
            <FaFileAlt className='text-lime-500' /> Reports & Statements
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Generate, view, and export comprehensive store performance reports
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className='px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:outline-none'
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button
            onClick={() => toast.success('Generating custom PDF report...')}
            className='px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl shadow transition flex items-center gap-2 cursor-pointer'
          >
            <FaDownload /> Export All
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Total Sales Revenue</p>
          <h3 className='text-2xl font-bold text-gray-800 dark:text-white mt-1'>$48,920.00</h3>
          <p className='text-xs text-lime-500 font-semibold flex items-center gap-1 mt-2'>
            <FaArrowUp /> +14.2% from last month
          </p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Orders Processed</p>
          <h3 className='text-2xl font-bold text-gray-800 dark:text-white mt-1'>1,248</h3>
          <p className='text-xs text-lime-500 font-semibold flex items-center gap-1 mt-2'>
            <FaArrowUp /> +8.5% completion rate
          </p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Average Order Value</p>
          <h3 className='text-2xl font-bold text-gray-800 dark:text-white mt-1'>$39.20</h3>
          <p className='text-xs text-lime-500 font-semibold flex items-center gap-1 mt-2'>
            <FaArrowUp /> +3.1% basket size
          </p>
        </div>
      </div>

      {/* Downloadable Reports Table */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-white'>Available Downloads</h2>
        </div>
        <div className='divide-y divide-gray-100 dark:divide-gray-700'>
          {reportsList.map((rep) => {
            const Icon = rep.icon
            return (
              <div
                key={rep.id}
                className='p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'
              >
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-lime-50 dark:bg-lime-950/40 rounded-xl text-lime-600 dark:text-lime-400 text-lg'>
                    <Icon />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 dark:text-white text-sm sm:text-base'>
                      {rep.title}
                    </h3>
                    <div className='flex items-center gap-3 text-xs text-gray-400 mt-0.5'>
                      <span>{rep.type}</span>
                      <span>•</span>
                      <span>{rep.date}</span>
                      <span>•</span>
                      <span>{rep.size}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(rep.title)}
                  className='p-2.5 bg-gray-100 hover:bg-lime-500 hover:text-white dark:bg-gray-700 dark:hover:bg-lime-500 text-gray-700 dark:text-gray-200 rounded-xl transition cursor-pointer'
                  title='Download PDF'
                >
                  <FaDownload className='text-sm' />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Reports
