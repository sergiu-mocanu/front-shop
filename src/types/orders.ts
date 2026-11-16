export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

// Mirrors a row of the `orders` table (supabase/01-schema.sql). The products of an order are rows
// of `order_items`, read with a nested select from milestone 3.
export interface Order {
  id: string
  user_id: string | null
  status: OrderStatus
  created_at: string // timestamptz arrives as an ISO 8601 string
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
