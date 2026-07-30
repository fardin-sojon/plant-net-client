import { useState, createContext } from 'react'
import { Link } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import logo from '../../../assets/images/logo-flat.png'
// Icons
import { GrLogout } from 'react-icons/gr'
import { AiOutlineBars, AiOutlineGlobal } from 'react-icons/ai'
import { BsGraphUp, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { FaUserCircle, FaCog } from 'react-icons/fa'

// User Menu
import MenuItem from './Menu/MenuItem'
import AdminMenu from './Menu/AdminMenu'
import SellerMenu from './Menu/SellerMenu'
import CustomerMenu from './Menu/CustomerMenu'

import useRole from '../../../hooks/useRole'

export const SidebarContext = createContext({ isCollapsed: false })

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logOut } = useAuth()
  const [isActive, setActive] = useState(false)
  const [role] = useRole()

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      {/* Small Screen Navbar */}
      <div className='bg-gray-100 text-gray-800 flex justify-between md:hidden dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700'>
        <div>
          <div className='block cursor-pointer p-4 font-bold'>
            <Link to='/'>
              <img
                src={logo}
                alt='logo'
                width='100'
                height='100'
              />
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className='mobile-menu-button p-4 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700'
        >
          <AiOutlineBars className='h-5 w-5' />
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`z-40 md:fixed flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 ${
          isCollapsed ? 'w-20 px-2' : 'w-64 px-3'
        } space-y-4 py-4 absolute inset-y-0 left-0 transform ${
          isActive ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-all duration-300 ease-in-out dark:text-white shadow-sm`}
      >
        <div className='flex flex-col h-full justify-between'>
          <div>
            {/* Top Logo & Store Button */}
            <div className='space-y-3 mb-6'>
              <div className='flex items-center justify-center px-1'>
                <Link to='/' className='flex items-center gap-2 overflow-hidden'>
                  <img src={logo} alt='logo' className={`${isCollapsed ? 'h-8 w-8 object-contain' : 'h-8 w-auto'} transition-all`} />
                </Link>
              </div>

              {/* Visit Store Badge Link */}
              <Link
                to='/'
                title={isCollapsed ? 'Visit Store' : ''}
                className={`flex items-center justify-center ${
                  isCollapsed ? 'p-2.5' : 'gap-2 px-3 py-2.5'
                } rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-sm transition border border-blue-100 dark:border-blue-800/40 shadow-xs`}
              >
                <AiOutlineGlobal className='text-lg flex-shrink-0' />
                {!isCollapsed && <span className='whitespace-nowrap'>Visit Store</span>}
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className='space-y-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-260px)] custom-scrollbar'>
              {/* Dashboard Main / Statistics */}
              <MenuItem
                icon={BsGraphUp}
                label='Dashboard'
                address='/dashboard'
              />

              {/* Role-Based Menu */}
              {role === 'customer' && <CustomerMenu />}
              {role === 'seller' && <SellerMenu />}
              {role === 'admin' && (
                <>
                  <AdminMenu />
                  <SellerMenu />
                </>
              )}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className='pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1'>
            <MenuItem
              icon={FaUserCircle}
              label='Profile'
              address='/dashboard/profile'
            />
            <MenuItem
              icon={FaCog}
              label='Settings'
              address='/dashboard/settings'
            />

            <button
              onClick={logOut}
              title={isCollapsed ? 'Logout' : ''}
              className={`flex cursor-pointer w-full items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5'
              } text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors duration-200 text-sm font-medium`}
            >
              <GrLogout className='w-4 h-4 flex-shrink-0' />
              {!isCollapsed && <span className='mx-3 font-semibold whitespace-nowrap'>Logout</span>}
            </button>

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className={`hidden md:flex items-center w-full ${
                isCollapsed ? 'justify-center p-2.5' : 'px-4 py-2'
              } text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition mt-2 cursor-pointer`}
            >
              {isCollapsed ? (
                <BsChevronRight className='w-4 h-4' />
              ) : (
                <div className='flex items-center gap-2'>
                  <BsChevronLeft className='w-4 h-4' />
                  <span className='whitespace-nowrap'>Collapse</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export default Sidebar
