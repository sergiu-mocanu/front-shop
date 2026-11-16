import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/ecommerce'

// Every component that needs the catalogue calls this hook. React Query caches the result under
// the key ["products"], so several callers share a single request.
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select().order('name')
      if (error) throw new Error(error.message)
      return data as Product[]
    },
  })
}

// One product, looked up by the slug in the URL. maybeSingle() returns null when no row matches,
// where single() would throw: "unknown product" is a normal outcome here, not an error.
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', { slug }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select()
        .eq('slug', slug)
        .maybeSingle()
      if (error) throw new Error(error.message)
      return data as Product | null
    },
  })
}
