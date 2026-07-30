import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaFolder, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([
    { id: 1, name: 'Indoor Plants', slug: 'indoor-plants', count: 42, icon: '🌿', description: 'Plants suitable for indoor environment' },
    { id: 2, name: 'Outdoor Plants', slug: 'outdoor-plants', count: 35, icon: '🌳', description: 'Sun-loving exterior garden plants' },
    { id: 3, name: 'Succulents & Cacti', slug: 'succulents-cacti', count: 28, icon: '🌵', description: 'Low maintenance desert flora' },
    { id: 4, name: 'Flowering Plants', slug: 'flowering-plants', count: 19, icon: '🌸', description: 'Beautiful colorful blooming flora' },
    { id: 5, name: 'Pots & Planters', slug: 'pots-planters', count: 54, icon: '🪴', description: 'Ceramic, plastic and terracotta containers' },
    { id: 6, name: 'Plant Care & Tools', slug: 'care-tools', count: 16, icon: '✂️', description: 'Fertilizers, shears and watering cans' },
  ])

  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!newCatName.trim()) {
      toast.error('Category name is required')
      return
    }
    const newCategory = {
      id: Date.now(),
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      icon: '🌱',
      description: newCatDesc || 'Newly added plant category',
    }
    setCategories([...categories, newCategory])
    setNewCatName('')
    setNewCatDesc('')
    toast.success('Category created successfully!')
  }

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id))
    toast.success('Category removed')
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
            <FaFolder className='text-lime-500' /> Category Management
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Organize plants and accessories into structured categories
          </p>
        </div>
      </div>

      {/* Grid: Create Form & List */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Create Category Form */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
            <FaPlus className='text-lime-500 text-sm' /> Add New Category
          </h2>
          <form onSubmit={handleAddCategory} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1'>
                Category Name
              </label>
              <input
                type='text'
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder='e.g., Tropical Palms'
                className='w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1'>
                Description
              </label>
              <textarea
                rows='3'
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder='Short category description...'
                className='w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition'
              ></textarea>
            </div>
            <button
              type='submit'
              className='w-full py-2.5 px-4 bg-lime-500 hover:bg-lime-600 text-white font-medium rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer'
            >
              <FaPlus className='text-xs' /> Create Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className='lg:col-span-2 space-y-4'>
          {/* Search bar */}
          <div className='relative'>
            <FaSearch className='absolute left-3.5 top-3.5 text-gray-400 text-sm' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search categories...'
              className='w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none shadow-sm'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className='bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition flex flex-col justify-between group'
              >
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-3xl p-2 bg-lime-50 dark:bg-lime-950/40 rounded-xl'>
                      {cat.icon}
                    </span>
                    <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-300'>
                      {cat.count} Items
                    </span>
                  </div>
                  <h3 className='font-bold text-gray-800 dark:text-white text-base group-hover:text-lime-600 transition'>
                    {cat.name}
                  </h3>
                  <p className='text-xs text-gray-400 font-mono mt-0.5'>/{cat.slug}</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2'>
                    {cat.description}
                  </p>
                </div>

                <div className='flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50'>
                  <button
                    onClick={() => toast.success(`Editing ${cat.name}`)}
                    className='p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition'
                    title='Edit'
                  >
                    <FaEdit className='text-sm' />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className='p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition'
                    title='Delete'
                  >
                    <FaTrash className='text-sm' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories
