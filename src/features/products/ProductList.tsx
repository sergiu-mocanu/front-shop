import type { ReactNode } from 'react'
import ProductCard from '@/features/products/ProductCard'
import ProductCardPlaceholder from '@/features/products/ProductCardPlaceholder'
import { useProducts } from '@/features/products/queries'

// Placeholders shown while loading: the catalogue size (7 products), unless capped.
const PLACEHOLDER_COUNT = 7

type ProductListProps = {
  maxItems?: number
}

function ProductList({ maxItems }: ProductListProps) {
  const result = useProducts()
  let content: ReactNode

  switch (result.status) {
    case 'pending':
      content = (
        <>
          <p className="visually-hidden" role="status">Chargement des produits…</p>
          {Array.from({ length: maxItems ?? PLACEHOLDER_COUNT }, (_, index) => (
            <ProductCardPlaceholder key={index} />
          ))}
        </>
      )
      break
    case 'error':
      content = <p className="fetch-message error-message" role="alert">{result.error.message}</p>
      break
    case 'success': {
      const products = maxItems === undefined ? result.data : result.data.slice(0, maxItems)
      content = products.length > 0
        ? products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        : <p className="fetch-message">Aucun produit à afficher pour le moment.</p>
      break
    }
    default: {
      const _exhaustive: never = result
      content = _exhaustive
    }
  }

  return <div className="product-grid" aria-live="polite">{content}</div>
}

// No memo needed any more: the cart lives in a store, not in App, so a cart change no longer
// re-renders the page tree; only the components that select the cart re-render.
export default ProductList
