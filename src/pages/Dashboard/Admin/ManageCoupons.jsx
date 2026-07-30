import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import DeleteModal from '../../../components/Modal/DeleteModal'
import toast from 'react-hot-toast'
import { FaTrashAlt, FaPen, FaEye, FaPlus, FaTicketAlt, FaSearch } from 'react-icons/fa'

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure()
  const [code, setCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [discountType, setDiscountType] = useState('percent')
  const [searchTerm, setSearchTerm] = useState('')

  // Edit Modal State
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [editCode, setEditCode] = useState('')
  const [editDiscountAmount, setEditDiscountAmount] = useState('')
  const [editDiscountType, setEditDiscountType] = useState('percent')
  const [editStatus, setEditStatus] = useState('Active')

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: '' })

  const { data: coupons = [], isLoading, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosSecure('/coupons')
      return res.data
    }
  })

  // Create Coupon Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim() || !discountAmount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await axiosSecure.post('/coupons', {
        code: code.trim().toUpperCase(),
        discountAmount: parseFloat(discountAmount),
        discountType,
        status: 'Active'
      })
      toast.success('Coupon created successfully!')
      setCode('')
      setDiscountAmount('')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon')
    }
  }

  // Open Delete Modal
  const openDeleteModal = (coupon) => {
    setDeleteTarget({ id: coupon._id, name: coupon.code })
    setIsDeleteOpen(true)
  }

  // Delete Coupon Handler
  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/coupons/${id}`)
      toast.success('Coupon deleted successfully!')
      refetch()
    } catch (err) {
      toast.error('Failed to delete coupon')
    }
  }

  // Toggle Coupon Status (Active / Inactive)
  const handleToggleStatus = async (coupon) => {
    const newStatus = coupon.status === 'Inactive' ? 'Active' : 'Inactive'
    const payload = { status: newStatus }
    try {
      await axiosSecure.patch(`/coupons/${coupon._id}`, payload)
      toast.success(`Coupon status set to ${newStatus}`)
      refetch()
    } catch (err) {
      try {
        await axiosSecure.put(`/coupons/${coupon._id}`, payload)
        toast.success(`Coupon status set to ${newStatus}`)
        refetch()
      } catch (err2) {
        try {
          await axiosSecure.post(`/coupons/${coupon._id}`, payload)
          toast.success(`Coupon status set to ${newStatus}`)
          refetch()
        } catch (err3) {
          toast.error(err3.response?.data?.message || err3.message || 'Failed to update status')
        }
      }
    }
  }

  // Open Edit Modal
  const openEditModal = (coupon) => {
    setEditingCoupon(coupon)
    setEditCode(coupon.code)
    setEditDiscountAmount(coupon.discountAmount)
    setEditDiscountType(coupon.discountType || 'percent')
    setEditStatus(coupon.status || 'Active')
  }

  // Save Edit Coupon
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingCoupon) return
    const payload = {
      code: editCode.trim().toUpperCase(),
      discountAmount: parseFloat(editDiscountAmount),
      discountType: editDiscountType,
      status: editStatus
    }
    try {
      await axiosSecure.patch(`/coupons/${editingCoupon._id}`, payload)
      toast.success('Coupon updated successfully!')
      setEditingCoupon(null)
      refetch()
    } catch (err) {
      try {
        await axiosSecure.put(`/coupons/${editingCoupon._id}`, payload)
        toast.success('Coupon updated successfully!')
        setEditingCoupon(null)
        refetch()
      } catch (err2) {
        try {
          await axiosSecure.post(`/coupons/${editingCoupon._id}`, payload)
          toast.success('Coupon updated successfully!')
          setEditingCoupon(null)
          refetch()
        } catch (err3) {
          toast.error(err3.response?.data?.message || err3.message || 'Failed to update coupon')
        }
      }
    }
  }

  // Filter Coupons by Search Term
  const filteredCoupons = coupons.filter(c =>
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.discountAmount).includes(searchTerm)
  )

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Coupons</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create, track, and manage promotional coupon codes for your customers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create Coupon Form Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaPlus className="text-emerald-500 text-sm" />
            <span>Create Coupon</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Coupon Name</label>
              <input
                type="text"
                placeholder="COUPON NAME"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition cursor-pointer"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {discountType === 'percent' ? 'Discount Percentage' : 'Discount Amount'}
              </label>
              <input
                type="number"
                placeholder={discountType === 'percent' ? '15' : '100'}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer shadow-sm text-sm"
            >
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupon List Table Container */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-5">
          {/* Top Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by code or discount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400 text-sm" />
            </div>
            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer"
            >
              Search
            </button>
          </div>

          {filteredCoupons.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <FaTicketAlt className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="font-bold text-gray-700 dark:text-gray-300">No coupons found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search or create a new coupon.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750 text-sm text-gray-700 dark:text-gray-300">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition">
                      <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {coupon.code}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-800 dark:text-white">
                        {coupon.discountType === 'percent' ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                          coupon.discountType === 'percent' 
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' 
                            : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                        }`}>
                          {coupon.discountType === 'percent' ? 'Percent' : 'Fixed'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          coupon.status === 'Inactive'
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {coupon.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          {/* Toggle Status Eye Icon */}
                          <button
                            onClick={() => handleToggleStatus(coupon)}
                            className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer p-1"
                            title={`Toggle Status (Currently ${coupon.status || 'Active'})`}
                          >
                            <FaEye className="text-base" />
                          </button>

                          {/* Edit Pencil Icon */}
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer p-1"
                            title="Edit Coupon"
                          >
                            <FaPen className="text-sm" />
                          </button>

                          {/* Delete Trash Icon */}
                          <button
                            onClick={() => openDeleteModal(coupon)}
                            className="text-gray-400 hover:text-red-500 transition cursor-pointer p-1"
                            title="Delete Coupon"
                          >
                            <FaTrashAlt className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Coupon</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Discount Type</label>
                <select
                  value={editDiscountType}
                  onChange={(e) => setEditDiscountType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Discount Amount</label>
                <input
                  type="number"
                  value={editDiscountAmount}
                  onChange={(e) => setEditDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Confirmation Delete Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        closeModal={() => setIsDeleteOpen(false)}
        handleDelete={handleDelete}
        id={deleteTarget.id}
        itemName={deleteTarget.name}
      />
    </div>
  )
}

export default ManageCoupons
