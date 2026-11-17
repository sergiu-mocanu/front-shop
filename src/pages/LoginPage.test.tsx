import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'
import { AuthProvider } from '@/features/auth/AuthContext'
import { renderWithProviders } from '@/test/utils'

// vi.hoisted: created before vi.mock runs, so the test can also check how it was called.
const { signInWithPassword } = vi.hoisted(() => ({
  signInWithPassword: vi.fn(() => Promise.resolve({ error: { code: 'invalid_credentials', message: 'Invalid login credentials' } })),
}))

// The fake covers what AuthProvider reads at start-up (no saved session) and the login call,
// which always refuses here.
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword,
    },
  },
}))

// The real AuthProvider: the form waits for it to read the session before showing itself.
function renderLogin() {
  return renderWithProviders(<AuthProvider><LoginPage /></AuthProvider>, '/login')
}

describe('LoginPage', () => {
  it('shows the error when the credentials are refused', async () => {
    renderLogin()
    const user = userEvent.setup()

    await user.type(await screen.findByLabelText('E-mail'), 'nobody@myshop.test')
    await user.type(screen.getByLabelText('Mot de passe'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou mot de passe incorrect.')
  })

  it('does not send the form when the fields are empty', async () => {
    signInWithPassword.mockClear()
    renderLogin()
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Se connecter' }))

    expect(signInWithPassword).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
