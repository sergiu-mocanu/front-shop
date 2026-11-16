import { useAuth } from '@/features/auth/AuthContext'
import { logout } from '@/features/auth/logout'

// Protected by ProtectedRoute in App, so a session exists here. Milestone 3 adds "my orders".
function AccountPage() {
  const { session } = useAuth()

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
    </main>
  )
}

export default AccountPage
