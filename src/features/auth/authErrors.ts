import type { AuthError } from '@supabase/supabase-js'

// Supabase Auth answers in English. The shop's UI is French, so the errors a visitor can meet on
// /login and /signup are translated, keyed by Supabase's stable error code (the English text can
// change between versions; the code doesn't).
const MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou mot de passe incorrect.',
  email_not_confirmed: 'Confirmez d’abord votre e-mail : un lien de confirmation vous a été envoyé.',
  user_already_exists: 'Un compte existe déjà avec cet e-mail.',
  email_exists: 'Un compte existe déjà avec cet e-mail.',
  weak_password: 'Mot de passe trop faible : choisissez-en un plus long.',
  email_address_invalid: 'Adresse e-mail invalide.',
  over_request_rate_limit: 'Trop de tentatives : réessayez dans quelques minutes.',
  over_email_send_rate_limit: 'Trop de tentatives : réessayez dans quelques minutes.',
  signup_disabled: 'Les inscriptions sont fermées pour le moment.',
}

// Any other case (network down, unexpected server error): a generic French message.
const FALLBACK = 'Une erreur est survenue. Réessayez dans un instant.'

export function authErrorMessage(error: Pick<AuthError, 'code'>): string {
  return (error.code && MESSAGES[error.code]) || FALLBACK
}
