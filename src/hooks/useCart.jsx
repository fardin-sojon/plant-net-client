import { useContext } from 'react'
import { CartContext } from '../providers/CartProvider'

const useCart = () => {
  const context = useContext(CartContext)
  return context
}

export default useCart
