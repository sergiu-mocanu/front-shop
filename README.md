# Maison Moderne

A demo shop built with React and strict TypeScript. The catalogue and orders live in a Supabase
(hosted Postgres) database, read with React Query; the SQL is in `supabase/`. The UI is in French.

## Getting started

1. In a Supabase project, run `supabase/01-schema.sql` then `supabase/02-seed-products.sql` in the
   SQL editor.
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
- `/orders`: order list, grouped by status
- Any other URL: 404 page

The cart is shared across pages during the session. Routes use React Router to navigate without
reloading the page.

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
