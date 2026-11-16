export interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
  category?: string
  description?: string
  image?: string
  badge?: string
}

export type CartLine = { productId: string; quantity: number }

export function describe(line: CartLine | null): string {
  if (line === null) {
    return 'Panier vide'
  }
  return `${line.quantity} article(s)`
}

export type CartAction =
  | { type: 'addToCart'; productId: string; quantity: number }
  | { type: 'removeFromCart'; productId: string }
  | { type: 'clearCart' }
  | { type: 'applyDiscount'; percent: number }

export type Cart = Record<string, CartLine>

export function applyAction(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'addToCart': {
      const existing = cart[action.productId]
      return {
        ...cart,
        [action.productId]: {
          productId: action.productId,
          quantity: (existing?.quantity ?? 0) + action.quantity,
        },
      }
    }
    case 'removeFromCart': {
      const nextCart = { ...cart }
      delete nextCart[action.productId]
      return nextCart
    }
    case 'clearCart': {
      return {}
    }
    case 'applyDiscount': {
      return cart
    }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

export function firstItem<T>(items: T[]): T | undefined {
  return items[0]
}

// Use this type for the compact product cards in the catalogue.
export type ProductPreview = Pick<Product, 'id' | 'name' | 'price'>

// Use this type for the product creation form.
export type CreateProductInput = Omit<Product, 'id'>

// Use this type for the product editing form.
export type UpdateProductInput = Partial<CreateProductInput>

// Use this type for the cart, indexed by product ID.
export type FetchResult<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }