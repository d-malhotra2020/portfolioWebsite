# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-23)

**Core value:** A hiring manager who lands on the site walks away with a concrete, résumé-accurate read on Drew's engineering depth — and a frictionless path to start a conversation.
**Current focus:** Phase 2 — Per-Project Deep-Dive Pages

## Current Position

Phase: 2 of 12 (Per-Project Deep-Dive Pages)
Plan: 0 of 3 in current phase
Status: Ready to discuss
Last activity: 2026-05-23 — Shipped Phase 1 (PATCH case study live at drewmalhotra.com/#/writing/patch-vulnerability) via GH Actions deploy.

Progress: [██░░░░░░░░] 17% (Phase 0 + Phase 1 complete of 12)

## Performance Metrics

**Velocity:**
- Total plans completed: 12 (Phase 0: 8, Phase 1: 4)
- Average duration: ~22 min/plan
- Total execution time: ~4.3 hours (today's session)

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 0. Foundation | 8 | ~3.5h | ~26 min |
| 1. PATCH Case Study | 4 | ~45m | ~11 min |

**Recent Trend:**
- Last 5 plans: writing infrastructure, post draft, cross-links + nav, deploy, state close-out
- Trend: Improving (infrastructure built once accelerates content phases)

## Accumulated Context

### Decisions

Recent decisions affecting current work:

- [Phase 1]: Hash routing over a router library (no new deps, GH Pages compatible)
- [Phase 1]: Own the markdown renderer (~150 lines) over `marked`/`remark` (no security surface from third-party plugins)
- [Phase 1]: Per-post OG images deferred until prerender / runtime OG worker exists
- [Phase 0]: Operator-console aesthetic, Cloudflare Worker for agent, GH Actions deploy flow

### Pending Todos

- Drew should read the live PATCH case study and revise anything that doesn't sound like his voice. Source at `src/writing/patch-vulnerability.md`.

### Blockers/Concerns

- [Phase 6]: Trust section gated on Drew collecting 3–5 LinkedIn recommendations.
- [Phase 10]: Drew needs to set a monthly Anthropic spend ceiling. Default recommendation: $25/mo.
- [Phase 11]: Real-device test pass needs Drew's iOS + Android.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| OG images | Per-post social previews — needs prerender or runtime OG worker | Open | 2026-05-23 (Phase 1) |
| Lighthouse | Perf score on the post page — not measured, deferred to Phase 4 | Open | 2026-05-23 (Phase 1) |

## Session Continuity

Last session: 2026-05-23 15:25
Stopped at: Phase 1 shipped + verified live. Ready to advance to Phase 2 (Per-Project Deep-Dive Pages).
Resume file: None
