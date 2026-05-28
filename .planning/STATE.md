# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-23)

**Core value:** A hiring manager who lands on the site walks away with a concrete, résumé-accurate read on Drew's engineering depth — and a frictionless path to start a conversation.
**Current focus:** Milestone v1.0 close-out (Phase 13 shipped 2026-05-27; Phases 6, 8, 11 remain blocked on external inputs — DEFERRED-DREW.md notes filed in each phase directory)

## Current Position

Phase: 11 of 13 autonomous-eligible phases shipped. Phase 13 (agent context expansion + prompt caching) shipped today. Phases 6, 8, 11 remain — each has a DEFERRED-DREW.md describing exact Drew-actions needed before autonomous mode can run them.
Plan: —
Status: Interview agent now cites 8 additional Brivo Jira tickets + 6 GitHub PR/repo entries, and prompt caching is enabled (cache hits verified — 6,005 cache_read tokens on second call). **Net cost per request drops once a 5-minute cache window has any traffic, despite the larger prompt.**
Last activity: 2026-05-27 — Autonomous run via `/gsd-autonomous`. **Phase 13 shipped end-to-end:** SYSTEM_PROMPT (in `workers/agent/src/index.js`) gained two new sections — "Additional Brivo Jira — supplementary named tickets" (8 EEPD entries) and "GitHub — shipped work" (5 private PRs + 1 public repo callout). Upstream API call's `system` field switched from bare-string to structured array with `cache_control: { type: 'ephemeral' }`. Worker re-deployed (`npx wrangler deploy`, version `a5b34d8e-93df-47a2-861b-3793849c9976`). Two verification curls confirmed (a) responses cite new content (e.g., "EENCloud/qalab-alertMonitor", "EEPD-117237"), and (b) cache hits are observable in SSE usage events. Commits `72076e0` (worker edit) + `fe076da` (planning artifacts). Sub-agent dispatched the plan + execute + verification cycle; orchestrator filed DEFERRED-DREW.md for Phases 6/8/11 documenting exactly what Drew needs to provide before each of those can run autonomously (LinkedIn recs / GA4 console clicks / real-device pass).

Previous activity: 2026-05-26 (continued, full session totaling ~8 hr across video-analytics rewrite + 8 portfolio improvements). After the OG infra landed, shipped five more deliverables — every one ended in `git push origin main` and a GitHub Pages auto-deploy:

1. **`/resume` page** (`src/components/Resume.jsx` + `src/lib/router.js` route, commit `00bf13f`) generated from `src/data/whoami.js`, the canonical source already feeding `/whoami`. Adds an `experience` block (Brivo + USN with full bullets), expands `projects` from 4 to 7, scrubs three more leftover fabricated claims that survived the polish playbook ("1.5M users · +25% retention" donation-platform, "94% prediction accuracy" financial-analysis, "30% energy savings" smart-home — all replaced with measured numbers). Print stylesheet (`@media print`) swaps to black-on-white, sets `@page` margins to 0.4in, appends full URLs after each link so a printed copy is self-contained. Verified clean 2-page Letter PDF via `page.pdf()`. **`sitemap.xml`** expanded from 1 URL to 13 (closes Phase 5 deferred GSC submission gap).

