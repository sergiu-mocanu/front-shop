import type { CartLine, Product } from '@/types/ecommerce'

// The cart total: each line's quantity times its product's catalogue price. A product missing from
// the catalogue (deleted since it was added) counts 0. Indicative only: the database prices the
// order itself (supabase/03-orders.sql).
export function computeCartTotal(lines: CartLine[], products: Product[]): number {
  return lines.reduce((sum, line) => {
    const product = products.find((candidate) => candidate.id === line.productId)
    return sum + (product?.price ?? 0) * line.quantity
  }, 0)
}
