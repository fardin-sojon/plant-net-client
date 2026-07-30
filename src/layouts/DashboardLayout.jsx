import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Sidebar from '../components/Dashboard/Sidebar/Sidebar'
import LoadingSpinner from '../components/Shared/LoadingSpinner'

const DashboardLayout = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 400) // 400ms premium transition time

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className='relative min-h-screen md:flex bg-white dark:bg-gray-900 dark:text-white'>
      {/* Left Side: Sidebar Component */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Right Side: Dashboard Dynamic Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className='p-5'>
          {/* Outlet for dynamic contents */}
          {loading ? (
            <div className='min-h-[60vh] flex items-center justify-center'>
              <LoadingSpinner />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
