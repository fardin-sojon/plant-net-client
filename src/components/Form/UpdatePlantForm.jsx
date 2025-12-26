import { useState, useEffect } from 'react'

const UpdatePlantForm = ({ handleSubmit, plantData, loading }) => {
  const { name, category, price, quantity, description, image } = plantData || {}
  const [imagePreview, setImagePreview] = useState(image)

  const handleImageChange = image => {
    setImagePreview(URL.createObjectURL(image))
  }

  useEffect(() => {
    if (plantData?.image) {
      setImagePreview(plantData.image)
    }
  }, [plantData])

  return (
    <div className='w-full flex flex-col justify-center items-center text-gray-800 dark:text-white rounded-xl bg-gray-50 dark:bg-gray-800'>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-10'>
          <div className='space-y-6'>
            {/* Name */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='name' className='block text-gray-600 dark:text-gray-300'>
                Name
              </label>
              <input
                className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                name='name'
                id='name'
                type='text'
                placeholder='Plant Name'
                defaultValue={name}
                required
              />
            </div>
            {/* Category */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='category' className='block text-gray-600 dark:text-gray-300'>
                Category
              </label>
              <select
                required
                className='w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                name='category'
                defaultValue={category}
              >
                <option value='Indoor'>Indoor</option>
                <option value='Outdoor'>Outdoor</option>
                <option value='Succulent'>Succulent</option>
                <option value='Flowering'>Flowering</option>
              </select>
            </div>
            {/* Description */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='description' className='block text-gray-600 dark:text-gray-300'>
                Description
              </label>

              <textarea
                id='description'
                placeholder='Write plant description here...'
                className='block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                name='description'
                defaultValue={description}
              ></textarea>
            </div>
          </div>
          <div className='space-y-6 flex flex-col'>
            {/* Price & Quantity */}
            <div className='flex justify-between gap-2'>
              {/* Price */}
              <div className='space-y-1 text-sm'>
                <label htmlFor='price' className='block text-gray-600 dark:text-gray-300'>
                  Price
                </label>
                <input
                  className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  name='price'
                  id='price'
                  type='number'
                  placeholder='Price per unit'
                  defaultValue={price}
                  required
                />
              </div>

              {/* Quantity */}
              <div className='space-y-1 text-sm'>
                <label htmlFor='quantity' className='block text-gray-600 dark:text-gray-300'>
                  Quantity
                </label>
                <input
                  className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  name='quantity'
                  id='quantity'
                  type='number'
                  placeholder='Available quantity'
                  defaultValue={quantity}
                  required
                />
              </div>
            </div>
            {/* Image */}
            <div className=' p-4  w-full  m-auto rounded-lg grow'>
              <div className='file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 dark:border-gray-600 rounded-lg'>
                <div className='flex flex-col w-max mx-auto text-center'>
                  <label>
                    <input
                      className='text-sm cursor-pointer w-36 hidden'
                      type='file'
                      name='image'
                      id='image'
                      accept='image/*'
                      hidden
                      onChange={e => handleImageChange(e.target.files[0])}
                    />
                    <div className='bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500'>
                      Upload Image
                    </div>
                  </label>
                </div>
              </div>
              {imagePreview && (
                <div className="flex justify-center mt-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {imagePreview !== plantData?.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(plantData?.image);
                          document.getElementById("image").value = "";
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md z-10"
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 '
            >
              {loading ? 'Updating...' : 'Update Plant'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdatePlantForm
