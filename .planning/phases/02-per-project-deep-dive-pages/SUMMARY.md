# Phase 2 — Summary

**Phase:** Per-Project Deep-Dive Pages
**Shipped:** 2026-05-23
**Commit:** ddae38e

## Shipped

- 4 per-project deep-dive pages at `#/work/<slug>`:
  - `donation-platform` — embedding cache, offline-train/online-serve, cosine over learning-to-rank
  - `financial-analysis` — PostgreSQL hypertables, statistical + ML ensemble, FastAPI, backtest harness
  - `smart-home` — local-first, MQTT over HTTP per device, Flask over FastAPI, offline voice
  - `this-portfolio` — hash routing, Cloudflare Worker agent, LLM-augmented build, aesthetic decision
- `/work/<slug>` route + `WorkPost.jsx` component (reuses `lib/markdown` + writing-shell styles)
- `src/work/registry.js` — 4-entry registry, parallel to `src/writing/registry.js`
- Homepage cards: clickable + role="link" + keyboard-focusable for the 4 deep-dive projects
- Inline `source` / `live` anchors stop propagation so they still open in new tabs without triggering card navigation
- "read the deep-dive →" hint added to clickable cards (cyan, mono, slides right on hover)
- Skipped projects (#001 Video Surveillance Analytics, #002 Traffic Flow Optimization) intentionally not deep-dived — too close to current/recent employment, NDA edge cases

## Success criteria

1. ✅ Routes exist at `/work/[slug]` for the 4 in-scope projects (#001 / #002 skipped per discuss-phase decision)
2. ✅ Each page has architecture (ASCII diagram), key decisions with tradeoffs, what-I'd-do-differently, stack + links
3. ✅ Homepage project cards link to deep-dive (full card clickable); source + live still reachable as inline anchors
4. ⚠️ Per-page load <1.5s — not measured this phase, deferred to Phase 4 (A11y + Perf Audit)

## Deferred to follow-up

- **Video / animated diagrams.** Static ASCII art ships today; richer media is a Phase 4+ follow-up if it earns it.
- **Per-page Lighthouse.** Phase 4 (A11y + Perf) will measure all routes.
- **Per-post OG images.** Same SPA prerender constraint as Phase 1.
- **Drew's voice review.** All 4 posts drafted by Claude using the architecture-decisions framing from CONTEXT.md and the technical detail from the résumé. Drew should read and revise — source files at `src/work/*.md`.

## Decisions logged

- Reused Phase 1 writing infrastructure (markdown renderer + hash router + writing-shell styles). No new libraries.
- ASCII diagrams over generated images — keeps content authorable in markdown, sidesteps OG image problem.
- Card clickability via div + role="link" rather than wrapping in `<a>` — avoids nested-anchor invalid HTML with source/live inline.

## Metrics

- Lines of code added: ~900 (4 markdown posts + WorkPost + registry + Projects edits + CSS)
- Bundle delta: +27 KB raw / +9 KB gzipped (much of this is the 4 markdown bodies imported as strings)
- Plans completed: 3 of 3
- Wall-clock time: ~50 min

## Next phase

Phase 3 — Agent Leveling-Up. Pure technical work: KV-backed per-IP rate limiting, hot-lead detection regex + Slack/email webhook, per-conversation cost telemetry. No Drew-prose dependency — Claude can drive end-to-end except for the Slack webhook URL (blocker — Drew needs to provide it or skip notifications).
