import type { Product } from '@/types/ecommerce'
import { Link } from 'react-router-dom'
import ProductImage from '@/features/products/ProductImage'
import { useCart } from '@/features/cart/store'

// Card image width: full width on small phones, half the grid below 720px, ~455px max on desktop.
const CARD_SIZES = '(max-width: 390px) 100vw, (max-width: 720px) 50vw, 460px'

type ProductCardProps = {
  product: Product
  /** Position in the grid: the first cards are above the fold. */
  index: number
}

function ProductCard({ product, index }: ProductCardProps) {
  // An action never changes, so selecting it never re-renders the card when the cart changes.
  const addToCart = useCart((state) => state.addToCart)

  return (
    <article className="product-card">
      {/* Duplicate of the title link, kept for mouse/touch: out of the tab order and hidden from
          screen readers, so each card has one link. */}
      <Link className="product-image-link" to={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="product-image-wrap">
          {product.image_url && (
            <ProductImage
              src={product.image_url}
              alt={product.name}
              sizes={CARD_SIZES}
              eager={index < 2}
              priority={index === 0}
            />
          )}
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {product.category && <span className="product-category">{product.category}</span>}
        </div>
      </Link>
      <div className="product-details">
        <div className="product-title-row">
          <h3><Link className="product-title-link" to={`/products/${product.slug}`}>{product.name}</Link></h3>
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
            Ajouter au panier
            <span className="visually-hidden"> : {product.name}</span>
            <span aria-hidden="true">＋</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
