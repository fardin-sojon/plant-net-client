import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router'
import logo from '../../../assets/images/logo-flat.png'
import toast from 'react-hot-toast'

const Footer = () => {
  return (
    <footer className='bg-base-200 text-base-content py-12'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Column 1: Logo & About */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <img className='w-auto h-8' src={logo} alt='PlantNet Logo' />
            </div>
            <p className='text-sm leading-relaxed'>
              Your one-stop shop for the best indoor and outdoor plants. 
              Bringing nature closer to your home.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/' className='hover:text-lime-500 transition-colors'>Home</Link>
              </li>
              <li>
                <Link to='/shop' className='hover:text-lime-500 transition-colors'>Shop</Link>
              </li>
              <li>
                <Link to='/about' className='hover:text-lime-500 transition-colors'>About Us</Link>
              </li>
              <li>
                <Link to='/contact' className='hover:text-lime-500 transition-colors'>Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Support</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='hover:text-lime-500 transition-colors'>FAQs</a>
              </li>
              <li>
                <a href='#' className='hover:text-lime-500 transition-colors'>Privacy Policy</a>
              </li>
              <li>
                <a href='#' className='hover:text-lime-500 transition-colors'>Terms of Service</a>
              </li>
              <li>
                <a href='#' className='hover:text-lime-500 transition-colors'>Return Policy</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us & Newsletter */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Follow Us</h3>
            <div className='flex gap-4 mb-6'>
              <a href='#' className='hover:text-lime-500 transition-colors text-xl'>
                <FaFacebook />
              </a>
              <a href='#' className='hover:text-lime-500 transition-colors text-xl'>
                <FaTwitter />
              </a>
              <a href='#' className='hover:text-lime-500 transition-colors text-xl'>
                <FaInstagram />
              </a>
              <a href='#' className='hover:text-lime-500 transition-colors text-xl'>
                <FaLinkedin />
              </a>
            </div>

            <h3 className='text-lg font-semibold mb-3'>Newsletter</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                toast.success('Successfully Subscribed to Newsletter!')
                e.target.reset()
              }}
              className='flex flex-col gap-3 max-w-xs'
            >
              <input
                type='email'
                placeholder='Your email address'
                className='px-4 py-2 bg-base-100 text-base-content border border-base-300 rounded focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500'
                required
              />
              <button
                type='submit'
                className='px-4 py-2 bg-lime-600 text-white font-semibold rounded hover:bg-lime-500 transition-colors'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className='my-8 border-base-content/20' />

        <div className='text-center text-sm opacity-70'>
          © {new Date().getFullYear()} PlantNet. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
