# Phase 4 — Summary

**Phase:** A11y + Perf Audit Pass
**Shipped:** 2026-05-23
**Final live commit:** 6020f4e

## Shipped

- **Zero axe-core violations** across 4 audited routes — homepage,
  /writing, /writing/patch-vulnerability, /work/smart-home.
- **scripts/audit-a11y.mjs** committed: one-liner for repeat audits via
  Playwright + @axe-core/playwright. `node scripts/audit-a11y.mjs`.
- **`prefers-reduced-motion`** handled at the CSS level — animations and
  transitions collapse to 0.01ms when the OS requests less motion. The
  aurora gradient drift is explicitly halted (it would otherwise loop).
- **Stretched-link pattern** for clickable project cards — title becomes
  an anchor with a `::before` overlay that covers the card; source / live
  anchors sit at z-index: 2 above. No nested-interactive, no invalid ARIA
  role on `<article>`, full card still clickable.
- **Heading order fixed** — career role titles promoted from styled
  `<span className="title">` to semantic `<h3 className="title">`, so
  the page now flows h1 (page) → h2 (section) → h3 (role/project) → h4
  (Projects / Impact detail labels).
- **Statusbar wrapped** in `role="region" aria-label="System status"`
  so screen readers can land on it.
- **`<pre>` code blocks** are keyboard-scrollable (`tabIndex={0}`) with
  a unique `aria-label="code block (lang)"`. Dropped the `role="region"`
  to avoid landmark-uniqueness collisions when multiple code blocks are
  on the same page.

## Detour worth recording

The first round of fixes (commit 61c9965) traded one set of violations
for another — `role="button"` on the cards was also invalid for
`<article>` and additionally created a `nested-interactive` violation
against the inner source / live anchors. Second round (commit 6020f4e)
switched to the stretched-link pattern, which is the canonical
accessibility solution for "make the whole card clickable while keeping
inner buttons independently interactive."

Also: lighthouse CLI couldn't run locally (Node x64 vs Chrome arm64 on
Apple Silicon = Rosetta error). PageSpeed Insights API was quota-locked
without a Drew-provisioned API key. The audit ended up running via
axe-core through Playwright, which is the same engine Lighthouse uses
for its accessibility category. Pragmatic substitute.

## Success criteria

1. ⚠️ Lighthouse perf ≥ 95 / a11y = 100 / BP ≥ 95 / SEO = 100 — not
   measured (Lighthouse blocked). axe-core a11y = 0 violations was the
   substitute measure. Perf / BP / SEO scoring deferred (would require
   Drew-provisioned PSI API key or running Lighthouse on a different
   Node install).
2. ✅ Site is fully usable via keyboard alone — all interactive
   elements have keyboard support; tabIndex on scrollable code blocks.
3. ✅ Sensible reading order — heading hierarchy h1 → h2 → h3 → h4
   with no skips.
4. ✅ Framer Motion animations respect `prefers-reduced-motion`.

## Deferred to follow-up

- **Full Lighthouse scoring** for perf, BP, SEO categories. Two paths:
  (a) Drew provisions a free Google Cloud project + enables PageSpeed
  Insights API + supplies the key, or (b) Drew installs an arm64 Node
  via nvm/asdf, then `npx lighthouse` works locally.
- **VoiceOver manual test pass** — axe-core catches structural a11y
  issues but doesn't simulate a screen-reader actually consuming the
  site. A 5-minute VoiceOver flow would catch any reading-order quirks
  axe can't see.
- **Real-device mobile audit** — Phase 11 still pending. Touch targets
  may or may not pass 44×44 minimum.

## Metrics

- Lines of code added/changed: ~120 (component edits + CSS + audit
  script + reduced-motion block)
- Bundle delta: +0.3 KB raw / +0.3 KB gzipped (basically negligible)
- Plans completed: 3 of 3
- Wall-clock time: ~40 min (split across two fix rounds + re-audits)
- New devDependencies: lighthouse, playwright, @axe-core/playwright
  (audit-only — not in production bundle)

## Next phase

Phase 5 — SEO + Discoverability. robots.txt, sitemap, expanded
schema.org JSON-LD, per-route meta tags. Pure autonomous work.
