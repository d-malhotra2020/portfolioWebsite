# Portfolio Roadmap

**Site:** [drewmalhotra.com](https://drewmalhotra.com)
**Owner:** Dhruv (Drew) Malhotra
**Optimization target:** *appeal to potential employers (SDE / SDET / AI-ML / cloud architecture roles).*

This document drives `/gsd-autonomous` and similar workflows. Phases are
designed to be executable in single sessions (≤2 hours of focused work).
Earlier phases have higher employer-impression ROI per hour invested.

---

## Status legend

| Symbol | Meaning |
|---|---|
| ⬜ | not started |
| 🔄 | in progress |
| ✅ | completed |
| 🟡 | blocked / awaiting external (cert, recommendation, third-party action) |
| 🚫 | descoped |

---

## Current state (baseline)

What already ships on `drewmalhotra.com` as of 2026-05-23:

- Operator-console aesthetic (dark, Geist Sans + JetBrains Mono, cyan/amber)
- Hero with terminal `whoami.sh` panel + 4-stat strip
- Live status board pinging 6 deployed Railway projects (auto-refresh 2m)
- Live GitHub commit feed (events API + per-repo fallback)
- About / career / projects / stack / contact sections
- AI agent dock backed by Cloudflare Worker → Claude Haiku
- GH Actions deploy on push to `main`; CORS-locked Worker
- Formspree contact form, accurate resume PDF, custom domain + HTTPS

**What hiring managers *don't* see yet:** longform writing showing how I
think, per-project deep-dives, social proof, polished mobile, ironclad a11y,
sticky conversion (newsletter / "ping me" CTA), formal cost guardrails.

---

## Now playing

→ **P01 — First technical writeup: the PATCH vulnerability case study**

That single piece of writing is the highest-impact thing the site is
currently missing. A hiring manager who reads "I uncovered a critical PATCH
vulnerability" wants the story. Tell the story.

---

## Phases

### P01 — First technical writeup (PATCH vulnerability case study) ⬜

**Goal:** Add a `/writing` index + the first longform post: how I found
the PATCH vulnerability at Brivo, why nobody else did, what I did about it.

**Deliverables**
- `/writing` route with index of posts (renders MDX or plain markdown)
- One published post: ~1500 words, with code/JSON snippets, redacted/safe
- Cross-link from the About principles ("Reliability over cleverness")
- Cross-link from the relevant project card / career row
- OG image for social shares

**Success criteria**
- Reads coherent and concrete to a non-Brivo engineer
- All technical claims survive a re-read 24h later
- No proprietary detail that violates Brivo NDA
- Lighthouse perf score on the post page ≥ 90

**Effort:** ~2 sessions (draft + polish + technical wiring)

---

### P01b — LLM-tooling visibility pass ✅

**Goal:** Surface Drew's enthusiasm for LLM dev tooling (Claude Code, Codex,
Gemini) prominently — not just as a buried bullet but as a real signal.
Differentiator vs. typical SDET candidates.

**Deliverables**
- Dedicated paragraph in `About` calling out daily use of Claude Code, Codex,
  Gemini and framing LLMs as a force multiplier (not a curiosity).
- Skills `AI · ML · LLMs` block lists the tools by name (Claude Code, Codex,
  Gemini, Anthropic API, LLM-augmented QA).
- Agent system prompt has an explicit "LLM tooling — Drew is enthusiastic and
  hands-on" section so recruiters asking the agent get the same signal.
- The chat dock itself stays as the strongest demo — explicitly references it
  in About copy.

**Success criteria**
- Anyone reading About knows Drew uses LLM tooling daily within 30 seconds.
- Anyone asking the agent about AI/LLM dev workflow gets a confident,
  specific answer.

**Effort:** shipped 2026-05-23 alongside resume-parity reconciliation.

---

### P02 — Per-project deep-dive pages ⬜

**Goal:** Each "selected work" card becomes a route. The card stays as a
preview; clicking opens a richer page with screenshots, architecture
diagram, key decisions, lessons.

**Deliverables**
- `/work/[slug]` routes for the 6 current projects
- Per-project: screenshot or short video, architecture sketch (mermaid or
  hand-drawn SVG), one paragraph on *the hard part*, links
- Update project cards on the home page to link to deep-dives (live link
  still goes to the Railway deployment)

**Success criteria**
- Clicking through any project answers "what makes you good at this?"
  without bouncing to GitHub
- Each page loads in <1.5s on a fresh visit

**Effort:** ~3 sessions (1 per 2 projects)

---

### P03 — Agent leveling-up ⬜

**Goal:** Make the agent meaningfully better, not just functional.

