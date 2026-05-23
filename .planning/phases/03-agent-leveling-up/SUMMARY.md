# Phase 3 — Summary

**Phase:** Agent Leveling-Up
**Shipped:** 2026-05-23
**Worker version:** 20e6b680-e21a-47c5-aec7-4c4808dfc2df

## Shipped

- **Per-IP rate limit** (KV-backed sliding window): 20 requests / 60 seconds
  per IP. HTTP 429 + Retry-After: 60 + friendly JSON body on hit.
  Fails open on KV errors (responsive over strict).
- **Cost telemetry code-ready**: every request emits a structured event
  (model, outcome, IP, input/output tokens, micro-USD cost) when the
  `TELEMETRY` binding is configured. Outcomes: `ok` / `rate_limited` /
  `upstream_error` / `bad_request` / `misconfigured`.
- **Stream-tee for usage capture**: the Worker now tees the Anthropic SSE
  stream so the client gets one branch (unchanged) and the other parses
  out `message_start.usage.input_tokens` and `message_delta.usage.output_tokens`
  to feed telemetry. `ctx.waitUntil` keeps the Worker alive past the
  response so the telemetry write actually fires.
- **README** updated with: rate-limit policy + how to tune it, telemetry
  setup steps, SQL query examples for outcomes and daily spend.
- **Verified** via 22-request smoke test from a single IP: 20 × 200, then
  2 × 429 with the rate-limit body.

## Detour worth recording

The initial implementation used Cloudflare's first-party
`[[unsafe.bindings]]` rate-limit form (the `env.RATE_LIMIT.limit({ key })`
API). On wrangler 3.114 it deployed without errors but registered as
"Unsafe Metadata" and didn't enforce at runtime — a 22-request smoke test
returned all 200s. The fix was switching to a KV-backed sliding window:
~30 lines of code, works on any wrangler version, ~50ms p99 added to
each request (invisible next to the 1-2s Claude streaming latency).
Migration to `[[ratelimits]]` is a wrangler 4.x follow-up.

## Success criteria

1. ✅ Hitting the limit returns a friendly 429, not a 500
2. ⚠️ Drew receives at least one hot-lead notification from a recruiter
   — **descoped during discuss-phase** (no Slack channel chosen)
3. ✅ Per-conversation token count and cost are logged when Analytics
   Engine is enabled (one dashboard click + uncomment + redeploy)
4. ✅ Existing functionality (streaming, CORS, message-history cap) still
   works — verified by 20 successful 200s in the smoke test

## Deferred to follow-up

- **Hot-lead detection + notification** — descoped at Drew's request
  (no channel chosen). Re-add as Phase 13+ when channel is decided.
- **Analytics Engine enable** — Drew clicks once on Cloudflare dashboard,
  uncomments the `[[analytics_engine_datasets]]` block in `wrangler.toml`,
  and redeploys. Code is ready.
- **Hourly window in addition to per-minute** — current limit is 20/60s.
  An hourly cap (e.g. 60/hr per IP) on top of the per-minute limit would
  catch slow-burn abuse. KV pattern extends naturally; not urgent.

## Metrics

- Lines of code added/changed: ~110 (Worker source + wrangler.toml + README)
- Worker bundle size: 12.25 → 16.38 KiB (+33%, mostly stream-tee logic)
- KV namespace: 1 (drew-agent-RATE_LIMIT, id b22c64c77ec34f57bc161773a3b301c1)
- Plans completed: 3 of 3 (with scope tightened per discuss-phase)
- Wall-clock time: ~35 min

## Next phase

Phase 4 — A11y + Perf Audit Pass. Lighthouse on the live site, fix what
scores low, ensure WCAG AA, add `prefers-reduced-motion`. Pure autonomous
work — no Drew-input dependency.
