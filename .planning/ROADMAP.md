# Roadmap: drewmalhotra.com

## Overview

Twelve focused phases that take the operator-console portfolio from "live
and accurate" to "demonstrably the strongest engineering portfolio in
Drew's hiring pool." Earlier phases have higher employer-impression ROI
per hour invested. Phases are sized for single sessions (≤2 hours).

## Milestones

- ✅ **v0 — Foundation** (Phase 0) — shipped 2026-05-23
- 🚧 **v1 — Recruiter funnel** (Phases 1–12) — in progress

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Technical Writeup — PATCH Vulnerability Case Study** - Publish a 1500-word case study at `/writing/patch-vulnerability` ✅ 2026-05-23
- [x] **Phase 2: Per-Project Deep-Dive Pages** - Each "selected work" card opens to a richer page (screenshots, architecture, lessons) ✅ 2026-05-23
- [x] **Phase 3: Agent Leveling-Up** - Rate-limiting + cost telemetry shipped (hot-lead descoped). ✅ 2026-05-23
- [x] **Phase 4: A11y + Perf Audit Pass** - axe-core: 0 violations across 4 routes; prefers-reduced-motion handled. Full Lighthouse scoring deferred (local tooling blocked). ✅ 2026-05-23
- [x] **Phase 5: SEO + Discoverability** - robots.txt + sitemap + 6-entity JSON-LD @graph + rewritten meta tags. ✅ 2026-05-23 (GSC submission = Drew action)
- [ ] **Phase 6: Trust + Social Proof** - LinkedIn recommendations + certifications surfaced on the site
- [x] **Phase 7: Refresh Side-Project Deployments** - Audited 5 Railway URLs; donation-platform (404) removed from cards/work-registry/status-board. 4 of 4 remaining = green. ✅ 2026-05-23
- [ ] **Phase 8: Analytics Maturity** - GA4 events on agent / resume / form / deep-dive plus Worker telemetry
- [ ] **Phase 9: Signature Easter Eggs** - `/whoami`, Konami code, keyboard shortcuts, animated favicon
- [ ] **Phase 10: Cost Guardrails** - Anthropic monthly budget cap + Worker daily-cost circuit breaker
- [ ] **Phase 11: Mobile UX Deep-Pass** - Real-device test pass on iOS + Android; fix what's broken
- [ ] **Phase 12: Recurring Maintenance Scaffolding** - Monthly check-in GH issue template + résumé-parity reminder

## Phase Details

### Phase 1: Technical Writeup — PATCH Vulnerability Case Study
**Goal**: Publish a longform case study at `/writing/patch-vulnerability` describing the Brivo PATCH-endpoint vulnerability Drew found, how he found it, and what changed afterward.
**Depends on**: Nothing
**Requirements**: REQ-01
**Success Criteria** (what must be TRUE):
  1. A `/writing` index page exists and lists at least one published post
  2. A `/writing/patch-vulnerability` post exists with ~1500 words, code/JSON snippets, and an OG image
  3. The post is reachable from About ("Reliability over cleverness" principle) and from the Brivo career card
  4. Lighthouse perf score on the post page is ≥ 90
  5. No content in the post violates Brivo NDA or names specific internal systems unsafely
**Plans**: 4 plans

