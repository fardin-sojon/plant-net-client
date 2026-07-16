import { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import useRole from '../../../hooks/useRole'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { FaUserCog, FaShieldAlt, FaPalette, FaBell, FaInfoCircle, FaMoon, FaSun } from 'react-icons/fa'
import UpdateProfileModal from '../../../components/Modal/UpdateProfileModal'
import ChangePasswordModal from '../../../components/Modal/ChangePasswordModal'

const Settings = () => {
  const { user } = useAuth()
  const [role] = useRole()
  const axiosSecure = useAxiosSecure()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  const email = user?.email || user?.providerData?.[0]?.email

  // Fetch dbUser
  const { data: dbUser = {}, isLoading, refetch } = useQuery({
    queryKey: ['dbUser-settings', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/users/${email}`)
      return res.data
    }
  })

  // Theme settings (Read from document html class or localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Notification Preferences State (Loaded from localStorage)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(`notifications_pref_${email}`)
    return saved ? JSON.parse(saved) : {
      orders: true,
      promotions: false,
      reminders: true,
    }
  })

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    localStorage.setItem(`notifications_pref_${email}`, JSON.stringify(updated))
    toast.success('Notification preferences updated!')
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Account Settings</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          Manage your account preferences, themes, security, and notification options
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Left Settings Sidebar Navigation */}
        <div className='bg-white dark:bg-gray-800 p-4 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm h-fit flex flex-col gap-1'>
          <a href='#profile' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-lime-50/50 dark:hover:bg-lime-950/20 text-gray-700 dark:text-gray-300 font-bold text-sm transition-colors duration-200'>
            <FaUserCog className='text-lime-500' />
            <span>Profile settings</span>
          </a>
          <a href='#appearance' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-lime-50/50 dark:hover:bg-lime-950/20 text-gray-700 dark:text-gray-300 font-bold text-sm transition-colors duration-200'>
            <FaPalette className='text-lime-500' />
            <span>Appearance & Theme</span>
          </a>
          <a href='#notifications' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-lime-50/50 dark:hover:bg-lime-950/20 text-gray-700 dark:text-gray-300 font-bold text-sm transition-colors duration-200'>
            <FaBell className='text-lime-500' />
            <span>Notifications</span>
          </a>
          <a href='#security' className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-lime-50/50 dark:hover:bg-lime-950/20 text-gray-700 dark:text-gray-300 font-bold text-sm transition-colors duration-200'>
            <FaShieldAlt className='text-lime-500' />
            <span>Security & Privacy</span>
          </a>
        </div>

        {/* Right Settings Details Sections */}
        <div className='md:col-span-2 flex flex-col gap-8'>
          
          {/* Profile settings Panel */}
          <div id='profile' className='bg-white dark:bg-gray-800 p-6 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm scroll-mt-6'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-base-100 dark:border-gray-700 mb-6 flex items-center gap-2'>
              <FaUserCog className='text-lime-500' /> Profile Information
            </h2>
            <div className='flex items-center gap-4 mb-6 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700'>
              <img
                src={user?.photoURL}
                alt='avatar'
                className='w-16 h-16 rounded-full object-cover border border-gray-250'
              />
              <div>
                <h4 className='font-bold text-gray-800 dark:text-white text-base'>{dbUser?.name || user?.displayName}</h4>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{email} ({role})</p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 mt-4'>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition shadow-xs text-sm cursor-pointer"
              >
                Update Profile Info
              </button>
            </div>
          </div>

          {/* Appearance & Theme Panel */}
          <div id='appearance' className='bg-white dark:bg-gray-800 p-6 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm scroll-mt-6'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-base-100 dark:border-gray-700 mb-6 flex items-center gap-2'>
              <FaPalette className='text-lime-500' /> Appearance
            </h2>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
              Customize how PlantNet looks on your device. Choose between light and dark themes.
            </p>

            <div className='flex gap-4'>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-4 border-2 rounded-2xl flex flex-col items-center gap-2 font-bold text-sm cursor-pointer transition ${
                  theme === 'light'
                    ? 'border-lime-500 bg-lime-50/20 dark:bg-lime-950/10 text-lime-600 dark:text-lime-400'
                    : 'border-base-200 dark:border-gray-700 hover:border-lime-500 dark:text-white'
                }`}
              >
                <FaSun className='text-xl' />
                <span>Light Theme</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-4 border-2 rounded-2xl flex flex-col items-center gap-2 font-bold text-sm cursor-pointer transition ${
                  theme === 'dark'
                    ? 'border-lime-500 bg-lime-50/20 dark:bg-lime-950/10 text-lime-600 dark:text-lime-400'
                    : 'border-base-200 dark:border-gray-700 hover:border-lime-500 dark:text-white'
                }`}
              >
                <FaMoon className='text-xl' />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          {/* Notifications Panel */}
          <div id='notifications' className='bg-white dark:bg-gray-800 p-6 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm scroll-mt-6'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-base-100 dark:border-gray-700 mb-6 flex items-center gap-2'>
              <FaBell className='text-lime-500' /> Notification Preferences
            </h2>
            
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-750'>
                <div>
                  <h4 className='font-bold text-sm text-gray-800 dark:text-white'>Order Updates</h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Receive notification emails for order confirmations & shipping updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.orders}
                  onChange={() => handleToggleNotification('orders')}
                  className="checkbox checkbox-primary"
                />
              </div>

              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-750'>
                <div>
                  <h4 className='font-bold text-sm text-gray-800 dark:text-white'>Marketing & Coupons</h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Receive notifications for newly active coupons and platform offers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.promotions}
                  onChange={() => handleToggleNotification('promotions')}
                  className="checkbox checkbox-primary"
                />
              </div>

              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-750'>
                <div>
                  <h4 className='font-bold text-sm text-gray-800 dark:text-white'>Weekly Care Reminders</h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Get reminders to water or fertilize your plants according to your Care Planner.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={() => handleToggleNotification('reminders')}
                  className="checkbox checkbox-primary"
                />
              </div>
            </div>
          </div>

          {/* Security Panel */}
          <div id='security' className='bg-white dark:bg-gray-800 p-6 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm scroll-mt-6'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-base-100 dark:border-gray-700 mb-6 flex items-center gap-2'>
              <FaShieldAlt className='text-lime-500' /> Security
            </h2>
            
            <div className='flex flex-col gap-4'>
              {user?.providerData?.some(p => p.providerId === 'password') ? (
                <div className='flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <h4 className='font-bold text-sm text-gray-800 dark:text-white'>Password Manager</h4>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Update your account password regularly to keep your credentials secure.</p>
                  </div>
                  <button
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-250 dark:bg-gray-700 dark:hover:bg-gray-600 border border-base-300 dark:border-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition shadow-xs text-sm cursor-pointer shrink-0"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/60'>
                  <FaInfoCircle className='text-lime-500 shrink-0' />
                  <p className='text-xs text-gray-500 dark:text-gray-400 italic'>
                    Your account is registered using Google OAuth. Password manager options are managed externally.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <UpdateProfileModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        dbUser={dbUser}
        refetch={refetch}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        setIsOpen={setIsChangePasswordModalOpen}
      />
    </div>
  )
}

export default Settings
