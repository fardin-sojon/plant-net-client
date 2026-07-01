import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { FaTrash, FaPlus, FaTicketAlt } from 'react-icons/fa'

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure()
  const [code, setCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [discountType, setDiscountType] = useState('percent')

  const { data: coupons = [], isLoading, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosSecure('/coupons')
      return res.data
    }
  })

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
        discountType
      })
      toast.success('Coupon created successfully!')
      setCode('')
      setDiscountAmount('')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/coupons/${id}`)
      toast.success('Coupon deleted')
      refetch()
    } catch (err) {
      toast.error('Failed to delete coupon')
    }
  }

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
        {/* Create Coupon Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-base-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaPlus className="text-lime-500 text-sm" />
            <span>Create Coupon</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Coupon Name</label>
              <input
                type="text"
                placeholder="COUPON NAME"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {discountType === 'percent' ? 'Discount Percentage' : 'Discount Amount'}
              </label>
              <input
                type="number"
                placeholder={discountType === 'percent' ? '15' : '100'}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition cursor-pointer shadow-sm text-sm"
            >
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupon List Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-base-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {coupons.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <FaTicketAlt className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="font-bold text-gray-700 dark:text-gray-300">No active coupons found</p>
              <p className="text-xs text-gray-400 mt-1">Create one using the form on the left.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-base-50/50 dark:hover:bg-gray-900/30 transition">
                      <td className="px-6 py-4 font-bold text-lime-600 dark:text-lime-400 tracking-wider">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">
                        {coupon.discountType === 'percent' ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                          coupon.discountType === 'percent' 
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400' 
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400'
                        }`}>
                          {coupon.discountType === 'percent' ? 'Percent' : 'Fixed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                          title="Delete Coupon"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageCoupons
