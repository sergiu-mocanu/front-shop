import type { Product } from '@/types/ecommerce'

// A complete Product with sensible defaults: each test writes only the fields it cares about, and
// a schema change (a new column in the type) breaks the tests at compile time, not silently.
export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1', slug: 'produit', name: 'Produit', price: 10, in_stock: true,
    category: null, description: null, image_url: null, badge: null,
    ...overrides,
  }
}
