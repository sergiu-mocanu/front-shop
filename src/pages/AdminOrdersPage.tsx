import DataTable, { type Column } from '@/components/DataTable'
import AdminHeader from '@/features/admin/AdminHeader'
import { useAllOrders } from '@/features/orders/queries'
import { labelStatus, orderTotal, type AdminOrder } from '@/types/orders'

// Same DataTable as the catalogue, other columns. The data: every order, because the policy
// "admin reads orders" lets this user read them all.
const columns: Column<AdminOrder>[] = [
  { header: 'Commande', cell: (order) => order.id.slice(0, 8) },
  { header: 'Client', cell: (order) => order.profiles?.email ?? 'Compte supprimé' },
  {
    header: 'Articles',
    cell: (order) =>
      order.order_items.map((item) => `${item.quantity} × ${item.products?.name ?? 'Produit retiré'}`).join(', '),
  },
  { header: 'Date', cell: (order) => new Date(order.created_at).toLocaleDateString('fr-FR') },
  { header: 'Total', cell: (order) => `${orderTotal(order)} €`, className: 'is-numeric' },
  {
    header: 'Statut',
    cell: (order) => <span className={`order-status status-${order.status}`}>{labelStatus(order.status)}</span>,
  },
]

function AdminOrdersPage() {
  const orders = useAllOrders()

  return (
    <main className="orders-page">
      <AdminHeader title="Commandes" />
      <section className="orders-content">
        {orders.status === 'pending' ? (
          <p className="fetch-message" role="status">Chargement des commandes…</p>
        ) : orders.status === 'error' ? (
          <p className="fetch-message error-message" role="alert">{orders.error.message}</p>
        ) : (
          <DataTable
            caption="Toutes les commandes"
            columns={columns}
            rows={orders.data}
            rowKey={(order) => order.id}
            empty="Aucune commande pour le moment."
          />
        )}
      </section>
    </main>
  )
}

export default AdminOrdersPage
