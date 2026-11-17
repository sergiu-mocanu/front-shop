import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { computeCartTotal } from '@/features/cart/cart'
import { useCart } from '@/features/cart/store'
import { usePlaceOrder } from '@/features/orders/queries'
import { useProducts } from '@/features/products/queries'

function CartPanel() {
  const cart = useCart((state) => state.cart)
  const removeFromCart = useCart((state) => state.removeFromCart)
  const clearCart = useCart((state) => state.clearCart)
  const { session } = useAuth()
  const location = useLocation()
  const placeOrder = usePlaceOrder()
  const { data: products = [] } = useProducts()

  const lines = Object.values(cart)
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0)
  const findProduct = (productId: string) => products.find((product) => product.id === productId)
  const getProductName = (productId: string) => findProduct(productId)?.name ?? productId
  const total = computeCartTotal(lines, products)

  return (
    <aside className="cart-panel" id="basket" aria-labelledby="cart-title">
      <div className="cart-panel-heading">
        <div>
          <p className="eyebrow">Votre sélection</p>
          <h2 id="cart-title">Le panier <span className="heading-count">{itemCount}</span></h2>
        </div>
        <span className="basket-icon" aria-hidden="true">↗</span>
      </div>
      {lines.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-mark" aria-hidden="true">＋</span>
          <p>Votre panier est encore vide.</p>
          <span>Les belles trouvailles sont juste à côté.</span>
        </div>
      ) : (
        <div className="cart-lines">
          {lines.map((line) => (
            <div key={line.productId} className="cart-line">
              <span className="cart-line-thumb" aria-hidden="true">m.</span>
              <div className="cart-line-info">
                <strong>{getProductName(line.productId)}</strong>
                <span>Quantité : {line.quantity}</span>
              </div>
              <button
                className="remove-button"
                type="button"
                onClick={() => removeFromCart(line.productId)}
                aria-label={`Retirer ${getProductName(line.productId)} du panier`}
              >
                Retirer
              </button>
            </div>
          ))}
          <button className="clear-cart" type="button" onClick={clearCart}>
            Vider le panier
          </button>
          <p className="cart-total">Total <strong>{total} €</strong></p>
          {session ? (
            <button
              className="add-button cart-checkout"
              type="button"
              disabled={placeOrder.isPending}
              onClick={() => placeOrder.mutate(lines)}
            >
              {placeOrder.isPending ? 'Commande en cours…' : 'Commander'}
            </button>
          ) : (
            // state.from: back to this page after login; the cart is kept (persisted store).
            <Link className="add-button cart-checkout" to="/login" state={{ from: location.pathname }}>
              Se connecter pour commander
            </Link>
          )}
          {placeOrder.isError && (
            <p className="cart-message error-message" role="alert">{placeOrder.error.message}</p>
          )}
        </div>
      )}
      {/* Outside the lines: the cart is empty once the order is placed. */}
      {placeOrder.isSuccess && (
        <p className="cart-message" role="status">
          Commande enregistrée. <Link to="/account">Voir mes commandes</Link>
        </p>
      )}
      <div className="cart-footnote"><span className="footnote-check">✓</span> Livraison offerte dès 80 €</div>
    </aside>
  )
}

export default CartPanel
