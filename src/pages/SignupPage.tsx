import { Link, useLocation } from 'react-router-dom'
import AuthForm from '@/features/auth/AuthForm'
import { supabase } from '@/lib/supabase'

// With "Confirm email" off in Supabase, signUp returns a session at once: the new user is logged
// in and AuthForm redirects them.
function SignupPage() {
  const location = useLocation()

  return (
    <AuthForm
      title="Créer un compte"
      submitLabel="Créer mon compte"
      passwordAutoComplete="new-password"
      onSubmit={(email, password) => supabase.auth.signUp({ email, password })}
    >
      <p>Déjà inscrit ? <Link to="/login" state={location.state}>Se connecter</Link></p>
    </AuthForm>
  )
}

export default SignupPage
