import { supabase } from '@/lib/supabase'

// Shared by the header (desktop) and the account page. signOut clears the session; then
// onAuthStateChange updates the Context: the header switches back to "Connexion", and a protected
// page the user is on redirects to /login by itself.
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) window.alert(`Déconnexion impossible : ${error.message}`)
}
