import { Link } from 'react-router'
import bannerImg from '../../assets/images/banner_bg.jpg'

const Banner = () => {
  return (
    <div
      className='w-full bg-center bg-cover h-[38rem]'
      style={{
        backgroundImage: `url(${bannerImg})`,
      }}
    >
      <div className='flex items-center justify-center w-full h-full bg-gray-900/40'>
        <div className='text-center'>
          <h1 className='text-3xl font-semibold text-white lg:text-4xl'>
            Build your <span className='text-lime-400'>Green Core</span>
          </h1>
          <br />
          <button className='w-full px-5 py-2 mt-4 text-sm font-medium text-white capitalize transition-colors duration-300 transform bg-lime-600 rounded-md lg:w-auto hover:bg-lime-500 focus:outline-none focus:bg-lime-500'>
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner
