import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthValue {
  session: Session | null
  booted: boolean // has the first session read finished?
}

const AuthContext = createContext<AuthValue>({ session: null, booted: false })

// Holds the Supabase session for the whole app. A Context fits: one value, read everywhere
// (header, protected pages), that changes rarely (login, logout, token refresh).
export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    // 1. Read the session saved by supabase-js in localStorage (a previous visit).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setBooted(true)
    })
    // 2. Then follow every change: login, logout, token refresh, another tab.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    // Cleanup: stop listening when the provider unmounts.
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, booted }}>
      {children}
    </AuthContext.Provider>
  )
}

// Exported next to the provider, as in the course brief. The react-refresh rule wants files that
// export only components (so Vite can hot-swap them); the cost of the exception is a full page
// reload in dev when this file is edited.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
