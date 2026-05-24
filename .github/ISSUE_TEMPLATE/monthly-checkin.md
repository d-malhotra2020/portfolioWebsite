---
name: Monthly site check-in
about: Recurring 30-min checklist that keeps drewmalhotra.com current. Open one per month on or near the 1st.
title: "Monthly check-in — YYYY-MM"
labels: maintenance
---

**Target time:** ~30 minutes. Skip any block that's irrelevant this month.

## 1. Content freshness (5 min)

- [ ] About / Career dates still accurate (current month falls inside the current role's window).
- [ ] Current employer + role still correct in `src/components/Hero.jsx`, `src/components/About.jsx`, `src/data/whoami.js`, and the agent system prompt at `workers/agent/src/index.js`.
- [ ] Any new side projects to surface? (Add to `src/components/Projects.jsx` + `src/data/whoami.js` if so.)
- [ ] `public/Dhruv_malhotra_resume.pdf` matches the current résumé draft. If outdated, replace + reconcile against `src/data/whoami.js` and the agent system prompt.
- [ ] `npm run build` passes locally.

## 2. Agent health (5 min)

- [ ] `curl -I https://drewmalhotra.com/` returns 200.
- [ ] `curl -X POST <worker-url> -H 'Content-Type: application/json' --data '{"messages":[{"role":"user","content":"hi"}]}'` returns a coherent SSE response (Anthropic API key is still valid + worker is deployed).
- [ ] Anthropic dashboard MTD spend vs the $10/mo cap. If >50%, investigate. (Settings → Billing → Usage.)
- [ ] Cloudflare Analytics Engine query: any `cost_capped` events in the last 30 days? Any `upstream_error` clusters? (See `workers/agent/README.md` § Cost guardrails for query examples.)
- [ ] Rotate the Anthropic API key if it's been >6 months since the last rotation. (`wrangler secret put ANTHROPIC_API_KEY`.)

## 3. Discoverability (5 min)

- [ ] Google "Drew Malhotra SDET Austin" — drewmalhotra.com is on page 1.
- [ ] Google Search Console — any new crawl errors? Coverage status: indexed?
- [ ] `curl -I https://drewmalhotra.com/robots.txt` returns 200 with the right body.
- [ ] `curl -I https://drewmalhotra.com/sitemap.xml` returns 200.

## 4. Engagement signal (5 min)

- [ ] Cloudflare Analytics Engine — unique IPs hitting the agent in the last 30 days.
- [ ] Skim chat outliers — long conversations, hot-lead vocabulary ("salary," "offer," "interview," "relocation"), failed turns. Note anything actionable in `.planning/STATE.md` § "Drew actions waiting."
- [ ] Any new contact-form submissions or direct emails worth folding into roadmap thinking?

## 5. Roadmap reprioritize (10 min)

- [ ] Re-read `.planning/ROADMAP.md` "Phases remaining."
- [ ] For each remaining / not-shipped phase, ask: "Did the last 30 days move this closer or further?"
  - Closer → promote (move up in priority order).
  - Further → demote (move down or backlog).
  - Irrelevant now → delete (with a note in the commit message explaining why).
- [ ] Update STATE.md "Current Position" + "Phases remaining" to match.
- [ ] Commit: `docs(state): monthly reprioritize YYYY-MM`.

---

## Notes for this month

<!-- Free-form: what was surprising, what changed, what to remember next month. -->

---

*Template scaffolded in Phase 12. Edit this file directly to evolve the checklist as you learn what's actually worth checking each month.*
