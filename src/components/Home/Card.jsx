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
    addToCart(plant)
    toast.success('Added to Cart!')
  }

  return (
    <Link
      to={`/plant/${_id}`}
      className='col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl relative'
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
        <div className='font-semibold text-lg text-gray-800 dark:text-white'>Category: {category}</div>
        <div className='font-semibold text-lg text-gray-800 dark:text-white'>Quantity: {quantity}</div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-semibold text-gray-800 dark:text-white'> Price: {price}$</div>
        </div>
      </div>
      <div
        onClick={handleAddToCart}
        className='absolute top-3 right-3 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-100 transition text-gray-900'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </div>
    </Link>
  )
}

export default Card