2. **Build-time syntax highlighting via Shiki** (commit `0e4129a`). Custom `scripts/vite-plugin-shiki.js` intercepts `?shiki` query imports of .md files, walks fenced ``` blocks, runs Shiki with the `vesper` theme (dark/muted, matches operator-terminal), rewrites lang tag from `python` → `shiki-python` with the body replaced by pre-tokenized HTML. `src/lib/markdown.jsx` detects `shiki-` and emits via `dangerouslySetInnerHTML`; unhighlighted blocks fall back to the original `<pre><code>` rendering. Bundle: +11 KB JS (highlighted HTML inlined into bundled markdown); Shiki itself (~2 MB) stays build-time only — zero browser cost.

3. **Two new longform posts** (commit `57fc154`). **The honesty playbook** (~7 min) — 5-step methodology for scrubbing fabricated metrics, with an ASCII table summarizing what each of the five projects claimed vs what the code actually did. **What a real video-analytics platform would actually need** (~6 min) — follow-up to the YOLOv8 benchmark, identifies four gaps (tracking, streaming pipeline, asymmetric error budgets, operational layer), maps each to a future session. Both get per-page OG meta + auto-generated 1200×630 PNGs; `sitemap.xml` updated.

4. **Interview-agent as Projects card #007 + deep-dive** (commit `fe0e526`). Adds the in-page chat dock (Cloudflare Worker + Anthropic API + SSE + KV rate limit + $10/mo cost breaker) as `Projects.jsx` card #007 "Interview Agent · this chatbot" with stats {Haiku 4.5, SSE, $10/mo, Cloudflare}. New `src/work/interview-agent.md` deep-dive — architecture diagram, key decisions (Workers over Lambda, SSE over WebSockets, Haiku over Sonnet, sliding-window over token-bucket, circuit breaker before dashboard cap). **CRITICAL FIX caught during the audit**: the agent's training data had the original fabricated metrics for all five side projects ("500+ streams", "94% accuracy", "1.5M users", "-30% energy") — recruiters chatting with the agent were being quoted those numbers back, undoing the polish playbook. Rewrote all six bullets with measured numbers, added an explicit anti-fabrication note ("If a user asks about a number not listed here, say 'I haven't measured that' — do not invent figures"), added a 7th bullet describing the agent itself. **Worker re-deployed via `wrangler deploy`** — version `7c7c9263`, live at `drew-agent.drewmalhotra.workers.dev`, HTTP 200 verified. Commit `96fbee3` followed up to escape the literal backticks inside the JS template-literal SYSTEM_PROMPT that initially broke the wrangler build.

State of the site post-session: 7 Projects.jsx cards, all clickable through to deep-dives (7/7); 3 writing posts; `/resume` route; per-page OG images for every route; build-time syntax highlighting in all code blocks; `sitemap.xml` with 13 URLs; agent training data and dashboard cards back the same measured numbers. The autonomous-eligible roadmap leftovers (Phase 1 OG, Phase 2 6/6 deep-dives, Phase 5 sitemap) are all closed.

Previous activity: 2026-05-26 — Shipped traffic-optimization deep-dive + per-page Open Graph metadata + images. The OG infra adds `scripts/prerender.js` (emits `dist/<kind>/<slug>/index.html` stubs with per-route og:* / twitter:* tags) and `scripts/build-og-images.js` (renders 1200×630 PNGs via Satori + @resvg/resvg-js — operator-terminal aesthetic, JetBrains Mono on #0a0a0c, green accent badge). Router refactored to use `history.pushState` so the URL bar shows `/work/<slug>` (no hash) — when users copy-paste the URL bar to share, the path-form URL hits the prerendered stub with route-specific OG. Portfolio commit `1f94fe3` + traffic-deep-dive `4183d30`.

Previous activity: 2026-05-26 — Shipped video-analytics rewrite end-to-end (~2 hr). The repo was the most flagrantly fabricated: previous code was `if random.random() < 0.1: append(fake_threat)` for "AI threat detection", hardcoded "92% threat correlation accuracy" log line, `for i in range(125)` mock streams for "500+ camera streams". Replaced wholesale with: (1) `scripts/run_benchmark.py` — runs YOLOv8n on 210-image stratified COCO val2017 sample, greedy-IoU-matches at 0.5, reports per-class precision/recall/F1 + density sweep; (2) `scripts/run_demo.py` — samples 12 frames from OpenCV's vtest.avi, saves annotated JPEGs; (3) aiohttp dashboard with operator-terminal styling, ~110 MB Railway image (no torch at runtime — inference offline + committed); (4) 15 pytest cases locking the IoU arithmetic. Measured: person F1=0.688 (drops 0.798→0.651 sparse→dense), vehicle F1=0.600. Diverged `~/projects/video-analytics/` twin retired to `.archived-video-analytics-2026-05-26`. Railway service re-linked from `~/separate-projects/` and deployed via `railway up`; live at video-analytics-production.up.railway.app. Portfolio updated: Projects.jsx card #001 (category CV·BENCHMARK, real F1 stats, deep-dive wired), StatusBoard.jsx note 'cloud · ai' → 'yolov8 · honest bench', src/work/video-analytics.md created (5th project deep-dive — Phase 2 leftover now satisfied), src/work/registry.js registers the new slug. Repo SHA `9dc2656`, portfolio SHA `cb1b773`. Resume point in `~/separate-projects/video-analytics/NEXT-SESSION.md`.

Previous activity: 2026-05-25 — Shipped donation-platform end-to-end across two contiguous sessions (~5 hr total). Slice 1 = real PyTorch two-tower + 5 baselines benchmarked on 3K real ProPublica orgs + 8K synthetic users + 113K events; reproducible via `make bench` in ~1.5 min. Three presentation tiers: (1) raw-PNG plots inline in `src/work/donation-platform.md` + measured stats on Projects.jsx card #003 (NDCG@10 5.7× random, 1.9× popularity, 99% catalog coverage); (2) static benchmark report on GitHub Pages at d-malhotra2020.github.io/donation-platform; (3) live FastAPI operator console at donation-platform-production-c8e0.up.railway.app — pick a synthetic user → see top-10 real-org recommendations with synthesized reasons. Donation-platform back on StatusBoard.jsx (removed in Phase 7). Resume point + menu of next moves captured in `~/separate-projects/donation-platform/NEXT-SESSION.md`.

Progress: [█████████░] 85% (Phases 0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13 complete of 13; 6, 8, 11 deferred on Drew-actions with DEFERRED-DREW.md filed)

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

Last session: 2026-05-24 (continuation — side-project polish night)
Stopped at: 10/12 milestone phases shipped (portfolio) + smart-home Option C live + traffic-optimization full overhaul live.

### 2026-05-24 session in one paragraph

Shipped Option C on smart-home-automation (operator-terminal restyle of `app/templates/index.html` + real paho-mqtt Mosquitto round-trip + graceful sim-mode degradation + `/api/broker/status` route + `// system reality` footer that flips dynamically; Mosquitto sidecar shipped via `docker-compose.yml` + `mosquitto/Dockerfile` for local; live and verified at smart-home-automation-production.up.railway.app). Then did the same playbook on traffic-optimization, much bigger scope: replaced random 5-city/3000+/94% fabrication with **664 real OSM signalized intersections in downtown SF** (Overpass API one-shot, snapshot at `data/sf_intersections.json`, regenerable via `scripts/fetch_osm.py`), built a Poisson-arrival corridor microsim that measures the rule-based optimizer vs fixed-time baseline (40 trials × 30 min sim, **+18.2% throughput, -10.8% wait**, reproducible seeds, persisted to `data/bench_results.json`), added an arrival-rate sweep showing the optimizer hurts at light load and wins at moderate-to-heavy (honest non-monotonic curve), rendered all 664 OSM dots as an SVG map in the dashboard with bbox/scale-bar/compass, refactored `ml_models/` to admit it's heuristics (was claiming "Ensemble Random Forest + LSTM" with `model_accuracy = 0.94` hardcoded), added 10 pytest tests, GitHub Actions CI. Hit Railway deploy hell along the way — wrong service URL, dead GitHub webhook, `${PORT}` literal-string bug, overly aggressive healthcheck timeout — all diagnosed and fixed; live at traffic-optimization-production.up.railway.app. Finally updated drewmalhotra.com `Projects.jsx` card #002 and `StatusBoard.jsx` to point at the right URL with honest stats.

