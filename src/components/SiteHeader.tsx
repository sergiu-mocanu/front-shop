import { Link } from 'react-router-dom'

type SiteHeaderProps = {
  activePage: 'home' | 'products' | 'orders' | null
  cartCount: number
}

function SiteHeader({ activePage, cartCount }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <Link className="wordmark" to="/">
        <span className="wordmark-mark" aria-hidden="true">m.</span>
        maison moderne
      </Link>
      <nav className="main-nav" aria-label="Navigation principale">
        <Link className={`nav-link${activePage === 'home' ? ' is-active' : ''}`} to="/">
          Accueil
        </Link>
        <Link className={`nav-link${activePage === 'products' ? ' is-active' : ''}`} to="/products">
          Boutique
        </Link>
        <Link className={`nav-link${activePage === 'orders' ? ' is-active' : ''}`} to="/orders">
          Commandes
        </Link>
      </nav>
      <Link
        className="cart-button"
        to={activePage === 'home' || activePage === 'products' ? '#basket' : '/#basket'}
        aria-label={`Voir le panier, ${cartCount} article(s)`}
      >
        <span>Panier</span>
        <span className="cart-count">{cartCount}</span>
      </Link>
    </header>
  )
}

export default SiteHeader
