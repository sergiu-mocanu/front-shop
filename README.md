# Maison Moderne

A demo shop built with React and strict TypeScript. The catalogue and orders are loaded from the
static JSON files in `public/data/`; no API server is needed. The UI is in French.

## Getting started

```sh
npm install
npm run dev
```

## Routes

- `/`: home page and product selection
- `/products`: full catalogue
- `/products/:id`: product detail
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
