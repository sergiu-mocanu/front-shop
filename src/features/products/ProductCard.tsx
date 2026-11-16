import type { Product } from '@/types/ecommerce'
import { Link } from 'react-router-dom'

type ProductCardProps = {
  product: Product
  onAddToCart: (productId: string) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/products/${product.id}`} aria-label={`Voir ${product.name}`}>
        <div className="product-image-wrap">
          {product.image && <img className="product-image" src={product.image} alt={product.name} />}
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {product.category && <span className="product-category">{product.category}</span>}
        </div>
      </Link>
      <div className="product-details">
        <div className="product-title-row">
          <h3><Link className="product-title-link" to={`/products/${product.id}`}>{product.name}</Link></h3>
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
            Ajouter au panier
            <span aria-hidden="true">＋</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
