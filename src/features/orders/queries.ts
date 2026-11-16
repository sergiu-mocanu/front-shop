import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/AuthContext'
import { useCart } from '@/features/cart/store'
import { supabase } from '@/lib/supabase'
import type { CartLine } from '@/types/ecommerce'
import type { OrderWithItems } from '@/types/orders'

// The user's orders, with their lines and product names (a nested select: PostgREST follows the
// foreign keys order_items.order_id and order_items.product_id).
// No user filter: the RLS policy "read own orders" already returns only this user's orders.
// The user id is still in the cache key: the result depends on who is logged in, so user B must
// never be served user A's cached list after a logout/login on the same browser.
export function useMyOrders() {
  const { session } = useAuth()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['orders', { userId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, user_id, status, created_at, order_items(quantity, unit_price, products(name))')
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      // `as unknown` first: without generated schema types, supabase-js guesses `products` is an
      // array, but order_items -> products is many-to-one, so PostgREST returns one object.
      return data as unknown as OrderWithItems[]
    },
    enabled: Boolean(userId), // no request before the session is known
  })
}

// Places the order through the SQL function place_order (supabase/03-orders.sql): one call, one
// transaction. Only ids and quantities are sent; the prices are read in the database.
export function usePlaceOrder() {
  const queryClient = useQueryClient()
  const clearCart = useCart((state) => state.clearCart)

  return useMutation({
    mutationFn: async (lines: CartLine[]) => {
      const { data, error } = await supabase.rpc('place_order', {
        items: lines.map((line) => ({ product_id: line.productId, quantity: line.quantity })),
      })
      if (error) throw new Error(error.message)
      return data as string // the new order's id
    },
    onSuccess: () => {
      // After every write: invalidate the key it changes, so "my orders" refetches.
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      clearCart()
    },
  })
}
