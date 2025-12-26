import { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const CartContext = createContext(null)

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('plantNet-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('plantNet-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (plant) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === plant._id)
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === plant._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...plant, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const cartInfo = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  }

  return (
    <CartContext.Provider value={cartInfo}>{children}</CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.node,
}

export default CartProvider
