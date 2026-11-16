import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useProfile } from './useProfile'

// Wraps an admin page: ProtectedRoute first (session required), then the role check.
// Like ProtectedRoute, this guard only hides the pages. What a non-admin can actually read or
// write is decided by the admin policies in the database (supabase/04-admin.sql).
export function AdminRoute({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <AdminOnly>{children}</AdminOnly>
    </ProtectedRoute>
  )
}

function AdminOnly({ children }: PropsWithChildren) {
  const profile = useProfile()

  if (profile.status === 'pending') {
    return <main className="page-fallback"><p className="fetch-message" role="status">Chargement…</p></main>
  }
  if (profile.status === 'error') {
    return <main className="page-fallback"><p className="fetch-message error-message" role="alert">{profile.error.message}</p></main>
  }
  if (profile.data?.role !== 'admin') {
    return (
      <main className="not-found-page">
        <p className="eyebrow"><span className="eyebrow-dot" /> Erreur 403</p>
        <h1>Accès réservé.</h1>
        <p>Cette page est réservée à l’administration de la boutique.</p>
        <Link className="add-button" to="/">Retour à l’accueil</Link>
      </main>
    )
  }
  return <>{children}</>
}
