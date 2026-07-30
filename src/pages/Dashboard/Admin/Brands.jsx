import { useState } from 'react'
import { FaTag, FaPlus, FaSearch, FaTrash, FaGlobe } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Brands = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [brands, setBrands] = useState([
    { id: 1, name: 'EcoGreen Nursery', origin: 'Oregon, USA', products: 45, logo: '🌱', status: 'Active' },
    { id: 2, name: 'FloraCraft Organics', origin: 'California, USA', products: 32, logo: '🍃', status: 'Active' },
    { id: 3, name: 'Botanica Heritage', origin: 'Amsterdam, NL', products: 28, logo: '🌷', status: 'Active' },
    { id: 4, name: 'Succulent Haven', origin: 'Arizona, USA', products: 19, logo: '🌵', status: 'Active' },
    { id: 5, name: 'UrbanJungle Supply', origin: 'Berlin, DE', products: 60, logo: '🪴', status: 'Active' },
  ])

  const [brandName, setBrandName] = useState('')
  const [brandOrigin, setBrandOrigin] = useState('')

  const handleAddBrand = (e) => {
    e.preventDefault()
    if (!brandName.trim()) {
      toast.error('Brand name is required')
      return
    }
    const newBrand = {
      id: Date.now(),
      name: brandName,
      origin: brandOrigin || 'Global',
      products: 0,
      logo: '🌿',
      status: 'Active',
    }
    setBrands([...brands, newBrand])
    setBrandName('')
    setBrandOrigin('')
    toast.success('Brand added successfully!')
  }

  const handleDelete = (id) => {
    setBrands(brands.filter((b) => b.id !== id))
    toast.success('Brand removed')
  }

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.origin.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
            <FaTag className='text-lime-500' /> Brands & Suppliers
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Manage partnered nurseries, plant growers and brand suppliers
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Add Brand */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
            <FaPlus className='text-lime-500 text-sm' /> Add New Brand
          </h2>
          <form onSubmit={handleAddBrand} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1'>
                Brand / Supplier Name
              </label>
              <input
                type='text'
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder='e.g. Terra Botanics'
                className='w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1'>
                Origin / Region
              </label>
              <input
                type='text'
                value={brandOrigin}
                onChange={(e) => setBrandOrigin(e.target.value)}
                placeholder='e.g. Washington, USA'
                className='w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none'
              />
            </div>
            <button
              type='submit'
              className='w-full py-2.5 px-4 bg-lime-500 hover:bg-lime-600 text-white font-medium rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer'
            >
              <FaPlus className='text-xs' /> Save Brand
            </button>
          </form>
        </div>

        {/* Brand Cards Grid */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='relative'>
            <FaSearch className='absolute left-3.5 top-3.5 text-gray-400 text-sm' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search brands or origins...'
              className='w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none shadow-sm'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className='bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-lime-50 dark:bg-lime-950/40 flex items-center justify-center text-2xl'>
                    {brand.logo}
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 dark:text-white text-base'>
                      {brand.name}
                    </h3>
                    <p className='text-xs text-gray-400 flex items-center gap-1 mt-0.5'>
                      <FaGlobe className='text-gray-400' /> {brand.origin}
                    </p>
                    <span className='inline-block mt-2 text-xs font-medium text-lime-600 dark:text-lime-400'>
                      {brand.products} Linked Plants
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(brand.id)}
                  className='p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                  title='Delete'
                >
                  <FaTrash className='text-sm' />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Brands
