import CartPanel from '@/components/CartPanel'
import ProductList from '@/features/products/ProductList'
import type { Cart, FetchResult, Product } from '@/types/ecommerce'

type ProductsPageProps = {
  cart: Cart
  products: Product[]
  productsResult: FetchResult<Product[]>
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onClearCart: () => void
}

function ProductsPage({
  cart,
  products,
  productsResult,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
}: ProductsPageProps) {
  return (
    <main className="products-page">
      <section className="intro-band products-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> La sélection du studio</p>
          <h1>Nos <em>essentiels.</em></h1>
          <p className="intro-description">Des objets utiles, choisis pour durer et accompagner le quotidien.</p>
        </div>
      </section>
      <div className="shop-layout">
        <section className="catalog-section" aria-labelledby="products-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">La boutique</p>
              <h2 id="products-title">Tous les produits</h2>
            </div>
          </div>
          <ProductList result={productsResult} onAddToCart={onAddToCart} />
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

export default ProductsPage
