import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

// Mirrors a row of the `profiles` table (supabase/04-admin.sql).
export interface Profile {
  id: string
  email: string | null
  role: 'user' | 'admin'
}

// The logged-in user's profile, which holds their role. Keyed by user id, like "my orders": the
// answer depends on who is logged in.
export function useProfile() {
  const { session } = useAuth()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['profile', { userId }],
    queryFn: async () => {
      // The id filter matters for an admin: "admin reads profiles" would return everyone's.
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', userId!)
        .maybeSingle()
      if (error) throw new Error(error.message)
      return data as Profile | null
    },
    enabled: Boolean(userId),
  })
}
