import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyAction, type Cart } from '@/types/ecommerce'

type CartState = {
  cart: Cart
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

// The cart, in a store any component can read without props passing through the app. Components
// read it with a selector, e.g. useCart((state) => state.cart): each one re-renders only when the
// slice it selects changes. The actions never change, so selecting one never causes a re-render.
// The transitions are the session-1 reducer, applyAction.
export const useCart = create<CartState>()(
  // persist: the cart is saved in localStorage, so it survives a reload or a detour via /login.
  persist(
    (set) => ({
      cart: {},
      addToCart: (productId) =>
        set((state) => ({ cart: applyAction(state.cart, { type: 'addToCart', productId, quantity: 1 }) })),
      removeFromCart: (productId) =>
        set((state) => ({ cart: applyAction(state.cart, { type: 'removeFromCart', productId }) })),
      clearCart: () => set((state) => ({ cart: applyAction(state.cart, { type: 'clearCart' }) })),
    }),
    // version: bump it if the Cart shape changes, so a cart saved in the old shape is dropped
    // instead of breaking the app.
    { name: 'my-shop-cart', version: 1 },
  ),
)

// A derived value, computed from the cart inside the selector: the header re-renders only when
// the count changes.
export const selectItemCount = (state: CartState) =>
  Object.values(state.cart).reduce((total, line) => total + line.quantity, 0)
