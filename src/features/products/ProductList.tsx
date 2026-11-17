import type { ReactNode } from 'react'
import ProductCard from '@/features/products/ProductCard'
import ProductCardPlaceholder from '@/features/products/ProductCardPlaceholder'
import { useProducts } from '@/features/products/queries'
import { filterProducts } from '@/features/products/search'

// Placeholders shown while loading: the catalogue size (7 products), unless capped.
const PLACEHOLDER_COUNT = 7

type ProductListProps = {
  maxItems?: number
  /** Search text from the URL; empty or absent shows every product. */
  search?: string
}

function ProductList({ maxItems, search = '' }: ProductListProps) {
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
      const matches = filterProducts(result.data, search)
      const products = maxItems === undefined ? matches : matches.slice(0, maxItems)
      if (products.length > 0) {
        content = products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))
      } else if (search.trim() !== '') {
        content = <p className="fetch-message">Aucun produit ne correspond à « {search.trim()} ».</p>
      } else {
        content = <p className="fetch-message">Aucun produit à afficher pour le moment.</p>
      }
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
