import Container from '../Container'
import { AiOutlineMenu, AiOutlineShoppingCart } from 'react-icons/ai'
import { useState, useContext } from 'react'
import { Link } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import useCart from '../../../hooks/useCart'
import avatarImg from '../../../assets/images/placeholder.jpg'
import logo from '../../../assets/images/logo-flat.png'
import { ThemeContext } from '../../../providers/ThemeProvider'
import { FiSun, FiMoon } from 'react-icons/fi'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const { cart } = useCart()
  const { theme, toggleTheme } = useContext(ThemeContext)
  // console.log(user);
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='fixed w-full bg-base-100 z-10 shadow-sm transition-colors duration-300'>
      <div className='py-4 border-b-[1px] border-base-200'>
        <Container>
          <div className='flex flex-row  items-center justify-between gap-3 md:gap-0'>
            {/* Logo */}
            <Link to='/'>
              <img src={logo} alt='logo' width='100' height='100' />
            </Link>
            {/* Dropdown Menu */}
            <div className='relative flex items-center gap-4'>
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className='text-2xl hover:text-lime-500 transition'>
                {theme === 'light' ? <FiMoon /> : <FiSun />}
              </button>

              <Link to='/cart' className='bg-green-100 dark:bg-green-900 p-2 rounded-full relative hover:bg-green-200 dark:hover:bg-green-800 transition'>
                <AiOutlineShoppingCart className='text-xl dark:text-white' />
                {cart.length > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {cart.length}
                  </span>
                )}
              </Link>

              <div className='flex flex-row items-center gap-3'>
                {/* Dropdown btn */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className='p-4 md:py-1 md:px-2 border border-base-300 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
                >
                  <AiOutlineMenu />
                  <div className='hidden md:block'>
                    {/* Avatar */}
                    <img
                      className='rounded-full object-cover w-8 h-8'
                      referrerPolicy='no-referrer'
                      src={user && user.photoURL ? user.photoURL : avatarImg}
                      alt='profile'
                    />
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white dark:bg-gray-900 overflow-hidden right-0 top-12 text-sm z-50'>
                  <div className='flex flex-col cursor-pointer'>
                    <Link
                      to='/'
                      className='block md:hidden px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-800 transition font-semibold'
                    >
                      Home
                    </Link>

                    {user ? (
                      <>
                        <Link
                          to='/dashboard'
                          className='px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-800 transition font-semibold'
                        >
                          Dashboard
                        </Link>
                        <div
                          onClick={logOut}
                          className='px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-800 transition font-semibold cursor-pointer'
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to='/login'
                          className='px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-800 transition font-semibold'
                        >
                          Login
                        </Link>
                        <Link
                          to='/signup'
                          className='px-4 py-3 hover:bg-neutral-100 dark:hover:bg-gray-800 transition font-semibold'
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar
