-- Milestone 4: the admin role, its policies, and catalogue constraints.
-- Run once in the Supabase SQL editor, after 01 to 03. Making someone admin is a separate one-off
-- statement (see the end of this file); it holds an email, so it is never committed.

-- 1. Profiles: one row per user, holding the role.
--    on delete cascade: deleting a user in the dashboard also deletes their profile (without it,
--    the foreign key would block the deletion).
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin'))
);
alter table profiles enable row level security;

create policy "read own profile" on profiles
  for select using (auth.uid() = id);
-- No insert/update/delete policy, and no privilege either: nobody can write a profile from the
-- API, so nobody can make themselves admin. Profiles are created by the trigger below.
revoke insert, update, delete on profiles from anon, authenticated;

-- 2. is_admin(): the admin check, written once and used by every admin policy.
--    security definer: it runs with its owner's rights, so it reads profiles without RLS. That
--    avoids infinite recursion in "admin reads profiles" (a policy on profiles that queries
--    profiles would trigger itself). It only answers about the caller (auth.uid()).
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3. A profile for every new user (the brief's bonus), and for the users who already exist.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer  -- writes profiles, which the new user may not do
set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- 4. Orders point to profiles too, so the admin's nested select can fetch the customer's email:
--    orders.select('*, profiles(email)'). (PostgREST only follows foreign keys between exposed
--    tables, and auth.users isn't one.)
alter table orders
  add constraint orders_user_id_profiles_fkey
  foreign key (user_id) references profiles (id) on delete set null;

-- 5. Admin policies. They add to the existing ones: a row is visible if any select policy allows it.
create policy "admin reads profiles" on profiles
  for select using (public.is_admin());
create policy "admin manages products" on products
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin reads orders" on orders
  for select using (public.is_admin());
create policy "admin reads order items" on order_items
  for select using (public.is_admin());

-- 6. Catalogue constraint: the shop's ProductImage builds its srcset by rewriting an Unsplash URL,
--    and a malformed URL would crash the page. The database guarantees the format.
alter table products
  add constraint products_image_url_unsplash
  check (image_url is null or image_url like 'https://images.unsplash.com/%');

-- 7. Make yourself admin: run this ONCE in the SQL editor, with your account's email.
--    Not committed with your email in it (the repo is public).
--
--    update profiles set role = 'admin' where email = 'you@example.com';
--    select email, role from profiles;  -- check
