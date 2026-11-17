import { describe, expect, it } from 'vitest'
import { authErrorMessage } from './authErrors'

describe('authErrorMessage', () => {
  it('translates a known Supabase error code', () => {
    expect(authErrorMessage({ code: 'invalid_credentials' })).toBe('E-mail ou mot de passe incorrect.')
  })

  it('falls back to a generic French message for an unknown or missing code', () => {
    const generic = 'Une erreur est survenue. Réessayez dans un instant.'
    expect(authErrorMessage({ code: 'something_new' })).toBe(generic)
    expect(authErrorMessage({ code: undefined })).toBe(generic)
  })
})
