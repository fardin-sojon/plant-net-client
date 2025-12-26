import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import UpdatePlantModal from '../../Modal/UpdatePlantModal'

const InventoryCard = ({ plant, handleDelete, refetch }) => {
  let [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { _id, name, image, category, quantity, price } = plant

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-3'>
       {/* Image and Name */}
      <div className='flex items-center space-x-4'>
        <img
          alt='profile'
          src={image}
          className='object-cover rounded h-16 w-16'
        />
        <div>
           <p className='text-gray-900 dark:text-white font-bold text-lg'>{name}</p>
           <p className='text-gray-600 dark:text-gray-400 text-sm'>{category}</p>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className='grid grid-cols-2 gap-2 text-sm'>
         <div>
            <p className='text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs'>Price</p>
            <p className='text-gray-900 dark:text-white font-medium'>${price}</p>
         </div>
         <div className='text-right'>
             <p className='text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs'>Quantity</p>
             <p className='text-gray-900 dark:text-white font-medium'>{quantity}</p>
         </div>
      </div>

      <hr className='border-gray-100 dark:border-gray-700'/>

      {/* Actions */}
      <div className='flex justify-end gap-3'>
        <span
          onClick={openModal}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-red-900 dark:text-white leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-red-200 opacity-50 dark:bg-red-600 dark:opacity-100 rounded-full'
          ></span>
          <span className='relative'>Delete</span>
        </span>
        
        <span
          onClick={() => setIsEditModalOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 dark:text-white leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 dark:bg-green-600 dark:opacity-100 rounded-full'
          ></span>
          <span className='relative'>Update</span>
        </span>
      </div>

       {/* Modals */}
      <DeleteModal
          isOpen={isOpen}
           closeModal={closeModal}
           handleDelete={handleDelete}
           id={_id}
         />
      <UpdatePlantModal
          isOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          plant={plant}
          refetch={refetch}
        />
    </div>
  )
}

export default InventoryCard
