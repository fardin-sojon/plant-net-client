import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'

const CustomerOrderCard = ({ order, handleDelete }) => {
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)

  const { _id, image, name, category, price, quantity, status } = order || {}

  return (
    <div className='bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3'>
       {/* Top Row: Image & Name */}
       <div className='flex items-center gap-3'>
          <img
            alt='plant'
            src={image}
            className='object-cover rounded h-12 w-16'
          />
          <div>
            <p className='font-bold text-gray-900'>{name}</p>
            <p className='text-xs text-gray-500'>{category}</p>
          </div>
          <div className='ml-auto'>
              <span className={`text-xs px-2 py-1 rounded-full ${
                status === 'Delivered' ? 'bg-green-100 text-green-800' :
                status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {status}
            </span>
          </div>
       </div>

      {/* Details Grid */}
      <div className='grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded'>
         <div>
            <p className='text-xs uppercase text-gray-500'>Price</p>
            <p className='font-medium'>${price}</p>
         </div>
         <div className='text-right'>
             <p className='text-xs uppercase text-gray-500'>Quantity</p>
             <p className='font-medium'>{quantity}</p>
         </div>
      </div>

       <div className='flex justify-end pt-2'>
        <button
          onClick={() => setIsOpen(true)}
          disabled={status === 'Delivered' || status === 'In Progress'}
          className='disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 text-red-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-200 transition'
        >
          Cancel Order
        </button>
       </div>

        <DeleteModal
          handleDelete={handleDelete}
          isOpen={isOpen}
          closeModal={closeModal}
          id={_id}
        />
    </div>
  )
}

export default CustomerOrderCard