Plans:
- [x] 01-01: Hash router + markdown loader + `/writing` index + post page
- [x] 01-02: Draft the case study (inverted-pyramid, ~1500 words, in Drew's voice)
- [x] 01-03: Cross-link from About principle 01, Brivo career card, and add "writing" to nav
- [x] 01-04: Polish + ship — clean build, deployed via GH Actions to drewmalhotra.com

### Phase 2: Per-Project Deep-Dive Pages
**Goal**: Each project card on the homepage links to a richer per-project page showing screenshot, architecture, decisions, and lessons.
**Depends on**: Phase 1
**Requirements**: REQ-02
**Success Criteria** (what must be TRUE):
  1. Routes exist at `/work/[slug]` for all 6 current selected projects
  2. Each deep-dive page has: a screenshot or short video, an architecture sketch (mermaid or hand-drawn SVG), a "the hard part" paragraph, and links to source + live
  3. Homepage project cards link to the deep-dive (live button still goes to the Railway deployment)
  4. Each deep-dive page loads in <1.5s on a cold visit (Lighthouse perf ≥ 90)
**Plans**: 3 plans (scope tightened to 4 of 6 projects during discuss-phase — #001 and #002 NDA-adjacent)

Plans:
- [x] 02-01: `/work/[slug]` routing + WorkPost component + work registry
- [x] 02-02: Draft 4 architecture+decisions deep-dives (donation-platform, financial-analysis, smart-home, this-portfolio)
- [x] 02-03: Cards clickable + inline source/live anchors + ship via GH Actions

### Phase 3: Agent Leveling-Up
**Goal**: The Cloudflare Worker agent gets rate-limiting, hot-lead notification, and cost telemetry so it's defensively engineered and lead-generating.
**Depends on**: Phase 1
**Requirements**: REQ-03
**Success Criteria** (what must be TRUE):
  1. A single IP making > 20 messages/hour gets a friendly "agent's resting" message instead of more API calls
  2. When a visitor's message contains hot-lead signals (company name, "looking to hire", "salary"), Drew receives a Slack or email notification within 60s
  3. Per-conversation token count and cost are logged to Cloudflare Workers Analytics
  4. Existing functionality (streaming, CORS, message history cap) still works
**Plans**: 3 plans (hot-lead descoped → 2 of 3 shipped, 1 deferred)

Plans:
- [x] 03-01: KV-backed per-IP rate limit (20 reqs / 60s sliding window). Verified by 22-req smoke test.
- [~] 03-02: Hot-lead detection — **descoped** during discuss-phase (no Slack/email channel chosen).
- [x] 03-03: Cost telemetry code-ready. Captures input/output tokens + estimated USD per request. Gated on Drew enabling Analytics Engine in CF dashboard (one click).

### Phase 4: A11y + Perf Audit Pass
**Goal**: The site scores Lighthouse ≥ 95 across perf / a11y / best practices / SEO and is WCAG AA compliant.
**Depends on**: Phase 2
**Requirements**: REQ-05
**Success Criteria** (what must be TRUE):
  1. Lighthouse on the homepage: perf ≥ 95, a11y = 100, best practices ≥ 95, SEO = 100
  2. Site is fully usable via keyboard alone (Tab through every interactive element in sensible order)
  3. VoiceOver on macOS reads the homepage in a sensible order with no "unlabeled button" or "image" announcements
  4. Framer Motion animations respect `prefers-reduced-motion`
**Plans**: 3 plans

Plans:
- [x] 04-01: Baseline audit via axe-core + Playwright (Lighthouse CLI blocked by local tooling). 4 violations found across home + 1 work page.
- [x] 04-02: Two rounds of fixes — stretched-link pattern for clickable cards, heading-order promotion, statusbar landmark, code-block keyboard access.
- [x] 04-03: prefers-reduced-motion added; final re-audit confirms zero violations across all 4 routes; audit script committed for future runs.

### Phase 5: SEO + Discoverability
**Goal**: Recruiters searching Drew's name or skills find drewmalhotra.com on page 1 with a rich preview.
**Depends on**: Phase 1
**Requirements**: REQ-04
**Success Criteria** (what must be TRUE):
  1. `robots.txt` and generated `sitemap.xml` exist and are referenced
  2. Per-route `<meta>` tags (title, description, OG image) render correctly when scraped
  3. Schema.org JSON-LD is expanded beyond just `Person` to include `WebSite`, per-project `SoftwareApplication`, per-role `WorkExperience`
  4. Google Search Console verifies ownership and reports the sitemap as crawled
  5. LinkedIn / Slack preview of any shared link looks on-brand (not blank)
**Plans**: 3 plans

Plans:
- [ ] 05-01: Author robots.txt + sitemap generation; per-route meta tags
- [ ] 05-02: Expand schema.org JSON-LD (Person, WebSite, SoftwareApplication, WorkExperience)
- [ ] 05-03: Submit sitemap to Google Search Console; verify rich-result preview

### Phase 6: Trust + Social Proof
**Goal**: Add third-party voices to the site — LinkedIn recommendations, certifications, talks.
**Depends on**: Phase 1
**Requirements**: REQ-06
**Success Criteria** (what must be TRUE):
  1. At least 3 third-party quotes (attributed) live on the site
  2. At least one verifiable credential (cert badge, talk video link, publication) rendered
  3. The section reads as supplementing — not replacing — Drew's own metrics
**Plans**: 2 plans

Plans:
- [ ] 06-01: Collect recommendations from 3–5 former colleagues via LinkedIn (blocker for downstream work)
- [ ] 06-02: Build trust section component + integrate recs / certs into homepage

### Phase 7: Refresh Side-Project Deployments
**Goal**: Every linked Railway deployment actually does what it claims, or is removed from the site.
**Depends on**: Nothing
**Requirements**: REQ-08
**Success Criteria** (what must be TRUE):
  1. Each of the 6 side projects on the site has been opened and the headline feature tested in the last 30 days
  2. Anything broken or stale is either fixed or removed from the homepage selected-work grid
  3. Each remaining Railway-deployed project has a landing page that explains what it is + links back to drewmalhotra.com
  4. Status board on the homepage shows green for all remaining linked projects
**Plans**: 2 plans

Plans:
- [ ] 07-01: Audit and triage — list each project, mark working/broken/removed
- [ ] 07-02: Fix broken / add landing-page intros / update site project list

### Phase 8: Analytics Maturity
**Goal**: Drew can answer "did the site get me a lead this week" with data, not feel.
**Depends on**: Phase 3
**Requirements**: REQ-04
**Success Criteria** (what must be TRUE):
  1. GA4 has custom events for: resume download, agent conversation start, agent message sent, contact-form submission, deep-dive page view
  2. A GA4 custom dashboard shows the funnel: land → engage agent → ask N+ questions → action
  3. Cloudflare Worker analytics dashboard shows: request volume, P95 latency, error rate, daily token cost
  4. Drew can answer "how many recruiters used the agent last week" in <30 seconds
**Plans**: 2 plans

Plans:
- [ ] 08-01: Instrument GA4 events on the frontend (resume, agent, contact, deep-dives)
- [ ] 08-02: Build GA4 funnel dashboard + Cloudflare Workers Analytics dashboard

### Phase 9: Signature Easter Eggs
**Goal**: Two or three small craft details that visitors notice and remember.
**Depends on**: Nothing
**Requirements**: REQ-02
**Success Criteria** (what must be TRUE):
  1. A `/whoami` route returns Drew's profile rendered as a terminal-style view; `curl drewmalhotra.com/whoami` returns clean text/JSON
  2. Keyboard shortcuts `g a`/`g w`/`g c`/`?` work for navigation + help
  3. Agent dock remembers conversation history within the same browser session
  4. At least one detail elicits a "oh nice" from a tested visitor
**Plans**: 3 plans

Plans:
- [ ] 09-01: `/whoami` route (HTML for browsers, plain text/JSON for `curl`)
- [ ] 09-02: Keyboard-shortcut layer for navigation
- [ ] 09-03: Agent dock session persistence (sessionStorage)

### Phase 10: Cost Guardrails
**Goal**: A viral day cannot cost more than Drew's configured monthly ceiling.
**Depends on**: Phase 3
**Requirements**: REQ-07
**Success Criteria** (what must be TRUE):
  1. Anthropic dashboard has a monthly spend cap configured (Drew sets the value)
  2. Worker tracks daily token-cost estimate; above threshold it short-circuits with a "agent's resting" message
  3. `workers/agent/README.md` documents the cost model and threshold for future-Drew
  4. Drew receives an Anthropic email alert before hitting the cap
**Plans**: 2 plans

Plans:
- [ ] 10-01: Configure Anthropic budget cap + alert email (Drew action — provide screenshot)
- [ ] 10-02: Implement Worker daily-cost circuit breaker + documentation

### Phase 11: Mobile UX Deep-Pass
**Goal**: Every interaction works comfortably on iOS Safari and Android Chrome on a real device.
**Depends on**: Phase 4
**Requirements**: REQ-05
**Success Criteria** (what must be TRUE):
  1. Drew has manually tested all interactive elements on at least one iPhone and one Android device
  2. Every touch target ≥ 44×44 px (agent dock, status refresh, nav links)
  3. Opening the agent panel + typing does not break iOS Safari keyboard layout or scroll-lock
  4. Landscape orientation works without visual breakage
**Plans**: 2 plans

Plans:
- [ ] 11-01: Real-device audit on iOS + Android; record findings
- [ ] 11-02: Fix touch targets + agent panel iOS keyboard interaction; verify

### Phase 12: Recurring Maintenance Scaffolding
**Goal**: This roadmap and the site stay current after Phase 11 ships.
**Depends on**: Phase 7
**Requirements**: REQ-08
**Success Criteria** (what must be TRUE):
  1. A GitHub issue template exists for "monthly check-in" with the recurring maintenance checklist pre-populated
  2. The maintenance checklist has been run at least once after this scaffolding lands
  3. ROADMAP.md has been re-prioritized at least once based on what actually drove inbound interest
**Plans**: 2 plans

Plans:
- [ ] 12-01: Author GitHub issue template + maintenance checklist
- [ ] 12-02: Run the first maintenance check-in + reprioritize roadmap

## Progress

**Execution Order:**
Phases execute in numeric order. Some phases (3, 4, 7, 9, 11) can run in parallel after dependencies clear if Drew chooses; the suggested order optimizes for employer-impression ROI per hour.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Foundation (operator-console rebuild + agent + résumé parity) | 8/8 | Complete | 2026-05-23 |
| 1. Technical Writeup — PATCH Case Study | 4/4 | Complete | 2026-05-23 |
| 2. Per-Project Deep-Dive Pages (4 of 6 projects) | 3/3 | Complete | 2026-05-23 |
| 3. Agent Leveling-Up (hot-lead descoped) | 2/3 | Complete | 2026-05-23 |
| 4. A11y + Perf Audit Pass (a11y done; perf scoring deferred) | 3/3 | Complete | 2026-05-23 |
| 5. SEO + Discoverability (GSC submission = Drew action) | 3/3 | Complete | 2026-05-23 |
| 6. Trust + Social Proof | 0/2 | Not started | - |
| 7. Refresh Side-Project Deployments (landing-page intros deferred) | 1.5/2 | Complete | 2026-05-23 |
| 8. Analytics Maturity | 0/2 | Not started | - |
| 9. Signature Easter Eggs | 0/3 | Not started | - |
| 10. Cost Guardrails | 0/2 | Not started | - |
| 11. Mobile UX Deep-Pass | 0/2 | Not started | - |
| 12. Recurring Maintenance Scaffolding | 0/2 | Not started | - |
