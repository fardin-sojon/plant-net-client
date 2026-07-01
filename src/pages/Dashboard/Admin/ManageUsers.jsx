import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import UserDataRow from '../../../components/Dashboard/TableRows/UserDataRow'
import UserCard from '../../../components/Dashboard/Cards/UserCard'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { FaUsers, FaUserShield, FaStore, FaClock, FaSearch } from 'react-icons/fa'

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axiosSecure(`/users`)
      return data
    },
  })

  if (isLoading) return <LoadingSpinner />

  // Calculate statistics counts
  const totalUsers = users.length
  const totalAdmins = users.filter(u => u.role === 'admin').length
  const totalSellers = users.filter(u => u.role === 'seller').length
  const pendingRequests = users.filter(u => u.status === 'Requested').length

  // Filter users based on search query, role filter, and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user?.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user?.email && user.email.toLowerCase().includes(search.toLowerCase()))
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase()
    
    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Unavailable' 
        ? !user.status 
        : user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className='container mx-auto px-4 sm:px-8 max-w-6xl py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-extrabold text-gray-800 dark:text-white mb-2'>Manage Users</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Monitor user accounts, update security roles, verify seller status applications, or manage user deletion records.
        </p>
      </div>

      {/* Summary Statistics Strip */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white dark:bg-gray-800 p-4 border border-base-200 dark:border-gray-700 shadow-xs rounded-2xl flex items-center gap-4'>
          <span className='p-3 bg-lime-50 dark:bg-lime-950 text-lime-600 dark:text-lime-400 rounded-xl text-xl'><FaUsers /></span>
          <div>
            <p className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Total Users</p>
            <p className='text-xl font-extrabold text-gray-800 dark:text-white mt-0.5'>{totalUsers}</p>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-4 border border-base-200 dark:border-gray-700 shadow-xs rounded-2xl flex items-center gap-4'>
          <span className='p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl text-xl'><FaUserShield /></span>
          <div>
            <p className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Admins</p>
            <p className='text-xl font-extrabold text-gray-800 dark:text-white mt-0.5'>{totalAdmins}</p>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-4 border border-base-200 dark:border-gray-700 shadow-xs rounded-2xl flex items-center gap-4'>
          <span className='p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl text-xl'><FaStore /></span>
          <div>
            <p className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Sellers</p>
            <p className='text-xl font-extrabold text-gray-800 dark:text-white mt-0.5'>{totalSellers}</p>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-4 border border-base-200 dark:border-gray-700 shadow-xs rounded-2xl flex items-center gap-4'>
          <span className={`p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl text-xl ${pendingRequests > 0 ? 'animate-pulse' : ''}`}><FaClock /></span>
          <div>
            <p className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Requests</p>
            <p className='text-xl font-extrabold text-gray-800 dark:text-white mt-0.5'>{pendingRequests}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className='bg-white dark:bg-gray-800 p-5 rounded-2xl border border-base-200 dark:border-gray-700 shadow-xs flex flex-col md:flex-row gap-4 items-end mb-6'>
        {/* Search */}
        <div className='flex-1 w-full'>
          <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>Search Account</label>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search by name or email...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all text-sm'
            />
            <span className='absolute left-3.5 top-3 text-gray-400'><FaSearch /></span>
          </div>
        </div>

        {/* Role Filter */}
        <div className='w-full md:w-48'>
          <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>Role Filter</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className='w-full px-3 py-2 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all text-sm'
          >
            <option value='All'>All Roles</option>
            <option value='Admin'>Admin</option>
            <option value='Seller'>Seller</option>
            <option value='Customer'>Customer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className='w-full md:w-48'>
          <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='w-full px-3 py-2 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all text-sm'
          >
            <option value='All'>All Statuses</option>
            <option value='Requested'>Requested</option>
            <option value='Verified'>Verified</option>
            <option value='Unavailable'>Unavailable</option>
          </select>
        </div>
      </div>

      {/* Users View */}
      {filteredUsers.length > 0 ? (
        <div className='inline-block min-w-full shadow-md rounded-2xl overflow-hidden border border-base-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
          {/* Desktop View: Table */}
          <table className='min-w-full leading-normal hidden md:table'>
            <thead>
              <tr>
                <th scope='col' className='px-5 py-3 bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left text-xs uppercase font-bold tracking-wider'>
                  Name
                </th>
                <th scope='col' className='px-5 py-3 bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left text-xs uppercase font-bold tracking-wider'>
                  Email
                </th>
                <th scope='col' className='px-5 py-3 bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left text-xs uppercase font-bold tracking-wider'>
                  Role
                </th>
                <th scope='col' className='px-5 py-3 bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left text-xs uppercase font-bold tracking-wider'>
                  Status
                </th>
                <th scope='col' className='px-5 py-3 bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left text-xs uppercase font-bold tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <UserDataRow
                  key={user?._id}
                  user={user}
                  refetch={refetch}
                />
              ))}
            </tbody>
          </table>

          {/* Mobile View: Cards */}
          <div className='md:hidden space-y-4 p-4 bg-base-50 dark:bg-gray-900'>
            {filteredUsers.map(user => (
              <UserCard key={user?._id} user={user} refetch={refetch} />
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-base-200 dark:border-gray-700 shadow-sm'>
          <p className='text-gray-500 dark:text-gray-400 font-medium'>No user accounts match your active search filters.</p>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
