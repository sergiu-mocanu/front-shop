import type { CartLine } from '@/types/ecommerce'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

export interface Order {
  id: string
  customerEmail: string
  items: CartLine[]
  total: number
  status: OrderStatus
  createdAt: Date
  paymentRef?: string
  carrier?: string
  cancellationReason?: string
}

export type OrderEvent =
  | { type: 'place' }
  | { type: 'pay'; paymentRef: string }
  | { type: 'ship'; carrier: string }
  | { type: 'cancel'; reason: string }

export type OrderSummary = Pick<Order, 'id' | 'customerEmail' | 'total'>
export type UpdateOrderInput = Partial<Omit<Order, 'id' | 'createdAt'>>
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

export function applyEvent(order: Order, event: OrderEvent): Order {
  switch (event.type) {
    case 'place':
      return { ...order, status: 'pending' }
    case 'pay':
      return { ...order, status: 'paid', paymentRef: event.paymentRef }
    case 'ship':
      return { ...order, status: 'shipped', carrier: event.carrier }
    case 'cancel':
      return { ...order, status: 'cancelled', cancellationReason: event.reason }
    default: {
      const _exhaustive: never = event
      return _exhaustive
    }
  }
}

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key])
}
