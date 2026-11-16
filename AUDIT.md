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
| `/` | after | 98 | 95 | 96 | 91 | 0.8 s | 2.5 s | 0 ms | 0.000 | 0.8 s | 12 | 215 KiB |
| `/products` | before | 75 | 95 | 96 | 92 | 1.6 s | 3.2 s | 0 ms | 0.366 | 1.6 s | 14 | 490 KiB |
| `/products` | after | 98 | 95 | 96 | 91 | 0.8 s | 2.4 s | 0 ms | 0.000 | 0.8 s | 15 | 256 KiB |

FCP = First Contentful Paint · LCP = Largest Contentful Paint · TBT = Total Blocking Time ·
CLS = Cumulative Layout Shift · SI = Speed Index.

EcoIndex: `ecoindex-cli` 2.32 (EcoIndex method 5.10), desktop window 1920×1080. The score (out of
100, graded A–G) weighs DOM size ×3, requests ×2 and transferred weight ×1. GHG = greenhouse gas
emissions per page view.

| Page | Measure | Grade | Score | DOM elements | Requests | Weight | GHG | Water |
|---|---|---|---|---|---|---|---|---|
| `/` | before | A | 88 | 130 | 13 | 374 KB | 1.24 gCO₂e | 1.86 cl |
| `/` | after | A | 88 | 140 | 11 | 310 KB | 1.24 gCO₂e | 1.86 cl |
| `/products` | before | A | 86 | 154 | 15 | 505 KB | 1.28 gCO₂e | 1.92 cl |
| `/products` | after | A | 86 | 167 | 14 | 420 KB | 1.28 gCO₂e | 1.92 cl |

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

Notes on fix 4c: kept for its network-level gain; the lab LCP did **not** improve. Lighthouse
simulates LCP from the dependency chain, and the image still waits for the JS to download and run.
The `/` medians after this fix read Perf 100 and LCP 0.8 s, but that is an artifact: in 2 runs of 3
the LCP element switched from the product image to the "À découvrir" heading. Likely cause: images
now arrived while the cards faded in (`appear` animation), and Chrome doesn't count an element as
LCP while it is fading in. Not reported as a gain; confirmed by fix 6b.

Notes on fix 5: the a11y score can't move until every element passes the contrast audit (it is
pass/fail per page); the only element left is the logo mark "m." (white on coral, 3.58:1), and
WCAG 1.4.3 exempts logotypes from contrast requirements, so it was kept. Checked by code review, no
issue: one `<h1>` per page, no clickable `<div>`, visible focus outline (`index.css`), `lang="fr"`,
no form fields to label. Tab stops listed with a headless-Chrome script and checked by hand with
the keyboard. SEO moved 92 → 91 by arithmetic only: the `image-alt` audit no longer applies (images
are inside `aria-hidden` links), so a passing audit left the average; crawlers still read the `alt`.

