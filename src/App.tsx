import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import { useCart } from '@/hooks/useCart'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import OrdersPage from '@/pages/OrdersPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductsPage from '@/pages/ProductsPage'
import type { Product } from '@/types/ecommerce'
import '@/App.css'

function App() {
  const { cart, itemCount, addToCart, removeFromCart, clearCart } = useCart()
  const { pathname } = useLocation()
  const productsResult = useFetch<Product[]>('/data/products.json')
  const products = productsResult.status === 'success' ? productsResult.data : []
  const pageProps = {
    cart,
    products,
    productsResult,
    onAddToCart: addToCart,
    onRemoveFromCart: removeFromCart,
    onClearCart: clearCart,
  }
  const activePage = pathname === '/'
    ? 'home'
    : pathname.startsWith('/products')
      ? 'products'
      : pathname === '/orders'
        ? 'orders'
        : null

  return (
    <div className="app-shell">
      <SiteHeader
        activePage={activePage}
        cartCount={itemCount}
      />
      <Routes>
        <Route path="/" element={<HomePage {...pageProps} />} />
        <Route path="/products" element={<ProductsPage {...pageProps} />} />
        <Route path="/products/:id" element={<ProductDetailPage {...pageProps} />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

export default App
