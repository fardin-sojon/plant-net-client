import { useState } from 'react'
import { FaImage, FaUpload, FaSearch, FaTrash, FaCopy } from 'react-icons/fa'
import toast from 'react-hot-toast'

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: 'monstera-deliciosa.jpg', size: '1.2 MB', dimension: '1200x800', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=60' },
    { id: 2, name: 'snake-plant.jpg', size: '850 KB', dimension: '1080x1080', url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?w=500&auto=format&fit=crop&q=60' },
    { id: 3, name: 'fiddle-leaf-fig.jpg', size: '2.1 MB', dimension: '1600x1200', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=60' },
    { id: 4, name: 'peace-lily-bloom.jpg', size: '940 KB', dimension: '1000x1000', url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=500&auto=format&fit=crop&q=60' },
    { id: 5, name: 'succulent-collection.jpg', size: '1.5 MB', dimension: '1280x960', url: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=500&auto=format&fit=crop&q=60' },
    { id: 6, name: 'ceramic-planter-green.jpg', size: '720 KB', dimension: '800x800', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60' },
  ])

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('Image URL copied to clipboard!')
  }

  const handleDelete = (id) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id))
    toast.success('Media file deleted')
  }

  const filteredMedia = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
            <FaImage className='text-lime-500' /> Media Library
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Manage plant photos, banners, and asset uploads
          </p>
        </div>

        <button
          onClick={() => toast.success('Select image files to upload...')}
          className='px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer w-fit'
        >
          <FaUpload /> Upload Media
        </button>
      </div>

      {/* Search & Filter */}
      <div className='relative'>
        <FaSearch className='absolute left-3.5 top-3.5 text-gray-400 text-sm' />
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search media filenames...'
          className='w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none shadow-sm'
        />
      </div>

      {/* Media Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition group'
          >
            <div className='relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden'>
              <img
                src={item.url}
                alt={item.name}
                className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3'>
                <button
                  onClick={() => handleCopyUrl(item.url)}
                  className='p-2.5 bg-white text-gray-800 rounded-xl hover:bg-lime-500 hover:text-white transition shadow'
                  title='Copy URL'
                >
                  <FaCopy />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className='p-2.5 bg-white text-gray-800 rounded-xl hover:bg-red-500 hover:text-white transition shadow'
                  title='Delete'
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className='p-4'>
              <h3 className='font-semibold text-gray-800 dark:text-white text-sm truncate'>
                {item.name}
              </h3>
              <div className='flex items-center justify-between text-xs text-gray-400 mt-2'>
                <span>{item.dimension}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaLibrary
