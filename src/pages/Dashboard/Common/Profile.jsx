import useAuth from '../../../hooks/useAuth'
import coverImg from '../../../assets/images/cover.jpg'
import useRole from '../../../hooks/useRole'
import { useState } from 'react'
import UpdateProfileModal from '../../../components/Modal/UpdateProfileModal'
import ChangePasswordModal from '../../../components/Modal/ChangePasswordModal'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaUserCircle, FaShoppingBag, FaHeart, FaWarehouse, FaTicketAlt, FaUsers } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

const Profile = () => {
  const { user } = useAuth()
  const [role] = useRole()
  const axiosSecure = useAxiosSecure()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  const email = user?.email || user?.providerData?.[0]?.email

  // Fetch full user details from DB
  const { data: dbUser = {}, isLoading: isUserLoading, refetch } = useQuery({
    queryKey: ['dbUser', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/users/${email}`)
      return res.data
    }
  })

  // Fetch stats based on user role
  const { data: customerWishlist = [] } = useQuery({
    queryKey: ['customerWishlist', email],
    enabled: role === 'customer' && !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/wishlist/${email}`)
      return res.data
    }
  })

  const { data: customerOrders = [] } = useQuery({
    queryKey: ['customerOrders', email],
    enabled: role === 'customer' && !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/my-orders/${email}`)
      return res.data
    }
  })

  const { data: sellerInventory = [] } = useQuery({
    queryKey: ['sellerInventory', email],
    enabled: role === 'seller' && !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/my-inventory/${email}`)
      return res.data
    }
  })

  const { data: sellerOrders = [] } = useQuery({
    queryKey: ['sellerOrders', email],
    enabled: role === 'seller' && !!email,
    queryFn: async () => {
      const res = await axiosSecure(`/manage-orders/${email}`)
      return res.data
    }
  })

  const { data: adminUsers = [] } = useQuery({
    queryKey: ['adminUsers'],
    enabled: role === 'admin',
    queryFn: async () => {
      const res = await axiosSecure('/users')
      return res.data
    }
  })

  const { data: adminCoupons = [] } = useQuery({
    queryKey: ['adminCoupons'],
    enabled: role === 'admin',
    queryFn: async () => {
      const res = await axiosSecure('/coupons')
      return res.data
    }
  })

  if (isUserLoading) return <LoadingSpinner />

  // Formatted date joined
  const joinedDate = dbUser?.timestamp 
    ? new Date(dbUser.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently Joined'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cover and Profile Picture */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-base-200 dark:border-gray-700 shadow-md overflow-hidden relative mb-8">
        <div className="h-48 md:h-64 overflow-hidden relative">
          <img
            alt='cover photo'
            src={dbUser?.cover || coverImg}
            style={{ objectPosition: `center ${dbUser?.coverPosition || '50%'}` }}
            className='w-full h-full object-cover brightness-90'
          />
        </div>
        <div className="px-6 pb-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative z-10 flex-wrap lg:flex-nowrap">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg shrink-0 -mt-16 md:-mt-20 relative z-20">
              <img
                alt='profile'
                src={user?.photoURL}
                className='w-full h-full object-cover'
              />
            </div>
            <div className="text-center md:text-left space-y-1.5">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white leading-tight">
                {user?.displayName}
              </h1>
              <div className="flex justify-center md:justify-start">
                <span className="inline-block px-3 py-0.5 bg-lime-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {role}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 pt-0.5">
                <FaCalendarAlt className="text-[10px]" />
                <span>Member Since: {joinedDate}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-center md:justify-end">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition shadow-xs text-sm cursor-pointer text-center whitespace-nowrap"
            >
              Update Profile
            </button>
            {user?.providerData?.some(p => p.providerId === 'password') ? (
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="px-5 py-2.5 bg-base-100 hover:bg-base-200 border border-base-300 dark:border-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition shadow-xs text-sm cursor-pointer text-center whitespace-nowrap"
              >
                Change Password
              </button>
            ) : (
              <span className="px-5 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-150 dark:border-gray-700/60 select-none">
                <FcGoogle className="text-base" />
                <span>Logged in via Google</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info Details card */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-base-100 dark:border-gray-700">
            Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="p-3 bg-base-50 dark:bg-gray-900 border border-base-100 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                <FaUserCircle className="text-lg" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Full Name</p>
                <p className="font-bold text-gray-800 dark:text-white mt-0.5">{dbUser?.name || user?.displayName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="p-3 bg-base-50 dark:bg-gray-900 border border-base-100 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                <FaEnvelope className="text-lg" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</p>
                <p className="font-bold text-gray-800 dark:text-white mt-0.5 break-all">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="p-3 bg-base-50 dark:bg-gray-900 border border-base-100 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                <FaPhone className="text-lg" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone Number</p>
                <p className="font-bold text-gray-800 dark:text-white mt-0.5">
                  {dbUser?.phone || <span className="text-gray-400 font-normal italic">Not Set</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="p-3 bg-base-50 dark:bg-gray-900 border border-base-100 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-lg" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Address</p>
                <p className="font-bold text-gray-800 dark:text-white mt-0.5">
                  {dbUser?.address || <span className="text-gray-400 font-normal italic">Not Set</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Widget */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-base-200 dark:border-gray-700 shadow-sm flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-base-100 dark:border-gray-700">
            Activity Stats
          </h2>

          <div className="flex flex-col gap-4">
            {role === 'customer' && (
              <>
                <div className="bg-lime-50/50 dark:bg-lime-950/20 border border-lime-100/50 dark:border-lime-900/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-lime-100 dark:bg-lime-900 rounded-xl text-lime-600 dark:text-lime-400"><FaShoppingBag /></span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Orders Placed</span>
                  </div>
                  <span className="text-xl font-extrabold text-lime-600 dark:text-lime-400">{customerOrders.length}</span>
                </div>

                <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-rose-100 dark:bg-rose-900 rounded-xl text-rose-600 dark:text-rose-400"><FaHeart /></span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Wishlisted Plants</span>
                  </div>
                  <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{customerWishlist.length}</span>
                </div>
              </>
            )}

            {role === 'seller' && (
              <>
                <div className="bg-lime-50/50 dark:bg-lime-950/20 border border-lime-100/50 dark:border-lime-900/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-lime-100 dark:bg-lime-900 rounded-xl text-lime-600 dark:text-lime-400"><FaWarehouse /></span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">My Plants Inventory</span>
                  </div>
                  <span className="text-xl font-extrabold text-lime-600 dark:text-lime-400">{sellerInventory.length}</span>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-blue-100 dark:bg-blue-900 rounded-xl text-blue-600 dark:text-blue-400"><FaShoppingBag /></span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Orders Received</span>
                  </div>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{sellerOrders.length}</span>
                </div>
              </>
            )}

            {role === 'admin' && (
              <>
                <div className="bg-lime-50/50 dark:bg-lime-950/20 border border-lime-100/50 dark:border-lime-900/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-lime-100 dark:bg-lime-900 rounded-xl text-lime-600 dark:text-lime-400"><FaUsers /></span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Total Platform Users</span>
                  </div>
                  <span className="text-xl font-extrabold text-lime-600 dark:text-lime-400">{adminUsers.length}</span>
                </div>

                <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-purple-100 dark:bg-purple-900 rounded-xl text-purple-600 dark:text-purple-400"><FaTicketAlt /></span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Active Coupons</span>
                  </div>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{adminCoupons.length}</span>
                </div>
              </>
            )}
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

export default Profile
