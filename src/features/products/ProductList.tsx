import { memo, type ReactNode } from 'react'
import ProductCard from '@/features/products/ProductCard'
import ProductCardPlaceholder from '@/features/products/ProductCardPlaceholder'
import { useProducts } from '@/features/products/queries'

// Placeholders shown while loading: the catalogue size (7 products), unless capped.
const PLACEHOLDER_COUNT = 7

type ProductListProps = {
  onAddToCart: (productId: string) => void
  maxItems?: number
}

function ProductList({ onAddToCart, maxItems }: ProductListProps) {
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
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} index={index} />
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

// Memoized: the cart lives in App, so every cart change re-renders App's whole tree. The list's
// props (stable onAddToCart, maxItems) don't change with the cart, so it and its cards skip.
// It still re-renders when its own query changes, since useProducts() subscribes to the cache.
export default memo(ProductList)
