import { useAuth } from '@/features/auth/AuthContext'
import { logout } from '@/features/auth/logout'
import OrderList from '@/features/orders/OrderList'
import { useMyOrders } from '@/features/orders/queries'

// Protected by ProtectedRoute in App, so a session exists here.
function AccountPage() {
  const { session } = useAuth()
  const orders = useMyOrders()

  return (
    <main className="orders-page">
      <section className="orders-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> Votre espace</p>
        <h1>Bonjour<em>.</em></h1>
        <p>Vous êtes connecté avec {session?.user.email}.</p>
        <button className="add-button account-logout" type="button" onClick={logout}>
          Se déconnecter
        </button>
      </section>
      <section className="orders-content" aria-labelledby="my-orders-title">
        <h2 className="account-orders-title" id="my-orders-title">Mes commandes</h2>
        {orders.status === 'pending' ? (
          <p className="fetch-message" role="status">Chargement des commandes…</p>
        ) : orders.status === 'error' ? (
          <p className="fetch-message error-message" role="alert">{orders.error.message}</p>
        ) : (
          <OrderList orders={orders.data} />
        )}
      </section>
    </main>
  )
}

export default AccountPage
