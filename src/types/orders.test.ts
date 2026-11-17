import { describe, expect, it } from 'vitest'
import { orderTotal, type OrderItem, type OrderWithItems } from './orders'

// An order with the given lines; the other fields don't affect the total.
function makeOrder(order_items: OrderItem[]): OrderWithItems {
  return { id: 'o1', user_id: 'u1', status: 'paid', created_at: '2026-11-17T10:00:00Z', order_items }
}

describe('orderTotal', () => {
  it('adds up quantity × the unit price paid, line by line', () => {
    const order = makeOrder([
      { quantity: 2, unit_price: 129, products: { name: 'Lampe Aria' } },
      { quantity: 1, unit_price: 42, products: { name: 'Carafe Rosée' } },
    ])
    expect(orderTotal(order)).toBe(300)
  })

  it('still counts a line whose product can no longer be read', () => {
    // The price paid is frozen on the line: a deleted or hidden product doesn't change the total.
    const order = makeOrder([{ quantity: 3, unit_price: 10, products: null }])
    expect(orderTotal(order)).toBe(30)
  })

  it('returns 0 for an order without lines', () => {
    expect(orderTotal(makeOrder([]))).toBe(0)
  })
})
