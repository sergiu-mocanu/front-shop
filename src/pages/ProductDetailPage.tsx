import { Link, useNavigate, useParams } from 'react-router-dom'
import CartPanel from '@/components/CartPanel'
import type { Cart, FetchResult, Product } from '@/types/ecommerce'

type ProductDetailPageProps = {
  cart: Cart
  products: Product[]
  productsResult: FetchResult<Product[]>
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onClearCart: () => void
}

function ProductDetailPage({
  cart,
  products,
  productsResult,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
}: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = id && productsResult.status === 'success'
    ? productsResult.data.find((item) => item.id === id)
    : undefined

  return (
    <main className="products-page">
      <section className="intro-band products-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> La sélection du studio</p>
          <h1>{product ? <>{product.name}<em>.</em></> : <>Fiche <em>produit.</em></>}</h1>
          <button
            className="add-button detail-back-button"
            type="button"
            onClick={() => navigate('/products')}
          >
            ← Retour à la boutique
          </button>
        </div>
      </section>
      <div className="shop-layout">
        <section className="catalog-section" aria-live="polite">
          {productsResult.status === 'idle' || productsResult.status === 'loading' ? (
            <p className="fetch-message" role="status">Chargement du produit…</p>
          ) : productsResult.status === 'error' ? (
            <p className="fetch-message error-message" role="alert">{productsResult.message}</p>
          ) : !id || !product ? (
            <div className="fetch-message">
              <p>{!id ? 'Identifiant de produit manquant.' : `Aucun produit avec l’identifiant « ${id} ».`}</p>
              <Link className="add-button" to="/products">Retour aux produits</Link>
            </div>
          ) : (
            <article className="product-detail-card">
              <div className="product-image-wrap">
                {product.image && <img className="product-image" src={product.image} alt={product.name} />}
                {product.badge && <span className="product-badge">{product.badge}</span>}
                {product.category && <span className="product-category">{product.category}</span>}
              </div>
              <div className="product-details">
                <div className="product-title-row">
                  <h2>{product.name}</h2>
                  <span className="product-price">{product.price} €</span>
                </div>
                {product.description && <p>{product.description}</p>}
                <div className="product-actions">
                  <span className={product.inStock ? 'stock-status' : 'stock-status is-out'}>
                    <span aria-hidden="true" />
                    {product.inStock ? 'En stock' : 'Épuisé'}
                  </span>
                  <button
                    className="add-button"
                    type="button"
                    disabled={!product.inStock}
                    onClick={() => onAddToCart(product.id)}
                  >
                    Ajouter au panier <span aria-hidden="true">＋</span>
                  </button>
                </div>
              </div>
            </article>
          )}
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

export default ProductDetailPage