### Next-session entry points

- **Portfolio (this repo):** `/gsd-autonomous` still halts cleanly on Phases 6, 8, 11 — no new unblockers landed tonight.
- **video-analytics:** Done. Live at video-analytics-production.up.railway.app, latest deploy via `railway up` from `~/separate-projects/video-analytics/` (commit `9dc2656`). Auto-deploy on push isn't wired — future commits need an explicit `railway up` until the GitHub repo is connected via the Railway dashboard. Follow-ups in `~/separate-projects/video-analytics/NEXT-SESSION.md` (1-hour: ByteTrack tracking; half-day: full COCO sample or MOT17 second clip).
- **traffic-optimization:** Done for now. Latest deploy = commit `63aa9d5` (dropped healthcheckTimeout). Future pushes auto-deploy via the reconnected webhook. Possible follow-ups: cross-link from drewmalhotra.com work page (no deep-dive markdown yet — `src/work/` has 5 of 6 projects, traffic-optimization is the one remaining hole, was excluded last time as it didn't yet have a measurement story but now it does), or expand sweep to more arrival rates.
- **smart-home-automation:** Drew-action only — add a Mosquitto sidecar service in Railway dashboard pointing at the `mosquitto/` Dockerfile, enable private networking, set `MQTT_HOST=<internal>.railway.internal` on the Flask service env vars. Broker pip flips green automatically. README has the step-by-step.
- **Side-project queue is empty.** Only `qa-webhook-server` (orphaned, no remote, never deployed) remains undecided. All 5 polished projects have honest measurements + Railway deploys + portfolio cards + deep-dives.

### Drew-actions waiting (consolidated, updated 2026-05-24)

1. **Anthropic dashboard:** $10/mo monthly cap + email alerts at $5 / $9 (Phase 10 SC, still open).
2. **Google Search Console:** submit `https://drewmalhotra.com/sitemap.xml` (Phase 5, still open).
3. **Cloudflare Analytics Engine:** enable in dashboard, uncomment `[[analytics_engine_datasets]]` in `workers/agent/wrangler.toml`, deploy (unblocks portfolio Phase 8).
4. **LinkedIn recs:** 2-3 from ex-colleagues (unblocks portfolio Phase 6).
5. **smart-home Mosquitto sidecar:** add as a second Railway service from this repo's `mosquitto/` directory; set env vars on the Flask service.
6. **Diverged repos:** `~/projects/<project>/` April Railway variants still un-pushed.

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
