import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { lazy, Suspense } from 'react'
import HomePage from '@/pages/HomePage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import '@/App.css'

// Code-splitting: each secondary page is its own chunk, downloaded on first visit.
// The home page stays in the main bundle: it is the entry point, so lazy-loading it would add a
// round-trip (main bundle, then home chunk) to the most visited page.
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  const { cart, itemCount, addToCart, removeFromCart, clearCart } = useCart()
  const { pathname } = useLocation()
  const pageProps = {
    cart,
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
        : pathname === '/account'
          ? 'account'
          : null

  return (
    <div className="app-shell">
      <SiteHeader
        activePage={activePage}
        cartCount={itemCount}
      />
      <Suspense fallback={<main className="page-fallback"><p className="fetch-message" role="status">Chargement…</p></main>}>
        <Routes>
          <Route path="/" element={<HomePage {...pageProps} />} />
          <Route path="/products" element={<ProductsPage {...pageProps} />} />
          <Route path="/products/:slug" element={<ProductDetailPage {...pageProps} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <SiteFooter />
    </div>
  )
}

export default App
