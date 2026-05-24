# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-23)

**Core value:** A hiring manager who lands on the site walks away with a concrete, résumé-accurate read on Drew's engineering depth — and a frictionless path to start a conversation.
**Current focus:** Milestone v1.0 close-out (Phases 6, 8, 11 blocked on external inputs — held for follow-up milestone)

## Current Position

Phase: All autonomous-eligible phases shipped (10 of 12). Phases 6, 8, 11 remain in the milestone but each blocks on external inputs Drew controls. Roadmap reprioritized in Phase 12: 6 → 8 → 11 once those blockers clear.
Plan: —
Status: Autonomous milestone work complete. Drew-actions pending (deploy, dashboard caps, LinkedIn recs) tracked below.
Last activity: 2026-05-23 — Shipped Phase 12 (monthly check-in GH issue template + first-run + roadmap reprioritize).

Progress: [█████████░] 83% (Phases 0, 1, 2, 3, 4, 5, 7, 9, 10, 12 complete of 12; 6, 8, 11 deferred on Drew-actions)

## Phases shipped today

1. ✅ Phase 0 — Foundation (operator-console rebuild, agent dock, CF Worker, résumé reconciliation, LLM-tooling visibility)
2. ✅ Phase 1 — PATCH Vulnerability Case Study (longform writing infrastructure + first post)
3. ✅ Phase 2 — Per-project Deep-Dive Pages (4 of 6 projects, stretched-link card pattern)
4. ✅ Phase 3 — Agent Leveling-Up (KV rate limit + cost telemetry code-ready; hot-lead descoped)
5. ✅ Phase 4 — A11y Pass (axe-core: 0 violations, prefers-reduced-motion handled)
6. ✅ Phase 5 — SEO + Discoverability (robots.txt + sitemap + 6-entity JSON-LD @graph + meta rewrite)
7. ✅ Phase 7 — Refresh Side-Project Deployments (donation-platform 404 removed from site)
8. ✅ Phase 9 — Signature Easter Eggs (`/whoami` route + leader-key shortcuts + AgentDock sessionStorage)
9. ✅ Phase 10 — Cost Guardrails (Worker daily-cost circuit breaker; `wrangler deploy` + Anthropic dashboard click = Drew actions)
10. ✅ Phase 12 — Recurring Maintenance Scaffolding (`.github/ISSUE_TEMPLATE/monthly-checkin.md` + first-run walkthrough + roadmap reprioritize 6 → 8 → 11)

## Phases remaining (post-Phase-12 reprioritize, order 6 → 8 → 11)

| Phase | Status | Blocker |
|---|---|---|
| 6. Trust + Social Proof | 🟡 | Ask 2-3 former colleagues for LinkedIn recs — highest-leverage unblocker |
| 8. Analytics Maturity | 🟡 | Enable CF Analytics Engine + GA4 events — meaningful once real traffic flows |
| 11. Mobile UX Deep-Pass | 🟡 | Real iOS + Android devices (lower priority — desktop/responsive surface already strong) |

## Drew actions waiting

