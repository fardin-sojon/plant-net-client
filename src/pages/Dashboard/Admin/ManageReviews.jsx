import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { FaTrash, FaStar, FaSearch } from 'react-icons/fa'

const ManageReviews = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all reviews
  const { data: reviews = [], isLoading, error, isError } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const { data } = await axiosSecure('/all-reviews')
      return data
    },
  })

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/reviews/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-reviews'])
      toast.success('Review deleted successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete review')
    },
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(id)
    }
  }

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const comment = review.comment?.toLowerCase() || ''
    const email = (review.email || review.customerEmail)?.toLowerCase() || ''
    const name = (review.name || review.customerName)?.toLowerCase() || ''
    const search = searchTerm.toLowerCase()
    return comment.includes(search) || email.includes(search) || name.includes(search)
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) {
    return (
      <div className='container mx-auto px-4 py-8 text-center text-rose-500 font-bold'>
        Error loading reviews: {error?.response?.data?.message || error.message}
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Manage Reviews</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Monitor and moderate user feedback across the entire platform
          </p>
        </div>
        
        {/* Search bar */}
        <div className='relative w-full md:w-80'>
          <input
            type='text'
            placeholder='Search reviews...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500'
          />
          <FaSearch className='absolute left-3 top-3.5 text-gray-400' />
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center text-gray-500 dark:text-gray-400'>
          No reviews found matching your search.
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1'
            >
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <img
                    src={review.avatar || review.customerImage || 'https://i.ibb.co.com/CFxm3Oy/placeholder.jpg'}
                    alt={review.name || review.customerName}
                    className='w-10 h-10 rounded-full object-cover border-2 border-lime-400'
                  />
                  <div>
                    <h3 className='font-semibold text-gray-800 dark:text-white text-sm'>
                      {review.name || review.customerName}
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {review.email || review.customerEmail || 'No Email'}
                    </p>
                  </div>
                </div>

                {/* Rating stars */}
                <div className='flex items-center gap-1 mb-3'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < (review.rating || 5) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                  <span className='text-xs font-bold text-gray-500 dark:text-gray-400 ml-2'>
                    {review.rating || 5}.0
                  </span>
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-300 italic mb-4 leading-relaxed'>
                  "{review.comment}"
                </p>
              </div>

              <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
                <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-50 dark:bg-lime-950/30 text-lime-600 dark:text-lime-400'>
                  Plant ID: {review.plantId?.substring(0, 8)}...
                </span>
                <button
                  onClick={() => handleDelete(review._id)}
                  className='p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer'
                  title='Delete Review'
                >
                  <FaTrash className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageReviews
