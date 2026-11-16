import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { selectItemCount, useCart } from '@/features/cart/store'
import { logout } from '@/features/auth/logout'

type SiteHeaderProps = {
  activePage: 'home' | 'products' | 'account' | null
}

function SiteHeader({ activePage }: SiteHeaderProps) {
  const { session, booted } = useAuth()
  const cartCount = useCart(selectItemCount)

  return (
    <header className="topbar">
      <Link className="wordmark" to="/">
        <span className="wordmark-mark" aria-hidden="true">m.</span>
        <span className="wordmark-text">maison moderne</span>
      </Link>
      <nav className="main-nav" aria-label="Navigation principale">
        <Link className={`nav-link${activePage === 'home' ? ' is-active' : ''}`} to="/">
          Accueil
        </Link>
        <Link className={`nav-link${activePage === 'products' ? ' is-active' : ''}`} to="/products">
          Boutique
        </Link>
      </nav>
      <div className="topbar-actions">
        {/* Until the first session read, the user is unknown: show neither "Compte" nor
            "Connexion", or a logged-in user would see "Connexion" flash on every reload. The cart
            is the last item of a right-aligned row, so it doesn't move when the link appears. */}
        {!booted ? null : session ? (
          <>
            {/* The email on desktop; "Compte" on phones, where the email doesn't fit (CSS). */}
            <Link
              className={`account-link${activePage === 'account' ? ' is-active' : ''}`}
              to="/account"
              title={session.user.email}
            >
              <span className="account-email">{session.user.email}</span>
              <span className="account-short">Compte</span>
            </Link>
            {/* Hidden on phones, where it doesn't fit: the account page has its own button. */}
            <button className="account-link logout-button" type="button" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link className="account-link" to="/login">Connexion</Link>
        )}
        <Link
          className="cart-button"
          to={activePage === 'home' || activePage === 'products' ? '#basket' : '/#basket'}
        >
          {/* Accessible name "Panier 3 article(s)" starts with the visible text, for voice control. */}
          <span>Panier</span>{' '}
          <span className="cart-count">{cartCount}</span>
          <span className="visually-hidden"> article(s)</span>
        </Link>
      </div>
    </header>
  )
}

export default SiteHeader
