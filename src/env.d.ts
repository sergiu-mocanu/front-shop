// Types the variables read from .env: a typo in a name becomes a compile error instead of
// `undefined` at runtime. Vite only exposes variables prefixed with VITE_ to the browser.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
