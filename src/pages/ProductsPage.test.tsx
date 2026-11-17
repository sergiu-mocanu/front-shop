import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductsPage from './ProductsPage'
import { useCart } from '@/features/cart/store'
import { renderWithProviders } from '@/test/utils'

// Supabase is slow and external: replaced by a fake for this file. vi.mock is moved to the top of
// the file before the imports run, so the fixtures live inside it. It follows the app's real query,
// supabase.from('products').select().order('name').
vi.mock('@/lib/supabase', async () => {
  const { makeProduct } = await import('@/test/factories')
  const fakeProducts = [
    makeProduct({ id: '1', name: 'Lampe Aria', price: 42 }),
    makeProduct({ id: '2', name: 'Table Nord', price: 120 }),
  ]
  return {
    supabase: {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: fakeProducts, error: null }),
        }),
      }),
    },
  }
})

describe('ProductsPage', () => {
  beforeEach(() => useCart.getState().clearCart())

  it('shows only the products matching the search in the URL', async () => {
    renderWithProviders(<ProductsPage />, '/products?search=lamp')

    // findBy* waits for the (fake) request to resolve and the list to render.
    expect(await screen.findByRole('heading', { name: 'Lampe Aria' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Table Nord' })).not.toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Rechercher un produit' })).toHaveValue('lamp')
  })

  it('writes the search typed by the user into the URL', async () => {
    const { getLocation } = renderWithProviders(<ProductsPage />, '/products')
    await screen.findByRole('heading', { name: 'Table Nord' })

    const user = userEvent.setup()
    await user.type(screen.getByRole('searchbox', { name: 'Rechercher un produit' }), 'table')

    await waitFor(() => expect(getLocation()?.search).toBe('?search=table'))
    expect(screen.queryByRole('heading', { name: 'Lampe Aria' })).not.toBeInTheDocument()
  })
})
