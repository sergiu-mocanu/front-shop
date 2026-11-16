import { Link } from 'react-router-dom'
import CartPanel from '@/components/CartPanel'
import ProductList from '@/features/products/ProductList'
import type { Cart, FetchResult, Product } from '@/types/ecommerce'

type HomePageProps = {
  cart: Cart
  products: Product[]
  productsResult: FetchResult<Product[]>
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onClearCart: () => void
}

function HomePage({
  cart,
  products,
  productsResult,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
}: HomePageProps) {
  return (
    <main id="home">
      <section className="intro-band">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Objets choisis, vie quotidienne</p>
          <h1>Le beau, <em>pour longtemps.</em></h1>
          <p className="intro-description">
            Une sélection de pièces utiles et bien pensées, fabriquées pour trouver leur place chez vous.
          </p>
          <Link className="add-button hero-button" to="/products">
            Découvrir la collection <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="intro-note">
          <span className="note-index">01 / 03</span>
          <span>La collection<br />du quotidien</span>
          <span className="note-arrow" aria-hidden="true">↘</span>
        </div>
      </section>

      <div className="shop-layout">
        <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Nos essentiels</p>
              <h2 id="catalog-title">À découvrir</h2>
            </div>
            <Link className="sort-label" to="/products">Toute la collection <span aria-hidden="true">↗</span></Link>
          </div>
          <ProductList result={productsResult} onAddToCart={onAddToCart} maxItems={4} />
        </section>
        <CartPanel
          cart={cart}
          products={products}
          onRemove={onRemoveFromCart}
          onClear={onClearCart}
        />
      </div>
    </main>
  )
}

export default HomePage
