import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from '../components/Shared/Navbar/Navbar'
import Footer from '../components/Shared/Footer/Footer'
import LoadingSpinner from '../components/Shared/LoadingSpinner'

const MainLayout = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 400) // 400ms premium transition time

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div>
      <Navbar />
      <div className='pt-24 min-h-[calc(100vh-68px)]'>
        {loading ? (
          <div className='min-h-[60vh] flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
