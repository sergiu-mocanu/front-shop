-- Milestone 1: tables and row level security (RLS).
-- Run once in the Supabase SQL editor.

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                   -- readable id used in the URL: /products/lampe-aria
  name text not null,
  price numeric(10, 2) not null check (price >= 0),  -- exact decimal, 2 digits after the point
  image_url text,                              -- must stay an Unsplash URL (ProductImage builds its srcset from it)
  description text,
  category text,
  badge text,
  in_stock boolean not null default true
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  product_id uuid not null references products,
  quantity int not null default 1 check (quantity > 0)
);

-- RLS everywhere, from the start: with RLS on and no policy, a table returns no rows.
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Anyone, even an anonymous visitor, can read the catalogue.
create policy "products are public"
  on products for select using (true);
