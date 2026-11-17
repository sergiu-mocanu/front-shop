import { describe, expect, it } from 'vitest'
import { computeCartTotal } from './cart'
import { makeProduct as product } from '@/test/factories'
import { applyAction, type Cart, type CartLine } from '@/types/ecommerce'

describe('computeCartTotal', () => {
  const catalogue = [product({ id: '1', price: 10 }), product({ id: '2', price: 5 })]

  it('adds up each line as price × quantity', () => {
    // Arrange: a cart written by hand
    const lines: CartLine[] = [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 1 },
    ]
    // Act
    const total = computeCartTotal(lines, catalogue)
    // Assert
    expect(total).toBe(25)
  })

  it('returns 0 for an empty cart', () => {
    expect(computeCartTotal([], catalogue)).toBe(0)
  })

  it('counts 0 for a product missing from the catalogue', () => {
    const lines: CartLine[] = [
      { productId: '1', quantity: 1 },
      { productId: 'deleted', quantity: 3 },
    ]
    expect(computeCartTotal(lines, catalogue)).toBe(10)
  })
})

describe('applyAction (the cart reducer)', () => {
  it('adds to the existing line when the product is already in the cart', () => {
    const cart: Cart = { '1': { productId: '1', quantity: 2 } }
    const next = applyAction(cart, { type: 'addToCart', productId: '1', quantity: 1 })
    expect(Object.keys(next)).toHaveLength(1) // still one line, not a duplicate
    expect(next['1']?.quantity).toBe(3)
  })

  it('ignores an add with quantity 0', () => {
    const next = applyAction({}, { type: 'addToCart', productId: '1', quantity: 0 })
    expect(next).toEqual({}) // no empty "Quantité : 0" line
  })
})
