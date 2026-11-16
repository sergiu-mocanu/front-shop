import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HomePage from '@/pages/HomePage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AdminRoute } from '@/features/auth/AdminRoute'
import '@/App.css'

// Code-splitting: each secondary page is its own chunk, downloaded on first visit.
// The home page stays in the main bundle: it is the entry point, so lazy-loading it would add a
// round-trip (main bundle, then home chunk) to the most visited page.
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const AdminProductsPage = lazy(() => import('@/pages/AdminProductsPage'))
const AdminOrdersPage = lazy(() => import('@/pages/AdminOrdersPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  const { pathname } = useLocation()
  const activePage = pathname === '/'
    ? 'home'
    : pathname.startsWith('/products')
      ? 'products'
      : pathname === '/account'
        ? 'account'
        : pathname.startsWith('/admin')
          ? 'admin'
          : null

  return (
    <div className="app-shell">
      <SiteHeader activePage={activePage} />
      <Suspense fallback={<main className="page-fallback"><p className="fetch-message" role="status">Chargement…</p></main>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <SiteFooter />
    </div>
  )
}

export default App
