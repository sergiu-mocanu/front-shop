# Audit — performance, accessibility & eco-design

Session 3 exercise: measure, fix, re-measure. Every claim below is a measured "from X to Y".
Each fix is its own commit (`perf:`, `a11y:`, `eco:`), and that commit updates this file.

## Method

- **Tool:** Lighthouse 13.6.0 (CLI), Chrome headless, default profile: emulated mid-range phone,
  simulated slow 4G network and 4× CPU slowdown.
- **Target:** the production build (`npm run build && npm run preview`, port 4173), not the dev
  server, whose unbundled, unminified code doesn't reflect what users get.
- **Pages:** `/` (home) and `/products` (catalogue).
- **Runs:** 3 per page; the median is reported (scores vary by a few points between runs).
- Raw reports (HTML/JSON) are kept out of the repo for size. Each fix is measured on top of the
  previous ones, so a row's "before" is the previous row's "after".

## Summary

| Page | Measure | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | SI | Requests | Transferred |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | before | 88 | 95 | 96 | 92 | 1.6 s | 2.8 s | 0 ms | 0.163 | 1.6 s | 12 | 362 KiB |
| `/` | after | | | | | | | | | | | |
| `/products` | before | 75 | 95 | 96 | 92 | 1.6 s | 3.2 s | 0 ms | 0.366 | 1.6 s | 14 | 490 KiB |
| `/products` | after | | | | | | | | | | | |

FCP = First Contentful Paint · LCP = Largest Contentful Paint · TBT = Total Blocking Time ·
CLS = Cumulative Layout Shift · SI = Speed Index.

EcoIndex: `ecoindex-cli` 2.32 (EcoIndex method 5.10), desktop window 1920×1080. The score (out of
100, graded A–G) weighs DOM size ×3, requests ×2 and transferred weight ×1. GHG = greenhouse gas
emissions per page view.

| Page | Measure | Grade | Score | DOM elements | Requests | Weight | GHG | Water |
|---|---|---|---|---|---|---|---|---|
| `/` | before | A | 88 | 130 | 13 | 374 KB | 1.24 gCO₂e | 1.86 cl |
| `/` | after | | | | | | | |
| `/products` | before | A | 86 | 154 | 15 | 505 KB | 1.28 gCO₂e | 1.92 cl |
| `/products` | after | | | | | | | |

## Baseline findings

Transferred weight by type: JS 83 KiB (a single file, 274 kB uncompressed) · fonts 102 KiB
(2 Google Fonts files) · images 169 KiB on `/`, 297 KiB on `/products` · CSS 6 KiB.

- **CLS:** the cart panel (`aside.cart-panel`) shifts during load: 0.16 on `/`, 0.35 on `/products`.
  Not the images: `.product-image-wrap` already reserves their space with `aspect-ratio`. Below
  720 px the layout is one column with the cart under the product list; the products are fetched
  after the first render, so the list grows from a one-line loading message to the full grid and
  pushes the cart down.
- **LCP:** the LCP element is an Unsplash product image served 900 px wide, discovered late
  (HTML → JS → `products.json` → image). Lighthouse estimates 113 KiB of image savings.
- **Render-blocking:** the Google Fonts stylesheet (`@import` in `index.css`) blocks the first paint
  (~990 ms estimated).
- **JS:** a single bundle, ~42 KiB unused on the home page (no code-splitting).
- **Accessibility:** insufficient contrast (nav links, `.eyebrow`, `.intro-description`);
  `aria-label`s that don't contain the visible text (cart button, product image links).
- Not counted: the invalid `robots.txt` and a console 404 come from the local preview server, which
  answers any unknown path with `index.html`.

## Fixes

One row group per speed-run axis, each filled by its commit.

Notes on fix 1: CLS is unchanged (see baseline findings: not an image issue); the request count is
unchanged because Chrome starts lazy images ~1,250 px before the viewport, which covers these short
pages; EcoIndex measures a desktop window, where larger renditions are rightly picked.

Notes on fix 2: LCP on `/` is a product image, which waits for JS → `products.json` → image; fonts
aren't in that chain, so it stays within noise. Font bytes are unchanged (same files, now
same-origin); the gain is the removed connections and request chain.

Notes on fix 3: source-map-explorer shows the bundle is almost entirely libraries (React DOM, React
Router); each page weighs 0.5–2.7 kB, so splitting them barely shrinks what the home page loads,
and the bundler moved the shared `jsx-runtime` into its own chunk (+1 request on every page). The
CLS drop on `/products` is a timing side effect, not a fix: while the page chunk downloads,
`products.json` usually arrives too, so the grid renders at once instead of replacing a loading
message. Lesson: code-splitting pays off for heavy pages; here the weight is in shared libraries.

Notes on fix 4: React's `<Profiler>` is disabled in production builds and React DevTools needs
manual clicks, so renders were counted with a temporary counter in each component's body
(production build, removed before the commit) while a script drove headless Chrome over the
DevTools Protocol: load `/products`, click "Ajouter au panier" 3 times, read the counters. The
remaining `SiteFooter` renders (3) aren't worth a `memo()`: static and trivial to render.

Notes on fix 4b: with the grid's height reserved, `/products` still shifted (0.109), now on the
footer: since fix 3, the one-line `Suspense` fallback leaves the footer high while the page chunk
downloads. A full-height fallback keeps it below the viewport, where moves don't count. No shimmer
animation on the placeholders: decorative animation is what eco-design removes.

