export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

// Mirrors a row of the `orders` table (supabase/01-schema.sql). Its products are rows of
// `order_items` (see OrderWithItems).
export interface Order {
  id: string
  user_id: string | null
  status: OrderStatus
  created_at: string // timestamptz arrives as an ISO 8601 string
}

// An order with its lines, as returned by the nested select
// `order_items(quantity, unit_price, products(name))`.
export interface OrderItem {
  quantity: number
  unit_price: number // the price paid, frozen at order time
  products: { name: string } | null // null if the product row can't be read
}

export type OrderWithItems = Order & { order_items: OrderItem[] }

export function orderTotal(order: OrderWithItems): number {
  return order.order_items.reduce((total, item) => total + item.quantity * item.unit_price, 0)
}
export type UpdateOrderInput = Partial<Omit<Order, 'id' | 'created_at'>>
export type OrdersByStatus = Record<OrderStatus, Order[]>

export const carriers = {
  colissimo: 'Colissimo',
  chrono: 'Chronopost',
} satisfies Record<string, string>

export function labelStatus(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'paid':
      return 'Payée'
    case 'shipped':
      return 'Expédiée'
    case 'cancelled':
      return 'Annulée'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key])
}
