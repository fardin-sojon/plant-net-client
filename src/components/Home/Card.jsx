import { Link } from 'react-router'
import useCart from '../../hooks/useCart'
import toast from 'react-hot-toast'

const Card = ({plant}) => {

  // console.log(plant);
  // console.log(plant);
  const { _id, name, image, category, quantity, price } = plant
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(plant)
    toast.success('Added to Cart!')
  }

  return (
    <Link
      to={`/plant/${_id}`}
      className='col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl relative hover:shadow-2xl transition duration-300'
    >
      <div className='flex flex-col gap-2 w-full'>
        <div
          className='
              aspect-square 
              w-full 
              relative 
              overflow-hidden 
              rounded-xl
            '
        >
          <img
            className='
                object-cover 
                h-full 
                w-full 
                group-hover:scale-110 
                transition
              '
            src={image}
            alt={name}
          />
        </div>
        <div className='font-semibold text-lg text-gray-800 dark:text-white'>{name}</div>
        <div className='font-semibold text-sm text-gray-500 dark:text-gray-400'>Category: {category}</div>
        <div className='font-semibold text-sm text-gray-500 dark:text-gray-400'>Quantity: {quantity}</div>
        <div className='flex flex-row items-center justify-between gap-1 w-full mt-1'>
          <div className='font-bold text-lg text-lime-600 dark:text-lime-400'>Price: {price}$</div>
          <div
            onClick={handleAddToCart}
            className='bg-lime-500 hover:bg-lime-600 text-white p-2 rounded-full cursor-pointer transition shadow-sm hover:scale-105 active:scale-95'
            title='Add to Cart'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4.5v15m7.5-7.5h-15'
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
