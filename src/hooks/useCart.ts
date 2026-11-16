import { useState } from 'react'
import { applyAction, type Cart, type CartAction } from '@/types/ecommerce'

export function useCart() {
  const [cart, setCart] = useState<Cart>({})

  function dispatch(action: CartAction) {
    setCart((currentCart) => applyAction(currentCart, action))
  }

  const itemCount = Object.values(cart).reduce((total, line) => total + line.quantity, 0)

  return {
    cart,
    itemCount,
    addToCart: (productId: string) => dispatch({ type: 'addToCart', productId, quantity: 1 }),
    removeFromCart: (productId: string) => dispatch({ type: 'removeFromCart', productId }),
    clearCart: () => dispatch({ type: 'clearCart' }),
  }
}
