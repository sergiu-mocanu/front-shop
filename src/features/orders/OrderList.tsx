import { labelStatus, orderTotal, type OrderWithItems } from '@/types/orders'

type OrderListProps = {
  orders: OrderWithItems[]
}

// Displays orders; fetching is the caller's job, so the same list serves "my orders" (/account)
// and, in milestone 4, the admin's list of all orders.
function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="fetch-message">Aucune commande pour le moment.</p>
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <article className="order-row" key={order.id}>
          {/* A uuid is long: its first 8 characters are enough to tell orders apart. */}
          <div><span>Commande</span><strong>{order.id.slice(0, 8)}</strong></div>
          <div>
            <span>Articles</span>
            <strong>
              {order.order_items
                .map((item) => `${item.quantity} × ${item.products?.name ?? 'Produit retiré'}`)
                .join(', ')}
            </strong>
          </div>
          <div><span>Date</span><strong>{new Date(order.created_at).toLocaleDateString('fr-FR')}</strong></div>
          <div><span>Total</span><strong>{orderTotal(order)} €</strong></div>
          <span className={`order-status status-${order.status}`}>{labelStatus(order.status)}</span>
        </article>
      ))}
    </div>
  )
}

export default OrderList