Notes on fix 6a: deleting the whole template stylesheet first changed every screenshot: some of
its rules were silently part of the look (`font-synthesis: none` kept "pour longtemps." upright,
the inherited 145% line height set the rhythm, and `h1 { letter-spacing }` beat the shop's
`* { letter-spacing: 0 }` reset by specificity). Those were restored into the shop's base CSS until
the screenshots were byte-identical again. The unused files cost visitors nothing (Vite ships only
imported files, and `favicon.svg` wasn't referenced); deleting them is repo hygiene.

Notes on fix 6b: confirms the cause of fix 4c's artifact: without the fade-in, the product image is
the LCP element in every run, so LCP is now measured on the right element. Screenshots of the
settled pages are visually identical but not byte-identical: a finished animation with
`fill-mode: both` leaves a `transform` that puts the element on its own compositing layer, which
changes text anti-aliasing slightly. The hover zoom on product images was kept: it answers a user
action.

Notes on fix 6c — a trade-off decision, not a reflex:
- **Option B, measured and rejected:** dropping Fraunces for the declared fallback (Georgia) saves
  68 KB per page (−20 % on `/`, −1 request) but leaves the EcoIndex score unchanged (A 88 · A 86:
  DOM size dominates the formula, weight counts ×1), and the font is cached after the first visit.
  Visually it changes the brand: on Linux the fallback is a Times-like serif, on Windows/macOS
  Georgia, and "pour longtemps." turns italic (the system serif has a real italic).
- **Option C, chosen:** slimming the font keeps ~45 % of B's byte saving with a near-identical look.
  Three pinned values were compared on screenshots (opsz 18, 28, 48: all ~37 KB); 48 keeps the hero
  title closest to the original (~+1 % width, small headings marginally finer).
- **Why:** in a professional setting, brand identity, custom fonts included, is a deliberate
  investment that a company won't trade for a few dozen kilobytes. Eco-design gains that degrade
  the visuals are acceptable where the visuals carry no value (internal or developer tools,
  infrastructure dashboards), not on a customer-facing shop. The right move is to cut the cost of
  the brand's assets, not the brand.
- Unexpected gain: LCP improved (2.8 → 2.5 s on `/`): on the simulated slow 4G, the preloaded fonts
  share bandwidth with the product image, so a lighter font lets the image arrive sooner.
- The SIL Open Font License allows modified versions; Fraunces declares no Reserved Font Name, so
  the instanced file keeps its name (license text in `public/fonts/`).

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
| 6a | Eco-design — dead code | `eco: remove Vite template leftovers` | Deleted the Vite starter's CSS (purple theme, dark mode, `.counter`, `.hero`, `#docs`… ~110 lines in `App.css`, ~110 in `index.css`), unused rules (`.quantity-control`, `.detail-back-link`) and unused files (`src/assets/*`, `public/favicon.svg`, `public/icons.svg`); the template rules that still shaped the shop (18px/145% base, no synthesized italic, heading sizes and letter-spacing, `#root` flex column) were kept, merged into the shop's base | CSS file (gzip) | 17.3 kB (4.5 kB) | 13.7 kB (3.6 kB) |
| | | | | Visual change (8 full-page screenshots: 4 pages × phone/desktop) | — | none (byte-identical) |
| | | | | Weight `/` (Lighthouse) · EcoIndex weight `/` | 245 KiB · 342 KB | 244 KiB · 341 KB (score unchanged: A 88 · A 86) |
| 6b | Eco-design — decorative animation | `eco: remove entry fade-in animations` | Removed the `appear` fade-in (opacity + slide) on 5 elements: intro band, product cards (staggered), detail card, orders intro, order rows | Animations on page load | 5 (380–480 ms each, cards staggered up to +165 ms) | 0 |
| | | | | LCP element, 6 runs (`/` + `/products`) | image or heading (heading in 2 of 3 `/` runs after fix 4c) | image in 6 of 6 |
| | | | | LCP `/` · `/products` | 2.8 · 2.6 s | 2.8 · 2.6 s |
| | | | | Settled page appearance | — | visually identical (screenshots differ only in sub-pixel rendering) |
| 6c | Eco-design — font weight | `eco: slim the Fraunces font` | Fraunces (headings) instanced with fonttools: optical-size axis pinned at 48 (was 9–144, adapted to each size), weight axis 400–500 kept; same file name and `@font-face` | Fraunces file | 67 KB | 37 KB (−45 %) |
| | | | | Weight `/` · `/products` (Lighthouse) | 244 · 285 KiB | 215 · 256 KiB |
| | | | | LCP `/` · `/products` | 2.8 · 2.6 s | 2.5 · 2.4 s (image in 6 of 6 runs) |
| | | | | Perf `/` · `/products` | 96 · 97 | 98 · 98 |
| | | | | EcoIndex weight `/` · `/products` | 341 · 450 KB | 310 · 420 KB (score unchanged: A 88 · A 86) |

## Conclusion

- **Measure, fix, re-measure:** every row above is a re-measured "from X to Y", including the fixes
  that didn't pay off (code-splitting, the LCP hints) and why. Two apparent gains were measurement
  artifacts (a CLS drop from a loading race, a Perf 100 from the LCP element switching), caught by
  checking *which* element was measured.
- **Performance:** Perf 88 → 98 (`/`) and 75 → 98 (`/products`); the biggest wins were layout
  stability (CLS 0.37 → 0) and the font chain (FCP 1.6 → 0.8 s), not the bundle.
- **Accessibility:** contrast, accessible names and keyboard order fixed (tab stops 22 → 16 on
  `/products`); the score stays 95 only because of the logo, exempt under WCAG.
- **Eco-design:** the pages were already graded A; removing template leftovers, decorative
  animations and 30 KB of font cut weight by ~13 % with no visible change. EcoIndex doesn't move:
  on a page this small, its score is driven by DOM size, which the shop already keeps low.
