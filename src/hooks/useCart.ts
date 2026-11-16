import { useCallback, useState } from 'react'
import { applyAction, type Cart, type CartAction } from '@/types/ecommerce'

export function useCart() {
  const [cart, setCart] = useState<Cart>({})

  // Stable callbacks (same identity on every render): components that receive them, like the
  // memoized ProductList, can skip re-rendering when the cart changes. setCart's updater form
  // reads the current cart, so the callbacks never need `cart` as a dependency.
  const dispatch = useCallback((action: CartAction) => {
    setCart((currentCart) => applyAction(currentCart, action))
  }, [])
  const addToCart = useCallback(
    (productId: string) => dispatch({ type: 'addToCart', productId, quantity: 1 }),
    [dispatch],
  )
  const removeFromCart = useCallback(
    (productId: string) => dispatch({ type: 'removeFromCart', productId }),
    [dispatch],
  )
  const clearCart = useCallback(() => dispatch({ type: 'clearCart' }), [dispatch])

  const itemCount = Object.values(cart).reduce((total, line) => total + line.quantity, 0)

  return { cart, itemCount, addToCart, removeFromCart, clearCart }
}
