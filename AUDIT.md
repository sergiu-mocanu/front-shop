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

| # | Axis | Commit | Fix | Metric | Before | After |
|---|---|---|---|---|---|---|
| 1 | Perf — images | `perf: responsive, lazy-loaded product images` | `srcset` 400/800/1200 w + `sizes` (was one 900 px file for every screen); `loading="lazy"` after the first 2 cards; `fetchPriority="high"` on the first; `decoding="async"` | Weight `/` · `/products` | 362 · 490 KiB | 246 · 286 KiB |
| | | | | LCP `/` · `/products` | 2.8 · 3.2 s | 2.7 · 3.0 s |
| | | | | Perf `/` · `/products` | 88 · 75 | 89 · 76 |
| | | | | EcoIndex weight (desktop) | 374 · 505 KB | 344 · 452 KB (score unchanged: A 88 · A 86) |
| 2 | Perf — fonts | | | | | |
| 3 | Perf — code-splitting | | | | | |
| 4 | Perf — re-renders | | | | | |
| 5 | Accessibility | | | | | |
| 6 | Eco-design | | | | | |