**Deliverables**
- Rate-limiting: ~20 messages/hour per IP via Cloudflare KV
- Hot-lead detection: if conversation mentions specific signals (company
  name, "looking to hire", "salary"), Worker pings Drew via Slack/email
  webhook
- Conversation summary on the visitor side: at session end, the agent
  offers to email Drew a recap of what was discussed
- Cost telemetry: log per-conversation token count to Cloudflare Analytics

**Success criteria**
- Rate limit triggers cleanly with a helpful message (not a 500)
- Drew has received at least one hot-lead notification from a recruiter
- Per-conversation cost visible in Cloudflare dashboard

**Effort:** ~2 sessions

---

### P04 — A11y + perf audit pass ⬜

**Goal:** Lighthouse ≥ 95 across the board on the main page. WCAG AA
compliant. Real screen-reader tested.

**Deliverables**
- Run Lighthouse on every route; record baseline
- Fix any failing a11y rules (alt text, contrast, focus rings, ARIA)
- Code-split if main bundle > 250KB gzipped (currently 96KB — likely fine)
- Add prefers-reduced-motion handling to all Framer Motion animations
- Test with VoiceOver on macOS for one full visitor flow

**Success criteria**
- Lighthouse: perf ≥ 95, a11y = 100, best practices ≥ 95, SEO = 100
- Site is fully usable via keyboard alone (Tab through every interactive)
- VoiceOver reads the page in a sensible order

**Effort:** ~1 session

---

### P05 — SEO + discoverability ⬜

**Goal:** When a recruiter searches "Drew Malhotra SDET Austin," this site
is first hit, with a rich preview.

**Deliverables**
- `robots.txt` allowing all, with sitemap reference
- Generated `sitemap.xml` (build step)
- Expanded schema.org JSON-LD: `Person` + `WebSite` + per-project
  `SoftwareApplication`, per-job `WorkExperience`
- Per-route `<meta>` (title, description, OG image)
- Submit to Google Search Console; verify ownership

**Success criteria**
- `site:drewmalhotra.com` returns indexed pages within 14 days
- LinkedIn / Slack share preview is on-brand (not blank)
- Google rich-result tester passes on the home page

**Effort:** ~1 session

---

### P06 — Trust + social proof section ⬜

**Goal:** Add a thin section the site doesn't currently have: voices that
aren't mine.

**Deliverables**
- Pull 3–5 LinkedIn recommendations (with permission) onto the site
- If you've spoken at a meetup / had a manager quote you in a review:
  surface it
- Certifications (AWS, security, anything Brivo-issued) with badges
- Press / mentions if any

**Success criteria**
- At least 3 third-party quotes attributed and live on the page
- One verifiable credential (cert, talk, publication) rendered

**Effort:** ~1 session (gated on collecting recommendations — see 🟡 below)

> 🟡 **Blocker note:** Some of this requires LinkedIn-message asks to former
> colleagues. Phase can run with whatever signed-off content exists at start.

---

### P07 — Refresh side-project deployments ⬜

**Goal:** Make sure every Railway-deployed project on the status board
actually does something useful when clicked. Kill or fix anything dead.

**Deliverables**
- For each of the 6 side projects: load the Railway URL, confirm it's
  functional (not just 200-ing), test the headline feature
- If broken or stale: either fix the deployment or remove from the site
- Add a one-line description visible on the deployment landing page
  explaining what it is + linking back to drewmalhotra.com

**Success criteria**
- Every linked project either works for its stated headline feature, or
  is removed from the site
- Status board shows accurate green for all remaining projects

**Effort:** ~2 sessions

---

### P08 — Analytics maturity ⬜

**Goal:** Replace "I have GA4 installed" with actually-useful data.

**Deliverables**
- GA4 events: resume download, agent conversation start, agent message
  sent, contact-form submission, deep-dive page view
- Custom dashboard in GA4 with the funnel: land → engage agent → ask N+
  questions → take an action
- Cloudflare Worker Analytics dashboard for agent: requests, p95 latency,
  error rate, daily token cost

**Success criteria**
- Drew can answer "how many recruiters used the agent last week" in <30s
- Drew can answer "what's costing me money on Anthropic" in <30s

**Effort:** ~1 session

---

### P09 — Signature easter eggs / craft signals ⬜

**Goal:** Subtle details that hiring managers notice and remember. Not
required, but lifts the site from "very good" to "I want to talk to this
person."

**Candidate deliverables** *(pick 2–3, not all):*
- `/whoami` route that renders a terminal-style CV; can be `curl`-ed
  cleanly and returns Drew's resume as plain text/JSON
- Konami code triggers something on-brand (matrix rain? a Brivo-style
  alert?)
