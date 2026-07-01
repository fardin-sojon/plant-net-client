import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useCart from '../../../hooks/useCart'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { FaTrash, FaShoppingCart } from 'react-icons/fa'

const Wishlist = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const { addToCart } = useCart()

  const { data: wishlistItems = [], isLoading, refetch } = useQuery({
    queryKey: ['wishlist', user?.email || user?.providerData?.[0]?.email],
    enabled: !!(user?.email || user?.providerData?.[0]?.email),
    queryFn: async () => {
      const res = await axiosSecure(`/wishlist/${user?.email || user?.providerData?.[0]?.email}`)
      return res.data
    }
  })

  const handleRemove = async (id) => {
    try {
      await axiosSecure.delete(`/wishlist/${id}`)
      toast.success('Removed from wishlist')
      refetch()
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  const handleAddToCart = (item) => {
    addToCart({
      _id: item.plantId,
      name: item.name,
      image: item.image,
      category: item.category,
      price: item.price,
      quantity: 1 // default purchase quantity
    })
    toast.success('Added to cart!')
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Wishlist</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of the plants you love and add them to your cart anytime.
          </p>
        </div>
        <Link to="/shop" className="px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition shadow-md text-sm cursor-pointer">
          Continue Shopping
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-base-200 dark:border-gray-700 rounded-2xl p-10 text-center shadow-xs">
          <div className="text-5xl mb-4">💚</div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto text-sm">
            Explore our collection and add your favorite plants to your wishlist!
          </p>
          <Link to="/shop" className="inline-block mt-5 px-6 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition shadow-xs text-sm">
            Browse Plants
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-base-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-base-50 dark:bg-gray-900 border-b border-base-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Plant</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
                {wishlistItems.map((item) => (
                  <tr key={item._id} className="hover:bg-base-50/50 dark:hover:bg-gray-900/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-base-200 dark:border-gray-700"
                        />
                        <span className="font-bold text-gray-800 dark:text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-lime-100 dark:bg-lime-950 text-lime-700 dark:text-lime-400 rounded-lg text-xs font-bold uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">${item.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-lg transition shadow-xs text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <FaShoppingCart />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist
