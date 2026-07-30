import { useState, useContext } from 'react'
import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import { FaHeart, FaLeaf, FaSearch, FaCheckCircle, FaClock } from 'react-icons/fa'
import MenuItem from './MenuItem'
import BecomeSellerModal from '../../../Modal/BecomeSellerModal'
import useRole from '../../../../hooks/useRole'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import { SidebarContext } from '../Sidebar'

const CustomerMenu = () => {
  const [role] = useRole()
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [isOpen, setIsOpen] = useState(false)
  const { isCollapsed } = useContext(SidebarContext)

  const userEmail = user?.email || user?.providerData?.[0]?.email

  // Fetch dbUser to check if status is Requested
  const { data: dbUser = {} } = useQuery({
    queryKey: ['dbUser-menu', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/users/${userEmail}`)
      return data
    }
  })

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <MenuItem icon={BsFingerprint} label='My Orders' address='my-orders' />
      <MenuItem icon={FaSearch} label='Track Order' address='track-order' />
      <MenuItem icon={FaHeart} label='My Wishlist' address='wishlist' />
      <MenuItem icon={FaLeaf} label='Plant Care' address='plant-care' />

      {role === 'customer' && (
        dbUser?.status === 'Requested' ? (
          <div
            title={isCollapsed ? 'Seller Application Pending (Paid $29)' : ''}
            className={`flex items-center my-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 ${
              isCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'
            }`}
          >
            <FaClock className='w-4 h-4 flex-shrink-0 text-amber-500 animate-pulse' />
            {!isCollapsed && (
              <div className='mx-3 overflow-hidden text-ellipsis'>
                <span className='font-bold text-xs block whitespace-nowrap'>
                  Seller Application Pending
                </span>
                <span className='text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block'>
                  Paid $29 USD (Txn Verified)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => setIsOpen(true)}
            title={isCollapsed ? 'Become A Seller' : ''}
            className={`flex items-center my-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isCollapsed ? 'justify-center p-3' : 'px-4 py-2.5'
            } text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white`}
          >
            <GrUserAdmin className='w-5 h-5 flex-shrink-0' />
            {!isCollapsed && (
              <span className='mx-3 font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                Become A Seller
              </span>
            )}
          </div>
        )
      )}

      <BecomeSellerModal closeModal={closeModal} isOpen={isOpen} />
    </>
  )
}

export default CustomerMenu
