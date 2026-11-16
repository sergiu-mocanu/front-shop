import { createClient } from '@supabase/supabase-js'

// One client for the whole app. The anon key is public by design: it only grants what the
// database's RLS policies allow the `anon` and `authenticated` roles.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
