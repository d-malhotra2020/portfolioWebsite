# Phase 4 — Context

**Phase:** A11y + Perf Audit Pass
**Goal:** Make the site demonstrably accessible (axe-core: zero
violations, keyboard usable, prefers-reduced-motion respected) and
maintain decent performance scores.

---

## Decisions locked

### Tooling

- **axe-core via Playwright** for the a11y audit. Same engine
  Lighthouse uses for its accessibility category. Local lighthouse-cli
  is blocked by Node x64 + Chrome arm64 architecture mismatch on
  Apple Silicon; PageSpeed Insights API is quota-locked without a
  user-provisioned key.
- Audit script committed at `scripts/audit-a11y.mjs` so future runs are
  one command.

### Coverage

- Audit 4 representative routes: homepage, /writing, one writing post
  (patch-vulnerability), one work deep-dive (smart-home). If those pass,
  the other 3 deep-dive posts share infrastructure and almost certainly
  pass too.

### Fix patterns

- **Clickable project cards:** stretched-link pattern (title becomes an
  `<a>` with `::before` covering the card; inner source/live anchors get
  z-index above). No `role` attribute on the `<article>` — avoids both
  `aria-allowed-role` and `nested-interactive` violations.
- **Heading order:** promote semantic-but-styled `<span>` "titles" to
  `<h3>`. CSS resets browser-default margins to maintain visual layout.
- **Code blocks:** `tabIndex={0}` + plain `aria-label` (no role) so
  multiple code blocks on one page don't collide as duplicate landmarks.
- **prefers-reduced-motion:** CSS media query collapses all animation
  and transition durations to 0.01ms; explicitly halts the body's
  drift animation.

### What's NOT in scope

- Full Lighthouse perf / best-practices / SEO scoring — blocked by
  local tooling. Deferred until Drew provisions a PSI API key or
  installs arm64 Node.
- Manual VoiceOver pass — out of scope for autonomous; Drew can do a
  5-min pass when convenient.
- Real-device mobile audit — that's Phase 11.

---

*Authored: 2026-05-23 during gsd-discuss-phase 4.*
