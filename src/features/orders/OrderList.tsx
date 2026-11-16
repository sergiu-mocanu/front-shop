import type { ReactNode } from 'react'
import { useFetch } from '@/hooks/useFetch'
import type { Order, OrdersByStatus, OrderStatus, OrderSummary } from '@/types/orders'
import { labelStatus, pluck } from '@/types/orders'

const orderStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled']

function OrderList() {
  const result = useFetch<Order[]>('/data/orders.json')
  let content: ReactNode

  switch (result.status) {
    case 'idle':
    case 'loading':
      content = <p className="fetch-message" role="status">Chargement des commandes…</p>
      break
    case 'error':
      content = <p className="fetch-message error-message" role="alert">{result.message}</p>
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

      const totalRevenue = pluck(result.data, 'total').reduce((total, amount) => total + amount, 0)

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
          <p className="orders-total">Montant total des commandes : <strong>{totalRevenue} €</strong></p>
          {result.data.length === 0 ? (
            <p className="fetch-message">Aucune commande pour le moment.</p>
          ) : (
            <div className="order-list">
              {result.data.map((order) => {
                const summary: OrderSummary = {
                  id: order.id,
                  customerEmail: order.customerEmail,
                  total: order.total,
                }

                return (
                  <article className="order-row" key={summary.id}>
                    <div><span>Commande</span><strong>{summary.id}</strong></div>
                    <div><span>Client</span><strong>{summary.customerEmail}</strong></div>
                    <div><span>Date</span><strong>{new Date(String(order.createdAt)).toLocaleDateString('fr-FR')}</strong></div>
                    <div><span>Total</span><strong>{summary.total} €</strong></div>
                    <span className={`order-status status-${order.status}`}>{labelStatus(order.status)}</span>
                  </article>
                )
              })}
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
