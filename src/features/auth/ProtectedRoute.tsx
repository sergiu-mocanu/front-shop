import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Wraps a page that needs a logged-in user. This guard is comfort, not security: it only hides
// pages. What a user may read or write is decided by the RLS policies in the database.
export function ProtectedRoute({ children }: PropsWithChildren) {
  const { session, booted } = useAuth()
  const location = useLocation()

  // Before the first session read, "no session" means "not known yet": redirecting now would
  // send a logged-in user to /login on every page reload.
  if (!booted) {
    return <main className="page-fallback"><p className="fetch-message" role="status">Chargement…</p></main>
  }
  if (!session) {
    // replace: /account doesn't stay in the history, so "back" doesn't bounce to it.
    // state.from: the login page sends the user back here once logged in.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
