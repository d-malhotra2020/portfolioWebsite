---
phase: 10-cost-guardrails
plan: 02
subsystem: workers/agent
tags: [cost, kv, circuit-breaker, telemetry, cloudflare-worker]
completed: 2026-05-24
duration_min: 15
requires:
  - PRICING_MICRO_USD (existing, src/index.js)
  - teeWithUsage usagePromise (existing, src/index.js)
  - RATE_LIMIT KV namespace (existing, wrangler.toml)
  - "## Anthropic dashboard configuration" section (10-01, README.md)
provides:
  - DAILY_COST_LIMIT_MICRO_USD wrangler [vars] tunable
  - cost:YYYY-MM-DD KV key in RATE_LIMIT namespace (JSON {total, requests}, 48h TTL)
  - cost_capped telemetry outcome string
  - costCapped() 503 response builder
  - getDailyCost(kv) / incrementDailyCost(kv, costMicroUsd) / utcDateKey() / secondsUntilUtcMidnight() helpers
  - "## Cost guardrails" README section
affects:
  - workers/agent/src/index.js (fetch handler — adds dailyLimit read, cost check after rate-limit, increment inside ctx.waitUntil)
  - workers/agent/wrangler.toml ([vars] block — adds DAILY_COST_LIMIT_MICRO_USD)
  - workers/agent/README.md (appends Cost guardrails section below 10-01's Anthropic dashboard section)
tech-stack:
  added: []
  patterns:
    - "KV read-modify-write with fail-open / swallow-on-error"
    - "ctx.waitUntil chaining (telemetry + KV increment in one .then)"
    - "Two-layer cost defense (dashboard cap + Worker breaker)"
key-files:
  created: []
  modified:
    - workers/agent/src/index.js
    - workers/agent/wrangler.toml
    - workers/agent/README.md
decisions:
  - "Reused RATE_LIMIT KV namespace with `cost:` key prefix (per CONTEXT) — no second namespace needed"
  - "Duplicated costMicro math at the increment site rather than refactoring writeTelemetry to return it — keeps the diff minimal and writeTelemetry signature stable"
  - "Increment runs only on the `ok` path (inside the existing ctx.waitUntil(usagePromise.then(...)) block); cost_capped, rate_limited, bad_request, upstream_error, misconfigured paths do not count toward the daily total"
  - "503 + Retry-After until UTC midnight (matches CONTEXT-locked response shape; mirrors rate-limit 429 JSON shape so AgentDock renders without frontend change)"
metrics:
  tasks_completed: 4
  files_modified: 3
  lines_added: ~204
requirements:
  - REQ-07
---

# Phase 10 Plan 02: Worker Daily-Cost Circuit Breaker Summary

**One-liner:** KV-backed daily-cost circuit breaker (`cost:YYYY-MM-DD` in `RATE_LIMIT`, JSON `{total, requests}`, 48h TTL) that short-circuits with HTTP 503 once cumulative cost reaches `DAILY_COST_LIMIT_MICRO_USD` (default 333000 µUSD = $0.333/day = $10/month ÷ 30), tunable via wrangler `[vars]`, with a new `cost_capped` telemetry outcome and a README section documenting the two-layer defense story.

## What shipped

**Worker source (`workers/agent/src/index.js`)**
- `costCapped(origin, retryAfterSec)` — 503 response builder, JSON `{error: "agent's resting — Drew's daily Anthropic budget is spent for today. Try again tomorrow, or email Drew directly at dhruvmalhotra2026@gmail.com."}` + `Retry-After` header + `corsHeaders(origin)`. Sits next to `badRequest` so all short-circuit builders cluster.
- `utcDateKey()` — `cost:${new Date().toISOString().slice(0, 10)}` → matches the Anthropic billing day and CF's UTC clock.
- `secondsUntilUtcMidnight()` — computes seconds-until-UTC-midnight via `Date.UTC(...+1)`, floors to integer ≥ 1.
- `async getDailyCost(kv)` — fail-open: returns `{total: 0, requests: 0}` if `kv` is falsy, the key is missing, KV throws, or the JSON is malformed. Never throws.
- `async incrementDailyCost(kv, costMicroUsd)` — RMW: read → `{total: prev.total + cost, requests: prev.requests + 1}` → put with `expirationTtl: 60 * 60 * 48`. All KV errors swallowed.
- `writeTelemetry` doc-comment updated to include `cost_capped` alongside `ok`, `rate_limited`, `bad_request`, `upstream_error`, `misconfigured`. Function body unchanged (it already accepts arbitrary outcome strings).
- Fetch handler: per-request `const dailyLimit = parseInt(env.DAILY_COST_LIMIT_MICRO_USD || '333000', 10)` immediately after the `model` read.
- After the existing rate-limit block: `const dailyCost = await getDailyCost(env.RATE_LIMIT); if (dailyCost.total >= dailyLimit) { writeTelemetry(env, {model, outcome: 'cost_capped', ip}); return costCapped(origin, secondsUntilUtcMidnight()) }`.
- Inside the existing `ctx.waitUntil(usagePromise.then(...))` block: compute `costMicro` from `PRICING_MICRO_USD[model]` and `return incrementDailyCost(env.RATE_LIMIT, costMicro)` so the eventual put is part of the `ctx.waitUntil` chain. Runs only on the `ok` (successful upstream) path.

**Wrangler config (`workers/agent/wrangler.toml`)**
- `[vars]` block now contains `DAILY_COST_LIMIT_MICRO_USD = "333000"` with a comment block explaining the math ($10/month ÷ 30 = $0.333/day) and how to raise it (if Drew raises the Anthropic monthly cap to $20, raise this to `"666000"`).

**README (`workers/agent/README.md`)**
- New `## Cost guardrails` section directly below `## Anthropic dashboard configuration` (10-01's section is untouched). Contains:
  - Two-layer framing (dashboard cap = hard wall, Worker breaker = early warning, ideally trips first).
  - Per-turn cost math at Haiku 4.5 pricing (~$0.00125/turn → ~130–170 turns/day at the default threshold).
  - Daily threshold + how to change it (wrangler `[vars]` edit + `npx wrangler deploy`).
  - KV key shape + inspect command (`wrangler kv:key get`) + manual reset command (`wrangler kv:key delete --binding=RATE_LIMIT`).
  - Short-circuit behavior (503 + `Retry-After` + the CONTEXT-locked error string + AgentDock renders it without a frontend change).
  - Analytics Engine SQL monitoring query for `cost_capped` events in the last 7 days.

## Tasks

| # | Name | Files | Commit |
|---|------|-------|--------|
| 1 | Add cost-cap helpers (KV getters/setters + 503 response builder) | `workers/agent/src/index.js` | `8e74223` |
| 2 | Wire cost check into fetch handler + add wrangler `[vars]` entry | `workers/agent/src/index.js`, `workers/agent/wrangler.toml` | `8013ba4` |
| 3 | wrangler dry-run validation | (no file changes) | (validation only) |
| 4 | Add "Cost guardrails" section to README | `workers/agent/README.md` | `3d9c406` |

## Validation

- `node --check workers/agent/src/index.js` → exit 0
- `npx wrangler deploy --dry-run` from `workers/agent/` → exit 0, both bindings recognized:
  - `RATE_LIMIT: b22c64c77ec34f57bc161773a3b301c1` (KV namespace)
  - `DAILY_COST_LIMIT_MICRO_USD: "333000"` (var)
  - No warnings about unrecognized `[vars]` keys.
- `grep -c "DAILY_COST_LIMIT_MICRO_USD" workers/agent/src/index.js` → **2** (parseInt read + comment)
- `grep -c "DAILY_COST_LIMIT_MICRO_USD" workers/agent/wrangler.toml` → **1**
- `grep -c "cost_capped" workers/agent/src/index.js` → **2** (telemetry call + doc-comment)
- `grep -c "Retry-After" workers/agent/src/index.js` → **3** (existing 429 + new 503 in costCapped + the spread header line)
- `grep -c "## Cost guardrails" workers/agent/README.md` → **1**
- `grep -n "getDailyCost(env.RATE_LIMIT" workers/agent/src/index.js` → line 412 (in fetch handler, after rate-limit block)
- `grep -n "incrementDailyCost(env.RATE_LIMIT" workers/agent/src/index.js` → line 482 (inside ctx.waitUntil chain)

## Deviations from Plan

**Plan body says "$5/mo ceiling" in the objective frontmatter line "Honors Phase 10 CONTEXT locked decisions: $5/mo ceiling..."**

CONTEXT.md and the rest of the PLAN body (and the success criteria) consistently call for `333000` µUSD = $0.333/day = $10/month ÷ 30. The "$5/mo" reference in the closing paragraph of the `<objective>` block is a stale stub from before Drew revised the budget mid-planning. Per the executor brief and CONTEXT.md (authoritative), I shipped the $10/mo / `333000` µUSD value. Both the wrangler default and the README example use `"333000"`. No code or doc reflects the stale $5 number.

No other deviations. The plan executed exactly as written — five named helpers, all in the prescribed locations, fail-open on KV errors, increment only on the `ok` path, README appended below 10-01's section without modifying earlier content.

## Auth gates

None. All work was local code edits + a local `wrangler deploy --dry-run`. No Anthropic API calls, no live deploy, no secrets accessed.

## Known Stubs

None.

## Threat Flags

None. This plan strictly *reduces* cost-related risk surface by adding a hard daily ceiling and an explicit short-circuit path — it does not introduce new endpoints, auth paths, file access, or schema changes at trust boundaries. The 503 response body is the CONTEXT-locked string with no user-influenced fields.

## Notes for next time

- **Drew action waiting:** Once Drew next deploys the Worker (`npx wrangler deploy` from `workers/agent/`), the breaker is live in production. A real day of traffic at typical chat volumes (well under 100 turns) will not approach the $0.333 daily ceiling — but a coordinated abuse spike (or a 100+ turn session from a single user) will trip it. AgentDock surfaces the `error` field automatically; no frontend change required.
- **Testing the breaker live:** Temporarily set `DAILY_COST_LIMIT_MICRO_USD = "0"` in `wrangler.toml`, `npx wrangler deploy`, send a chat → confirm AgentDock renders "agent's resting — Drew's daily Anthropic budget is spent for today..." and the telemetry event lands as `outcome=cost_capped`. Revert to `"333000"` and redeploy. **Don't commit the `"0"` override.**
- **Future enhancement candidates** (deferred per CONTEXT § "Deferred ideas"): per-IP cost caps, pre-emptive throttling above N% of daily budget, per-model split in the KV value, Slack/email alert when the breaker trips. Anthropic dashboard alerts at 50% / 90% cover the urgent-monitoring case.
- **KV key lifecycle:** The 48-hour TTL means each day's key auto-evicts ~24h after the next UTC midnight. No cleanup job needed. The `requests` counter is informational only — the breaker decision uses `total` exclusively.

## Self-Check: PASSED

Verified:
- File `workers/agent/src/index.js` exists and parses cleanly (`node --check` exit 0).
- File `workers/agent/wrangler.toml` exists and dry-run-validates with `npx wrangler deploy --dry-run` exit 0.
- File `workers/agent/README.md` exists and contains `## Cost guardrails` heading.
- Commits exist in git log:
  - `8e74223` feat(10-02): add cost-cap helpers (KV getters/setters + 503 response builder)
  - `8013ba4` feat(10-02): wire daily-cost circuit breaker into fetch handler + wrangler tunable
  - `3d9c406` feat(10-02): document Cost guardrails section in workers/agent/README.md
- All success criteria from the plan pass (DAILY_COST_LIMIT_MICRO_USD ≥ 2 in index.js, cost_capped ≥ 1, cost: ≥ 1, Retry-After ≥ 2, DAILY_COST_LIMIT_MICRO_USD ≥ 1 in wrangler.toml, ## Cost guardrails == 1 in README).
- Files modified are exactly the three in scope (`workers/agent/src/index.js`, `workers/agent/wrangler.toml`, `workers/agent/README.md`) — nothing else touched.
