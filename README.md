# Maison Moderne

A demo shop built with React and strict TypeScript. The catalogue and orders live in a Supabase
(hosted Postgres) database, read with React Query; the SQL is in `supabase/`. The UI is in French.

## Getting started

1. In a Supabase project, run the files of `supabase/` in order (`01-schema.sql`,
   `02-seed-products.sql`, `03-orders.sql`, `04-admin.sql`) in the SQL editor. To make an account
   admin, run the `update profiles ...` statement at the end of `04-admin.sql` with its email.
2. Create `.env` at the repo root (it is git-ignored) with the project URL and its anon key, from
   Project Settings > API Keys:

   ```sh
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```

3. Install and start:

   ```sh
   npm install
   npm run dev
   ```

## Routes

- `/`: home page and product selection
- `/products`: full catalogue
- `/products/:slug`: product detail (e.g. `/products/lampe-aria`)
- `/login`, `/signup`: email and password (Supabase Auth)
- `/account`: the logged-in user's orders (protected)
- `/admin`, `/admin/orders`: catalogue management and all orders (admins only)
- Any other URL: 404 page

The cart lives in a Zustand store saved in localStorage, so it survives a reload. Ordering needs
an account; the order is written by the SQL function `place_order` (`supabase/03-orders.sql`).
Routes use React Router to navigate without reloading the page.

## Checking the project

```sh
npx tsc --noEmit -p tsconfig.app.json
npm run build
npm run lint
```

Strict mode is enabled in `tsconfig.app.json`. Catalogue images and fonts are loaded from the web.

## Audit

Performance, accessibility and eco-design audit (Lighthouse before/after, one commit per axis):
[AUDIT.md](AUDIT.md).
