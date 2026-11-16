import { Link, useLocation } from 'react-router-dom'
import AuthForm from '@/features/auth/AuthForm'
import { supabase } from '@/lib/supabase'

function LoginPage() {
  const location = useLocation()

  return (
    <AuthForm
      title="Connexion"
      submitLabel="Se connecter"
      passwordAutoComplete="current-password"
      onSubmit={(email, password) => supabase.auth.signInWithPassword({ email, password })}
    >
      {/* state is passed on, so the "from" page survives a detour through sign-up. */}
      <p>Pas encore de compte ? <Link to="/signup" state={location.state}>Créer un compte</Link></p>
    </AuthForm>
  )
}

export default LoginPage