- **Deploy Phase 10 Worker** — `cd workers/agent && npx wrangler deploy` to push the daily-cost circuit breaker live.
- **Set Anthropic dashboard $10/mo spend cap** — console.anthropic.com/settings/billing → spend limits → $10 monthly cap + email alerts at $5 and $9. (Phase 10 SC #1 + #4)
- **Read 5 longform posts on the live site** (PATCH case study + 4 deep-dives) — flag anything off-voice. Source files at `src/writing/*.md` and `src/work/*.md`.
- **Submit sitemap to Google Search Console** — see Phase 5 SUMMARY.
- **Enable Cloudflare Workers Analytics Engine** in CF dashboard (one click) — then uncomment the `[[analytics_engine_datasets]]` block in `workers/agent/wrangler.toml` and `npx wrangler deploy`. Cost telemetry starts flowing.
- **Optional:** revive donation-platform Railway deployment if you want the live demo link back.

## Deferred items (full list)

| Category | Item | Open since |
|---|---|---|
| OG images | Per-post + per-work social previews — needs prerender or runtime OG worker | Phase 1 |
| Full Lighthouse | Perf / BP / SEO scoring — local tooling blocked | Phase 4 |
| VoiceOver | Manual screen-reader pass | Phase 4 |
| Voice review | Drew reads all longform posts | Phase 1 + 2 |
| Hot-lead alerts | Agent notification when recruiter starts a chat | Phase 3 (descoped) |
| GSC | Submit sitemap, verify rich-result preview | Phase 5 |
| Landing-page intros | Per-deployment "what is this" page | Phase 7 |

## Session Continuity

Last session: 2026-05-23 (long single session, ~11 hours wall-clock)
Stopped at: 10/12 milestone phases shipped + extended into side-project work.

### Tonight's full session in one paragraph

Shipped Phase 9 (Signature Easter Eggs: `/whoami` route + leader-key shortcuts +
AgentDock sessionStorage) and Phase 10 (Worker daily-cost circuit breaker at
$0.333/day = $10/mo budget, Anthropic dashboard runbook, Cost guardrails docs)
on drewmalhotra.com. Pushed both to prod + deployed the Worker live. Expanded
agent training data with 12 named Brivo project bullets from `~/Desktop/resume-bullets.md`
(the agent now answers "what did you actually build at Brivo?" with specific
project names like Synthetic Monitoring Framework, GRACE, the 15× P99 SLA
report, etc.). Closed Phase 12 (monthly check-in GH issue template + first
roadmap reprioritize). Then extended beyond the portfolio milestone to polish
two side projects: financial-analysis-tool got a full operator-terminal restyle
(Geist Sans + JetBrains Mono on `#0a0a0c`, default SPY candlestick chart,
scrolling ticker tape, status bar with live clock) AND a real backtest harness
(49.5% honest next-day-direction accuracy on 1,990 predictions over 12 months
across 10 large caps — replaced the unbacktested "94% accuracy" claim with
real numbers in the UI and README). Deploy is Dockerfile-based on Railway,
no more committed build artifacts. Surveyed smart-home-automation and chose
Option C (full overhaul with real Mosquitto broker) for next session.

### Next-session entry points

- **Portfolio (this repo):** `/gsd-autonomous` will halt cleanly — Phases 6, 8,
  11 remain in the milestone but all block on external Drew-actions (LinkedIn
  recs, GA4/AE access, real iOS/Android devices). Resume when any unblocks.
- **smart-home-automation (next side project):** Open
  `~/separate-projects/smart-home-automation/NEXT-SESSION.md` — it contains
  the Option C plan (operator-terminal restyle + UX streamline + real
  Mosquitto MQTT broker so the work-page manifesto is true). ~3 hours of work,
  same playbook as financial-analysis-tool.
- **Other side projects on the queue:** traffic-optimization, video-analytics
  (both need per-project deep-dive pages here too — Phase 2 leftover), and
  `qa-webhook-server` (lives only at `~/projects/`, no remote, decision needed
  on whether to surface or retire).

### Drew-actions waiting (consolidated)

1. **Anthropic dashboard:** set $10/mo monthly cap + email alerts at $5 / $9
   (Phase 10 SC #1 + #4).
2. **Google Search Console:** submit `https://drewmalhotra.com/sitemap.xml`
   (Phase 5 deferred).
3. **Cloudflare Analytics Engine:** enable in dashboard, then uncomment the
   `[[analytics_engine_datasets]]` block in `workers/agent/wrangler.toml` and
   `npx wrangler deploy` from `workers/agent/`. Unblocks Phase 8.
4. **LinkedIn recs:** ask 2–3 former Brivo / Yunex / Givelify colleagues.
   Unblocks Phase 6.
5. **Diverged repos:** `~/projects/<project>/` April Railway variants are
   still un-pushed. Either retire them or sync into `~/separate-projects/<project>/`.

Resume file: `~/separate-projects/smart-home-automation/NEXT-SESSION.md`
Next session prompt: `cat ~/separate-projects/smart-home-automation/NEXT-SESSION.md` then resume work directly, or hit the AskUserQuestion lane and pick a project.
