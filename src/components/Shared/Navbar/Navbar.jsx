import Container from '../Container'
import { AiOutlineMenu, AiOutlineShoppingCart } from 'react-icons/ai'
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi'
import { useState, useContext, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import useCart from '../../../hooks/useCart'
import avatarImg from '../../../assets/images/placeholder.jpg'
import logo from '../../../assets/images/logo-flat.png'
import { ThemeContext } from '../../../providers/ThemeProvider'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const { cart } = useCart()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='fixed w-full bg-base-100 z-50 shadow-sm transition-colors duration-300'>
      <div className='py-4 border-b-[1px] border-base-200'>
        <Container>
          <div className='flex flex-row  items-center justify-between gap-3 md:gap-0'>
            {/* Logo */}
            <Link to='/'>
              <img src={logo} alt='logo' width='100' height='100' />
            </Link>

            {/* Center Menu Links (Desktop) */}
            <div className='hidden md:flex flex-row items-center gap-6'>
              <NavLink end to='/' className={({ isActive }) => `font-semibold text-sm transition hover:text-lime-500 ${isActive ? 'text-lime-500' : 'text-gray-700 dark:text-gray-300'}`}>
                Home
              </NavLink>
              <NavLink to='/shop' className={({ isActive }) => `font-semibold text-sm transition hover:text-lime-500 ${isActive ? 'text-lime-500' : 'text-gray-700 dark:text-gray-300'}`}>
                Shop
              </NavLink>
              <NavLink to='/about' className={({ isActive }) => `font-semibold text-sm transition hover:text-lime-500 ${isActive ? 'text-lime-500' : 'text-gray-700 dark:text-gray-300'}`}>
                About Us
              </NavLink>
              <NavLink to='/contact' className={({ isActive }) => `font-semibold text-sm transition hover:text-lime-500 ${isActive ? 'text-lime-500' : 'text-gray-700 dark:text-gray-300'}`}>
                Contact Us
              </NavLink>
            </div>

            {/* Dropdown Menu */}
            <div ref={dropdownRef} className='relative flex items-center gap-4'>
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
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '3.5rem',
                    width: '220px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(74,222,128,0.1)',
                    border: '1px solid rgba(74,222,128,0.2)',
                    zIndex: 999,
                    overflow: 'hidden',
                    animation: 'dropdownFadeIn 0.2s ease',
                  }}
                >
                  <style>{`
                    @keyframes dropdownFadeIn {
                      from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                      to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .dd-item {
                      display: flex;
                      align-items: center;
                      gap: 10px;
                      padding: 11px 18px;
                      font-size: 14px;
                      font-weight: 600;
                      color: #1f2937;
                      text-decoration: none;
                      transition: background 0.18s, color 0.18s, padding-left 0.18s;
                      cursor: pointer;
                      border: none;
                      background: none;
                      width: 100%;
                    }
                    .dd-item:hover {
                      background: linear-gradient(90deg, rgba(74,222,128,0.12), rgba(34,197,94,0.07));
                      color: #16a34a;
                      padding-left: 22px;
                    }
                    .dd-icon {
                      width: 30px;
                      height: 30px;
                      border-radius: 8px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 14px;
                      flex-shrink: 0;
                    }
                    .dd-divider {
                      height: 1px;
                      background: linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent);
                      margin: 4px 12px;
                    }
                    .dd-logout {
                      display: flex;
                      align-items: center;
                      gap: 10px;
                      padding: 11px 18px;
                      font-size: 14px;
                      font-weight: 600;
                      color: #dc2626;
                      cursor: pointer;
                      transition: background 0.18s, padding-left 0.18s;
                    }
                    .dd-logout:hover {
                      background: rgba(220,38,38,0.08);
                      padding-left: 22px;
                    }
                    .dd-logout-icon {
                      width: 30px;
                      height: 30px;
                      border-radius: 8px;
                      background: rgba(220,38,38,0.1);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 14px;
                    }
                  `}</style>

                  {/* User Info Header */}
                  {user && (
                    <Link 
                      to='/dashboard/profile' 
                      onClick={() => setIsOpen(false)} 
                      style={{ display: 'block', padding: '14px 18px 10px', borderBottom: '1px solid rgba(74,222,128,0.15)', textDecoration: 'none' }}
                      className="hover:bg-lime-50/30 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={user.photoURL || avatarImg}
                          alt='profile'
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4ade80' }}
                          referrerPolicy='no-referrer'
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <p 
                            className="text-gray-900 dark:text-white"
                            style={{ fontSize: '13px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}
                          >
                            {user.displayName || 'User'}
                          </p>
                          <p 
                            className="text-gray-500 dark:text-gray-400"
                            style={{ fontSize: '11px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}
                          >
                            {user.email || user?.providerData?.[0]?.email}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}

                  <div style={{ padding: '6px 0' }}>
                    {/* Mobile-only nav links */}
                    <div className='md:hidden'>
                      <Link to='/' onClick={() => setIsOpen(false)} className='dd-item'>
                        Home
                      </Link>
                      <Link to='/shop' onClick={() => setIsOpen(false)} className='dd-item'>
                        Shop
                      </Link>
                      <Link to='/about' onClick={() => setIsOpen(false)} className='dd-item'>
                        About Us
                      </Link>
                      <Link to='/contact' onClick={() => setIsOpen(false)} className='dd-item'>
                        Contact Us
                      </Link>
                      <div className='dd-divider' />
                    </div>

                    {user ? (
                      <>
                        <Link to='/dashboard' onClick={() => setIsOpen(false)} className='dd-item'>
                          <span className='dd-icon' style={{ background: 'linear-gradient(135deg,#d1fae5,#6ee7b7)' }}>📊</span>
                          Dashboard
                        </Link>
                        <div className='dd-divider' />
                        <div
                          className='dd-logout'
                          onClick={() => { logOut(); setIsOpen(false); }}
                        >
                          <span className='dd-logout-icon'><FiLogOut style={{ color: '#dc2626', fontSize: '15px' }} /></span>
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to='/login' onClick={() => setIsOpen(false)} className='dd-item'>
                          <span className='dd-icon' style={{ background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)' }}>🔑</span>
                          Login
                        </Link>
                        <Link to='/signup' onClick={() => setIsOpen(false)} className='dd-item'>
                          <span className='dd-icon' style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' }}>✨</span>
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