- Subtle keyboard shortcuts: `g a` → about, `g w` → work, `?` → help
- Animated favicon during agent typing
- Agent dock that remembers history if you open it again same session

**Success criteria**
- The chosen detail is discoverable but not in the way
- Friends + a handful of recruiters notice it unprompted

**Effort:** ~1 session

---

### P10 — Cost guardrails ⬜

**Goal:** Cap the worst case. The site should be cheap to run even if it
gets abused or goes viral.

**Deliverables**
- Set Anthropic monthly budget cap in the Anthropic dashboard ($25? $50?
  TBD — see Q below)
- Worker logic: if daily token-cost estimate > threshold, return a
  friendly "agent's resting" message instead of calling Anthropic
- Document the cost model in `workers/agent/README.md` so future-Drew
  remembers how it works

**Success criteria**
- A bad day can't cost more than the configured budget
- Drew gets an alert (email from Anthropic) before hitting cap

**Effort:** ~1 session

> ❓ **Open question for Drew:** What's an acceptable monthly ceiling? My
> default suggestion is $25/mo — well below any reasonable usage at Haiku
> pricing, but firm enough that you'd notice if abused.

---

### P11 — Mobile UX deep-pass ⬜

**Goal:** Test every interaction on a real device, fix what's broken.

**Deliverables**
- Manual pass on iOS Safari + Android Chrome on a real phone
- Fix touch-target sizes (≥44px) on the agent dock, status refresh
  button, nav links
- Ensure agent panel doesn't break scroll-lock or trap focus weirdly
- Test landscape orientation

**Success criteria**
- Every interactive element is comfortably tappable on a 5.5" phone
- Agent panel opens / closes / sends without iOS keyboard breaking layout

**Effort:** ~1 session

---

### P12 — Recurring maintenance scaffolding ⬜

**Goal:** Make sure this roadmap doesn't get stale; make the recurring
items below actually happen.

**Deliverables**
- A `Maintenance` section in this file (see below)
- A `STATE.md` sibling that the autonomous workflow updates after each
  phase
- A GitHub issue template for "monthly check-in" with the maintenance
  checklist pre-populated

**Success criteria**
- The maintenance checklist gets run once per month for at least 3 months
- This ROADMAP.md has been edited (phases re-prioritized) at least once
  based on what was actually shipped

**Effort:** ~0.5 session

---

## Recurring maintenance

| Cadence | Task |
|---|---|
| Weekly | Eyeball the live status board; if anything red >24h, fix or remove. |
| Weekly | Skim agent transcripts via Cloudflare logs; spot-check any wild answers. |
| Monthly | Bump dependencies (`npm outdated`); update wrangler; re-run a Lighthouse audit. |
| Monthly | Update the "Currently at Brivo" copy if your project there has shifted. |
| Monthly | Refresh resume PDF if any new role / impact / metric landed. |
| Monthly | Review Anthropic spend; revisit budget if scale changed. |
| Quarterly | Ship one new project or one new technical writeup. |
| Quarterly | Re-prioritize this roadmap based on what actually drove inbound interest. |
| Quarterly | **Résumé-parity audit** — diff `public/Dhruv_malhotra_resume.pdf` against the site Experience / Skills / About *and* the Worker system prompt; correct any drift. Numeric claims (env counts, user counts, test counts) get stale fastest. |
| Annually | Re-audit a11y + perf with fresh eyes; refresh OG images; rotate Anthropic API key. |

---

## Out of scope (intentionally not doing)

- **Theme toggle / multiple themes.** A single intentional aesthetic
  outperforms "5 themes" every time. The previous version of this site
  had 5 themes; the new one has one. That's correct.
- **Animated particle backgrounds.** Same reason as above — distraction
  cosplays as polish.
- **Reverse-chronological blog.** "Writing" is for evergreen case
  studies, not weekly posts. Frequency would be a treadmill.
- **i18n.** The hiring market this site targets reads English.
- **Comments / community features.** Not a publication.

---

## Glossary

- **Hot lead** — agent conversation that mentions hiring, a specific
  company, salary, or "let's talk." Worth a real-time notification.
- **Deep-dive** — a per-project page that answers "show me how you
  thought about this" without forcing the reader into GitHub.
- **Operator-console** — the aesthetic direction the site is committed
  to: dark + monospace chrome + live signals + restrained motion.

---

## Change log

| Date | Change | By |
|---|---|---|
| 2026-05-23 | Initial roadmap authored. | Drew + Claude |
| 2026-05-23 | Added P01b (LLM-tooling visibility); résumé-parity reconciliation shipped — 24→26 envs, 10K→100K users, ACC degree added, Skills inventory expanded, security clearance surfaced, agent system prompt synced. | Drew + Claude |
