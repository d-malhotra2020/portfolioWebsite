# drewmalhotra.com

## What This Is

A personal portfolio for Dhruv (Drew) Malhotra — a Software Engineer / SDET
with 6+ years building enterprise test infrastructure, cloud-native systems,
and AI/ML integrations. The site is a recruiting funnel: it converts a
recruiter or hiring manager landing on `drewmalhotra.com` into a qualified
inbound conversation (chat with the embedded AI agent, email, or contact
form). The aesthetic is intentionally "operator console" — dark + monospace
chrome + live signals — to read as senior engineering, not as a designer's
portfolio.

## Core Value

A hiring manager who lands on the site walks away with a concrete,
résumé-accurate read on Drew's engineering depth — and a frictionless path
to start a conversation. Everything else (style, gimmicks, optional features)
is downstream of that.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Operator-console rebuild (Hero, About, Career, Projects, Skills, Contact) — Phase 0
- ✓ Live status board pinging deployed projects — Phase 0
- ✓ GitHub commit feed (events API + per-repo fallback) — Phase 0
- ✓ AI agent dock streaming via Cloudflare Worker → Claude — Phase 0
- ✓ GitHub Actions deploy on push to `main` — Phase 0
- ✓ CORS-locked Worker with origin allowlist — Phase 0
- ✓ Résumé-parity reconciliation (26 envs, 100K users, ACC degree, security clearance, full skills inventory) — Phase 0
- ✓ LLM-tooling visibility (Claude Code, Codex, Gemini surfaced in About / Skills / Agent) — Phase 0

### Active

<!-- Current scope. Building toward these. -->

- [ ] REQ-01: Longform writing that shows how Drew thinks (case studies, not blog noise)
- [ ] REQ-02: Per-project depth — readers learn what Drew actually built without bouncing to GitHub
- [ ] REQ-03: Agent that converts curious visitors to recruiter conversations (rate-limited, hot-lead aware, cost-capped)
- [ ] REQ-04: Discoverable via search and shareable with rich previews
- [ ] REQ-05: Accessible (WCAG AA) and performant (Lighthouse ≥ 95)
- [ ] REQ-06: Trust signals beyond Drew's own claims (LinkedIn recs, certs)
- [ ] REQ-07: Cost-bounded — a viral day cannot run up an unbounded bill
- [ ] REQ-08: Self-maintaining — recurring checklist keeps the site from going stale

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Theme toggle / multi-theme support — A single intentional aesthetic outperforms options; the previous version had 5 themes and was generic.
- Animated particle background — Distraction cosplays as polish.
- Reverse-chronological blog — Writing is for evergreen case studies, not a treadmill.
- i18n — The hiring market this site targets reads English.
- Public comments / community features — Not a publication.

## Context

- **Stack:** React 18 + Vite + Framer Motion, Geist Sans + JetBrains Mono.
  Single CSS design system (no UI library). Static site hosted on GitHub
  Pages; AI agent backend is a Cloudflare Worker proxying the Anthropic API.
- **Deploy flow:** Push to `main` triggers `.github/workflows/deploy.yml`
  which builds and publishes via `actions/deploy-pages`. Worker deploys via
  `wrangler deploy` from `workers/agent/`.
- **Constraints baked in by hosting:** GitHub Pages is purely static; any
  dynamic behaviour must run client-side or via the Cloudflare Worker.
  Cloudflare Worker free tier is 100K req/day — generous for this use case.
- **Owner availability:** Drew has a full-time SDET role at Brivo. Phases
  must be sized for single evening/weekend sessions (≤2 hours of focus).
- **Audience:** Recruiters, hiring managers, peer engineers. Senior+ roles.
  Strong signals: production reliability, adversarial testing, cloud
  fluency, hands-on LLM tooling.

## Constraints

- **Tech stack**: React + Vite + Framer Motion frozen for this milestone — Avoids churning the design system mid-flight.
- **Hosting**: Must work on GitHub Pages (static) — Drew controls the domain and likes the zero-cost setup.
- **Budget**: Anthropic API costs must stay below a Drew-configured monthly ceiling — Risk: viral abuse spike.
- **Voice**: Site copy and agent responses must match the résumé — Risk: drift = "you said X but the agent says Y" credibility hit.
- **Performance**: Lighthouse ≥ 95 — Hiring managers do this check.

## Key Decisions

<!-- Decisions that constrain future work. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pivot from editorial/paper aesthetic to operator-console (dark + monospace) | Drew explicitly rejected editorial direction; operator-console reads as senior engineering. | ✓ Good |
| AI agent backend on Cloudflare Workers (not Vercel / Railway) | Free tier, low cold-start latency, easy secret management, scales effortlessly. | ✓ Good |
| Claude Haiku 4.5 as default agent model | Cheap, fast, plenty smart for portfolio Q&A. | ✓ Good |
| Single intentional aesthetic, no theme toggle | "5 themes" was the old portfolio's anti-pattern; one direction is sharper. | ✓ Good |
| GH Actions deploy from `main` (not `gh-pages -d dist`) | Pages is already configured for workflow-based deploy; `gh-pages` branch was a no-op. | ✓ Good |
| `VITE_AGENT_ENDPOINT` as GH repo variable (not secret) | URL is public anyway; variable is simpler. | ✓ Good |
| Phase numbering remains integer 1–12 | Aligns with GSD canonical format; decimal phases reserved for INSERTED urgent work. | ✓ Good |

---
*Last updated: 2026-05-23 after converting `.planning/` artifacts to canonical GSD format.*
