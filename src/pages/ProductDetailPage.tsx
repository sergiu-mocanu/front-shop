import ProductImage from '@/features/products/ProductImage'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CartPanel from '@/components/CartPanel'
import { useProduct } from '@/features/products/queries'
import { useCart } from '@/features/cart/store'


function ProductDetailPage() {
  // The route is /products/:slug, so the param is always present on this page.
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: product, status, error } = useProduct(slug)
  const addToCart = useCart((state) => state.addToCart)

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
          {status === 'pending' ? (
            <p className="fetch-message" role="status">Chargement du produit…</p>
          ) : status === 'error' ? (
            <p className="fetch-message error-message" role="alert">{error.message}</p>
          ) : !product ? (
            <div className="fetch-message">
              <p>{`Aucun produit avec l’identifiant « ${slug} ».`}</p>
              <Link className="add-button" to="/products">Retour aux produits</Link>
            </div>
          ) : (
            <article className="product-detail-card">
              <div className="product-image-wrap">
                {product.image_url && (
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    sizes="(max-width: 720px) 100vw, 720px"
                    priority
                  />
                )}
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
                  <span className={product.in_stock ? 'stock-status' : 'stock-status is-out'}>
                    <span aria-hidden="true" />
                    {product.in_stock ? 'En stock' : 'Épuisé'}
                  </span>
                  <button
                    className="add-button"
                    type="button"
                    disabled={!product.in_stock}
                    onClick={() => addToCart(product.id)}
                  >
                    Ajouter au panier <span aria-hidden="true">＋</span>
                  </button>
                </div>
              </div>
            </article>
          )}
        </section>
        <CartPanel />
      </div>
    </main>
  )
}

export default ProductDetailPage
