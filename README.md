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
npm test
```

Strict mode is enabled in `tsconfig.app.json`. Catalogue images and fonts are loaded from the web.

## Tests

```sh
npm test                 # Vitest: unit and component tests (jsdom, Supabase mocked)
npm run test:watch       # same, rerun on every save
npm run test:e2e         # Playwright: catalogue -> cart and login journeys in Chromium, real Supabase
npm run test:coverage    # coverage report: terminal table + coverage/index.html
```

The e2e tests start the dev server themselves (or reuse one on port 5173). On a new machine,
install their browser once: `npx playwright install chromium`.

The login journey (`e2e/auth.spec.ts`) needs a test account in `.env`; without it, it is skipped:

```sh
E2E_EMAIL=...      # an existing customer account (not an admin)
E2E_PASSWORD=...
```

### Storybook

```sh
npm run storybook        # component catalogue on http://localhost:6006
```

Stories sit next to their component (`*.stories.tsx`); each story is one state of the component
(e.g. `ProductCard`: standard, very long name). The a11y panel runs axe on the open story.

### Coverage

Coverage says which code the tests *ran*, not what they *checked*: a detector of untested areas,
not a target. The e2e journey is not counted (it runs in a separate browser).

| Date | Lines | Statements | Functions | Branches |
|---|---|---|---|---|
| 2026-11-17 | 32.5 % | 31.7 % | 27.7 % | 17.8 % |

Next test, chosen for risk rather than score: `orderTotal` (`src/types/orders.ts`, 0 %). It is the
amount of money shown to customers (My orders) and to the admin (Orders), and it is a pure
function, so the test is cheap. Higher-scoring but lower-value candidates were left for later: the
checkout hook (its logic lives in SQL), `slugify` (admin only, duplicates rejected by the
database), the route guards (comfort only; RLS protects the data).

Done right after this measure: `src/types/orders.test.ts` (3 tests, each seen red).

## Audit

Performance, accessibility and eco-design audit (Lighthouse before/after, one commit per axis):
[AUDIT.md](AUDIT.md).
