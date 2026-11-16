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
- Raw reports (HTML/JSON) are kept out of the repo for size.

## Summary

| Page | Measure | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | SI | Requests | Transferred |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | before | 88 | 95 | 96 | 92 | 1.6 s | 2.8 s | 0 ms | 0.163 | 1.6 s | 12 | 362 KiB |
| `/` | after | | | | | | | | | | | |
| `/products` | before | 75 | 95 | 96 | 92 | 1.6 s | 3.2 s | 0 ms | 0.366 | 1.6 s | 14 | 490 KiB |
| `/products` | after | | | | | | | | | | | |

FCP = First Contentful Paint · LCP = Largest Contentful Paint · TBT = Total Blocking Time ·
CLS = Cumulative Layout Shift · SI = Speed Index.

| Page | EcoIndex before | EcoIndex after |
|---|---|---|
| `/` | | |
| `/products` | | |

## Baseline findings

Transferred weight by type: JS 83 KiB (a single file, 274 kB uncompressed) · fonts 102 KiB
(2 Google Fonts files) · images 169 KiB on `/`, 297 KiB on `/products` · CSS 6 KiB.

- **CLS:** the cart panel (`aside.cart-panel`) shifts during load: 0.16 on `/`, 0.35 on `/products`.
  Product images have no `width`/`height`, so no space is reserved for them.
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

One section per speed-run axis, each filled by its commit.

| # | Axis | Commit | Fix | Metric | Before | After |
|---|---|---|---|---|---|---|
| 1 | Perf — images | | | | | |
| 2 | Perf — fonts | | | | | |
| 3 | Perf — code-splitting | | | | | |
| 4 | Perf — re-renders | | | | | |
| 5 | Accessibility | | | | | |
| 6 | Eco-design | | | | | |
