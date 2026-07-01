import React, { useState } from 'react'
import Plants from '../../components/Home/Plants'
import Container from '../../components/Shared/Container'

const Shop = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [stockStatus, setStockStatus] = useState('All')

  return (
    <div className='min-h-screen pt-12 bg-base-100 transition-colors duration-300'>
      <Container>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>Our Collection</h1>
          <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Browse our wide selection of indoor and outdoor plants. From easy-care succulents to lush tropical foliage, find the perfect green companion for your space.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 mb-8 border border-base-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-end">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Search Plant</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all"
              />
              <span className="absolute left-3.5 top-3.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all"
            >
              <option value="All">All Categories</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Flower">Flower</option>
              <option value="Fruit">Fruit</option>
              <option value="Medicinal">Medicinal</option>
              <option value="Succulent">Succulent</option>
            </select>
          </div>

          {/* Stock Status Dropdown */}
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Availability</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition-all"
            >
              <option value="default">Default</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>
        </div>
      </Container>
      
      {/* Plants Grid */}
      <Plants search={search} category={category} sortBy={sortBy} stockStatus={stockStatus} />
    </div>
  )
}

export default Shop
