import { useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { AuthError } from '@supabase/supabase-js'
import { useAuth } from './AuthContext'
import { authErrorMessage } from './authErrors'

type AuthFormProps = {
  title: string
  submitLabel: string
  /** Lets password managers tell "log in" (current-password) from "sign up" (new-password). */
  passwordAutoComplete: 'current-password' | 'new-password'
  /** The Supabase call: signInWithPassword or signUp. */
  onSubmit: (email: string, password: string) => Promise<{ error: AuthError | null }>
  /** Below the form: the link to the other page. */
  children: ReactNode
}

// The page shared by /login and /signup: same fields, same error display, same redirect.
function AuthForm({ title, submitLabel, passwordAutoComplete, onSubmit, children }: AuthFormProps) {
  const { session, booted } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Same wait as ProtectedRoute: without it, a logged-in user opening /login would see the form
  // flash before the redirect.
  if (!booted) {
    return <main className="page-fallback"><p className="fetch-message" role="status">Chargement…</p></main>
  }

  // Logged in (just now, or already): go to the page that sent us here, else the account page.
  // No navigate() after a successful submit: the new session reaches the Context through
  // onAuthStateChange, this component re-renders, and this line does the redirect.
  if (session) {
    const from = (location.state as { from?: string } | null)?.from ?? '/account'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // no full page reload: the form is handled in JS
    setSubmitting(true)
    setError(null)
    const { error } = await onSubmit(email, password)
    setSubmitting(false)
    if (error) setError(authErrorMessage(error)) // shown in French, not swallowed
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow"><span className="eyebrow-dot" /> Votre espace</p>
        <h1>{title}</h1>
        <label className="form-field">
          E-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="form-field">
          Mot de passe
          <input
            type="password"
            autoComplete={passwordAutoComplete}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className="auth-error error-message" role="alert">{error}</p>}
        <button className="add-button auth-submit" type="submit" disabled={submitting}>
          {submitting ? 'Patientez…' : submitLabel}
        </button>
        <div className="auth-switch">{children}</div>
      </form>
    </main>
  )
}

export default AuthForm
