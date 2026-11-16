-- Milestone 3: orders. The price paid, who may write what, the RLS policies, and place_order.
-- Run once in the Supabase SQL editor, after 01 and 02.

-- 1. The price paid, frozen at order time: changing a product's price later doesn't change past
--    orders. (order_items is still empty, so `not null` needs no default: the trigger in 3 fills it.)
alter table order_items
  add column unit_price numeric(10, 2) not null check (unit_price >= 0);

-- 2. Column privileges: which columns a role may write at all, checked before any policy.
--    Supabase grants every column to `anon` and `authenticated` by default; narrow inserts to
--    what a customer legitimately chooses. status and created_at keep their defaults, and
--    unit_price is set by the trigger below: none of them can be forged from the console.
revoke insert on orders from anon, authenticated;
grant insert (user_id) on orders to authenticated;
revoke insert on order_items from anon, authenticated;
grant insert (order_id, product_id, quantity) on order_items to authenticated;

-- 3. Each order line is priced from the catalogue, whatever path inserted it. A missing or
--    out-of-stock product makes the insert fail.
create function set_order_item_price()
returns trigger
language plpgsql
set search_path = ''  -- every name below is schema-qualified: nothing can be swapped in
as $$
begin
  select p.price into new.unit_price
  from public.products p
  where p.id = new.product_id and p.in_stock;

  if not found then
    raise exception 'Un produit du panier n''est plus disponible.';
  end if;
  return new;
end;
$$;

create trigger order_items_set_price
  before insert on order_items
  for each row execute function set_order_item_price();

-- 4. RLS, the privacy contract (from the course brief): which rows each user may touch.
-- Each user reads only their own orders:
create policy "read own orders" on orders
  for select using (auth.uid() = user_id);
-- ...and creates orders only in their own name:
create policy "insert own orders" on orders
  for insert with check (auth.uid() = user_id);
-- Order lines follow their order:
create policy "read own order items" on order_items
  for select using (
    exists (select 1 from orders o
            where o.id = order_id and o.user_id = auth.uid())
  );
create policy "insert own order items" on order_items
  for insert with check (
    exists (select 1 from orders o
            where o.id = order_id and o.user_id = auth.uid())
  );

-- 5. place_order: the order and its lines in one function, so one transaction. If anything fails
--    (a product gone, a policy refusing), everything is rolled back: no empty order left behind.
--    `items` is the cart as JSON: [{"product_id": "<uuid>", "quantity": 2}, ...]
--    security invoker: the function runs with the caller's rights, so the privileges and the
--    policies above still apply to it (an anonymous visitor is refused; nobody can order in
--    someone else's name).
create function place_order(items jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_order_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Connectez-vous pour commander.';
  end if;
  if items is null or jsonb_array_length(items) = 0 then
    raise exception 'Le panier est vide.';
  end if;

  insert into public.orders (user_id)
  values (auth.uid())
  returning id into new_order_id;

  -- No price here: the trigger sets each line's unit_price from the catalogue.
  insert into public.order_items (order_id, product_id, quantity)
  select new_order_id, (item ->> 'product_id')::uuid, (item ->> 'quantity')::int
  from jsonb_array_elements(items) as item;

  return new_order_id;
end;
$$;
