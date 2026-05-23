# Phase 7 — Context

**Phase:** Refresh Side-Project Deployments
**Goal:** Every linked Railway deployment actually does what it claims, or is removed from the site.

## Audit results (2026-05-23)

| Project | Status | Title rendered | Action |
|---|---|---|---|
| video-analytics | 200 | (empty) | Keep — likely OK, post-JS render |
| traffic-optimization | 200 | "Traffic Flow Optimization - Control Center" | Keep |
| donation-platform | **404 — DEAD** | (empty) | Drop `live` link; keep source + deep-dive |
| financial-analysis-tool | 200 | "Financial Analysis Dashboard" | Keep |
| smart-home-automation | 200 | "Smart Home Control" | Keep |

## Decisions

- **donation-platform:** Railway deployment is gone. The deep-dive page stays (it's a real architectural writeup that doesn't depend on a running demo). The source link stays (the code is on GitHub). Just drop the `live` link from the project card, work registry, and status board. Drew can revive the Railway deploy later if he wants the live demo back.
- **video-analytics empty title:** not enough signal to call broken. Keep until proven dead.
- **Other 3 projects:** clean. No action.

## Out of scope

- Reviving the donation-platform Railway deployment. That's Drew's call.
- Adding per-deployment landing-page intros. Would be a nice polish; deferred to a follow-up.
