import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'
import { useCart } from '@/features/cart/store'
import { makeProduct } from '@/test/factories'
import { renderWithProviders } from '@/test/utils'

describe('ProductCard', () => {
  // The cart store lives outside React and survives between tests: empty it before each one.
  beforeEach(() => useCart.getState().clearCart())

  it('shows a product and adds it to the cart', async () => {
    const product = makeProduct({ id: '1', name: 'Lampe Aria', price: 42 })
    // The card holds <Link>s, which need a router: hence the wrapper, even for one card.
    renderWithProviders(<ProductCard product={product} index={0} />)

    // Visible to the user...
    expect(screen.getByRole('heading', { name: 'Lampe Aria' })).toBeInTheDocument()
    // ...and reachable by its role. A regex: the button's full accessible name is
    // "Ajouter au panier : Lampe Aria" (a visually hidden part names the product).
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /ajouter au panier/i }))

    // Zustand can be read outside React to check the effect.
    expect(useCart.getState().cart).toEqual({ '1': { productId: '1', quantity: 1 } })
  })

  it('cannot add a product that is out of stock', () => {
    renderWithProviders(<ProductCard product={makeProduct({ in_stock: false })} index={0} />)

    expect(screen.getByText('Épuisé')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeDisabled()
  })
})
