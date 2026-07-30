/* eslint-disable no-unused-vars */
import { useContext } from 'react'
import { NavLink } from 'react-router'
import { SidebarContext } from '../Sidebar'

const MenuItem = ({ label, address, icon: Icon }) => {
  const { isCollapsed } = useContext(SidebarContext)

  return (
    <NavLink
      to={address}
      end
      title={isCollapsed ? label : ''}
      className={({ isActive }) =>
        `flex items-center my-1 rounded-xl transition-all duration-200 ${
          isCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'
        } ${
          isActive
            ? 'bg-lime-500 text-white font-semibold shadow-md shadow-lime-500/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        }`
      }
    >
      <Icon className='w-5 h-5 flex-shrink-0' />

      {!isCollapsed && (
        <span className='mx-3 font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
          {label}
        </span>
      )}
    </NavLink>
  )
}

export default MenuItem
