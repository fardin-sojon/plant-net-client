import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'

const SellerOrderCard = ({ order, handleDelete, handleStatusChange }) => {
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)

  const { _id, name, customer, price, quantity, status, address, image } = order

  return (
    <div className='bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3'>
       {/* Name & Image  */}
       <div className='flex justify-between items-center gap-3'>
          <div className='flex items-center gap-3'>
            <img
              alt='product'
              src={image}
              className='object-cover rounded h-12 w-12'
            />
            <p className='font-bold text-gray-900'>{name}</p>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'Delivered' ? 'bg-green-100 text-green-800' :
            status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
             {status}
          </span>
       </div>
       
       <div className='text-sm space-y-1 text-gray-600'>
          <p><span className='font-semibold'>Customer:</span> {customer?.email || customer?.name || customer}</p>
          <p><span className='font-semibold'>Address:</span> {address}</p>
       </div>

      <div className='grid grid-cols-2 gap-4 text-sm'>
         <div className='bg-gray-50 p-2 rounded'>
            <p className='text-xs uppercase text-gray-500'>Price</p>
            <p className='font-medium'>${price}</p>
         </div>
         <div className='bg-gray-50 p-2 rounded'>
             <p className='text-xs uppercase text-gray-500'>Qty</p>
             <p className='font-medium'>{quantity}</p>
         </div>
      </div>

      <hr className='border-gray-100'/>
      
      {/* Actions */}
      <div className='flex items-center justify-between gap-2 mt-2'>
        <select
            required
            className='p-1 border border-gray-300 rounded-md text-sm text-gray-900 bg-white flex-1'
            name='category'
            value={status}
            onChange={(e)=> handleStatusChange(_id, e.target.value)}
            disabled={status === 'Delivered'}
        >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Delivered'>Delivered</option>
        </select>
        
        <button
            onClick={() => setIsOpen(true)}
            disabled={status === 'Delivered' || status === 'In Progress'}
            className='disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed  bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-200 transition'
        >
            Cancel
        </button>
      </div>

       <DeleteModal isOpen={isOpen} closeModal={closeModal} handleDelete={handleDelete} id={_id}/>
    </div>
  )
}

export default SellerOrderCard
