# Phase 3 — Context

**Phase:** Agent Leveling-Up
**Goal:** Make the Cloudflare Worker agent defensively engineered (rate-limited
+ cost-observable). Hot-lead notification deferred per Drew's discuss-phase
decision (channel not yet chosen).

---

## Decisions locked

### Scope

- ✅ In scope: per-IP rate limiting; per-conversation cost telemetry.
- 🟡 Deferred: hot-lead detection + notification. Drew chose to skip the
  Slack/email/inbound channel for now; will revisit when he picks a
  channel.

### Rate-limiting implementation

- **Use Cloudflare's built-in Rate Limit binding**, not a KV-backed
  sliding window. The Rate Limit binding ships with the runtime, requires
  no KV namespace creation, and is what Cloudflare specifically built for
  this use case. Less moving parts than a hand-rolled limiter.
- **Threshold: 20 messages per hour per IP.** Generous enough for any
  recruiter who actually wants to dig in, tight enough that a malicious
  loop hits the wall within a minute.
- **Response on limit hit:** HTTP 429 with a small JSON body explaining
  the limit, plus `Retry-After` header. The AgentDock UI already has an
  error bubble path — the existing UX renders 429s gracefully.

### Cost telemetry

- Log per-request token counts (input + output) and an estimated USD
  amount to **Cloudflare Workers Analytics Engine** (free tier covers
  this).
- Cost estimate uses the published Anthropic prices for the model in
  use (Haiku 4.5 by default). Embedded in code as a constant; update
  when prices or model change.
- Schema: dimensions `model`, `outcome` (`ok` / `rate_limited` /
  `upstream_error` / `bad_request`); metrics `input_tokens`,
  `output_tokens`, `total_tokens`, `cost_usd_micro`.
- Documentation in `workers/agent/README.md` shows the SQL queries to
  ask "how much did I spend this week" and "what's the daily request
  count."

### Implementation choices (Claude's call)

- Rate limit happens BEFORE the upstream Anthropic call — no point
  paying for a request that's going to be rejected.
- Bad-request paths (400 responses) are still logged to Analytics Engine
  for visibility, but with zero cost.
- The Worker's existing CORS + input sanitization stays as the outer
  guard layer.

---

## Out of scope for Phase 3

- Hot-lead notification (deferred; soft blocker on Drew's channel choice).
- Cost circuit breaker / kill switch ("agent's resting" message at
  daily-spend ceiling). That's Phase 10 — needs Drew's budget number.
- Multi-tenant rate limits. The portfolio is single-tenant; one shared
  limit is enough.

---

## Open questions for execute-phase

- Cloudflare's Rate Limit binding requires a `[[ratelimits]]` block in
  wrangler.toml — Drew may need to `wrangler deploy` for the binding to
  take effect; verify locally first.

---

*Authored: 2026-05-23 during gsd-discuss-phase 3.*