| # | Axis | Commit | Fix | Metric | Before | After |
|---|---|---|---|---|---|---|
| 1 | Perf — images | `perf: responsive, lazy-loaded product images` | `srcset` 400/800/1200 w + `sizes` (was one 900 px file for every screen); `loading="lazy"` after the first 2 cards; `fetchPriority="high"` on the first; `decoding="async"` | Weight `/` · `/products` | 362 · 490 KiB | 246 · 286 KiB |
| | | | | LCP `/` · `/products` | 2.8 · 3.2 s | 2.7 · 3.0 s |
| | | | | Perf `/` · `/products` | 88 · 75 | 89 · 76 |
| | | | | EcoIndex weight (desktop) | 374 · 505 KB | 344 · 452 KB (score unchanged: A 88 · A 86) |
| 2 | Perf — fonts | `perf: self-host and preload fonts` | DM Sans and Fraunces self-hosted in `public/fonts/` (was a CSS `@import` from Google Fonts: CSS → Google CSS → font files, on 2 extra domains, blocking the first paint); `@font-face` with `font-display: swap`; both fonts preloaded in `index.html` | FCP `/` · `/products` | 1.6 · 1.6 s | 0.8 · 0.8 s |
| | | | | Speed Index `/` · `/products` | 1.6 · 1.6 s | 0.8 · 0.8 s |
| | | | | Render-blocking (est.) `/` | 990 ms | 150 ms |
| | | | | LCP `/` · `/products` | 2.7 · 3.0 s | 2.8 · 2.6 s |
| | | | | Perf `/` · `/products` | 89 · 76 | 89 · 80 |
| | | | | Requests `/` · `/products` (Lighthouse) | 12 · 14 | 11 · 13 |
| | | | | Requests (EcoIndex) | 13 · 15 | 10 · 12 (score unchanged: A 88 · A 86) |
| 3 | Perf — code-splitting | `perf: lazy-load secondary pages` | `React.lazy` + `Suspense` for `/products`, `/products/:id`, `/orders` and the 404 page; the home page (entry point) stays in the main bundle | Main bundle (gzip) | 86.1 kB | 82.4 kB + 3.3 kB shared `jsx-runtime` chunk |
| | | | | Unused JS on `/` (est.) | 42 KiB | 38 KiB |
| | | | | Perf `/` · `/products` | 89 · 80 | 89 · 93 |
| | | | | CLS `/` · `/products` | 0.160 · 0.333 | 0.160 · 0.109 |
| | | | | LCP `/` · `/products` | 2.8 · 2.6 s | 2.8 · 2.8 s |
| | | | | Requests `/` · `/products` (Lighthouse) | 11 · 13 | 12 · 15 |
| | | | | Requests (EcoIndex) | 10 · 12 | 11 · 14 (score unchanged: A 88 · A 86) |
| 4 | Perf — re-renders | `perf: skip product list re-renders on cart changes` | `useCallback` for the cart actions in `useCart` (stable props), then `memo(ProductList)`; the state can't move lower than `App`, the only common parent of the header and the cart panel | Renders for 3 add-to-cart clicks on `/products` | 36 (24 unneeded: `ProductList` ×3, `ProductCard` ×18, `SiteFooter` ×3) | 15 (`ProductList` and `ProductCard`: 0) |
| | | | | TBT `/` · `/products` | 0 · 0 ms | 0 · 0 ms (no lab metric can move) |
| 4b | Perf — layout stability (extra, outside the 4 axes) | `perf: reserve space while content loads` | While `products.json` loads, the grid shows placeholder cards built from the real card's markup and classes (same size at every breakpoint; loading still announced to screen readers); the `Suspense` fallback of lazy pages fills the screen so the footer starts below it | CLS `/` · `/products` | 0.160 · 0.109 | 0.000 · 0.000 |
| | | | | Perf `/` · `/products` | 89 · 93 | 96 · 95 |
| | | | | LCP `/` · `/products` | 2.8 · 2.7 s | 2.8 · 2.9 s (within noise) |
| 4c | Perf — LCP chain hints (extra, outside the exercise) | `perf: preload product data, preconnect to image host` | `<link rel="preload" as="fetch">` for `products.json` (fetched alongside the JS instead of after it) and `<link rel="preconnect">` to `images.unsplash.com` | `products.json` request start (observed) | ~40 ms after the JS | with or before the JS |
| | | | | First image download (observed, unthrottled) | 59–71 ms | 11–16 ms |
| | | | | LCP `/` when the image is the LCP element | 2.8 s | 2.8 s (no lab gain) |
| 5 | Accessibility | `a11y: contrast, accessible names, one link per card` | `--muted` darkened `#78817b` → `#676f69` (all grey text); cart button: visible text + hidden " article(s)" instead of an `aria-label` that didn't contain it; product image links (duplicates of the title links) out of the tab order and hidden from screen readers; "Ajouter au panier" buttons name their product (hidden text) | Contrast of grey text, page · intro band | 3.98 · 3.53 : 1 | 5.13 · 4.56 : 1 (WCAG AA: 4.5) |
| | | | | Lighthouse contrast failures `/` · `/products` | 10 · 10 elements | 1 · 1 (the logo, see notes) |
| | | | | "Name doesn't contain visible text" failures `/` · `/products` | 5 · 7 | 0 · 0 |
| | | | | Keyboard tab stops `/` · `/products` | 19 · 22 | 15 · 16 |
| | | | | Distinct names among "Ajouter au panier" buttons on `/products` | 1 (all identical) | 5 (one per in-stock product) |
| | | | | A11y score `/` · `/products` | 95 · 95 | 95 · 95 (see notes) |
| 6 | Eco-design | | | | | |
