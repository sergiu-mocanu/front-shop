import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Order, OrdersByStatus, OrderStatus } from '@/types/orders'
import { labelStatus } from '@/types/orders'

const orderStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled']

function OrderList() {
  // No user filter here: RLS decides which rows come back. Until a read policy exists on `orders`
  // (milestone 3), the answer is "none", even though the request succeeds.
  const result = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select()
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return data as Order[]
    },
  })
  let content: ReactNode

  switch (result.status) {
    case 'pending':
      content = <p className="fetch-message" role="status">Chargement des commandes…</p>
      break
    case 'error':
      content = <p className="fetch-message error-message" role="alert">{result.error.message}</p>
      break
    case 'success': {
      const ordersByStatus: OrdersByStatus = {
        pending: [],
        paid: [],
        shipped: [],
        cancelled: [],
      }

      for (const order of result.data) {
        ordersByStatus[order.status].push(order)
      }

      content = (
        <>
          <div className="order-summary-strip" aria-label="Résumé des commandes">
            {orderStatuses.map((status) => (
              <div className="summary-cell" key={status}>
                <span>{labelStatus(status)}</span>
                <strong>{ordersByStatus[status].length}</strong>
              </div>
            ))}
          </div>
          {result.data.length === 0 ? (
            <p className="fetch-message">Aucune commande pour le moment.</p>
          ) : (
            <div className="order-list">
              {result.data.map((order) => (
                <article className="order-row" key={order.id}>
                  {/* A uuid is long: its first 8 characters are enough to tell orders apart. */}
                  <div><span>Commande</span><strong>{order.id.slice(0, 8)}</strong></div>
                  <div><span>Date</span><strong>{new Date(order.created_at).toLocaleDateString('fr-FR')}</strong></div>
                  <span className={`order-status status-${order.status}`}>{labelStatus(order.status)}</span>
                </article>
              ))}
            </div>
          )}
        </>
      )
      break
    }
    default: {
      const _exhaustive: never = result
      content = _exhaustive
    }
  }

  return <div className="orders-content">{content}</div>
}

export default OrderList
