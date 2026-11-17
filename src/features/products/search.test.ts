import { describe, expect, it } from 'vitest'
import { filterProducts } from './search'
import type { Product } from '@/types/ecommerce'

function product(overrides: Partial<Product>): Product {
  return {
    id: '1', slug: 'p', name: 'Produit', price: 10, in_stock: true,
    category: null, description: null, image_url: null, badge: null,
    ...overrides,
  }
}

const catalogue = [
  product({ id: '1', name: 'Lampe Aria', category: 'Lumière' }),
  product({ id: '2', name: 'Carafe Rosée', category: 'Art de la table' }),
  product({ id: '3', name: 'Tasse Atelier', category: 'Art de la table' }),
]
const names = (products: Product[]) => products.map((p) => p.name)

describe('filterProducts', () => {
  it('keeps every product when the query is empty or blank', () => {
    expect(filterProducts(catalogue, '')).toHaveLength(3)
    expect(filterProducts(catalogue, '   ')).toHaveLength(3)
  })

  it('matches the name, ignoring case and accents', () => {
    expect(names(filterProducts(catalogue, 'ROSEE'))).toEqual(['Carafe Rosée'])
  })

  it('matches the category', () => {
    expect(names(filterProducts(catalogue, 'art de la'))).toEqual(['Carafe Rosée', 'Tasse Atelier'])
  })

  it('returns nothing when no product matches', () => {
    expect(filterProducts(catalogue, 'xyz')).toEqual([])
  })
})
