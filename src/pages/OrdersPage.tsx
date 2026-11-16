import OrderList from '@/features/orders/OrderList'

function OrdersPage() {
  return (
    <main className="orders-page">
      <section className="orders-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> Votre espace</p>
        <h1>Les <em>commandes.</em></h1>
        <p>Suivez les commandes et leur statut.</p>
      </section>
      <OrderList />
    </main>
  )
}

export default OrdersPage
