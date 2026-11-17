import { stripAccents } from '@/lib/text'
import type { Product } from '@/types/ecommerce'

// Lower case, accents removed: "Rosée" and "rosee" compare equal.
function normalize(text: string): string {
  return stripAccents(text).toLowerCase().trim()
}

// The products whose name or category contains the query. An empty query keeps every product.
// A pure function (no React, no network): the same inputs always give the same output.
export function filterProducts(products: Product[], query: string): Product[] {
  const needle = normalize(query)
  if (needle === '') return products
  return products.filter((product) =>
    [product.name, product.category ?? ''].some((field) => normalize(field).includes(needle)),
  )
}
