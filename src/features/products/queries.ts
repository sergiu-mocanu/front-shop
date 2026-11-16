import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { CreateProductInput, Product } from '@/types/ecommerce'

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

// --- Catalogue writes (admin). After every write: invalidate ["products"], which also covers the
// detail keys ["products", { slug }] (invalidation matches by key prefix).

// Postgres error codes turned into messages an admin can act on.
function catalogueError(error: PostgrestError): Error {
  switch (error.code) {
    case '23505': // unique_violation
      return new Error('Ce slug est déjà utilisé par un autre produit.')
    case '23503': // foreign_key_violation: order_items still points to this product
      return new Error('Ce produit figure dans des commandes : marquez-le épuisé plutôt que de le supprimer.')
    case '23514': // check_violation
      return new Error('Valeur refusée : le prix doit être positif et l’image une URL https://images.unsplash.com/…')
    default:
      return new Error(error.message)
  }
}

// RLS doesn't raise an error when it refuses an update or a delete: the statement just affects no
// row. Asking for the affected rows back (.select()) turns that silence into a visible refusal.
const REFUSED = 'Écriture refusée : seul un administrateur peut modifier le catalogue.'

export function useSaveProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: CreateProductInput }) => {
      const { data, error } = id
        ? await supabase.from('products').update(input).eq('id', id).select()
        : await supabase.from('products').insert(input).select()
      if (error) throw catalogueError(error)
      if (data.length === 0) throw new Error(REFUSED)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('products').delete().eq('id', id).select()
      if (error) throw catalogueError(error)
      if (data.length === 0) throw new Error(REFUSED)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
