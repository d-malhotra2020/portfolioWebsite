# Phase 10 — Context

**Phase:** Cost Guardrails
**Goal:** A viral day cannot cost more than Drew's configured monthly ceiling.
**Gathered:** 2026-05-23 (`--auto` mode — Drew supplied the budget number)
**Status:** Ready for planning

---

## Domain boundary

Phase 10 makes the Cloudflare Worker enforce a per-day cost ceiling using the cost telemetry already in place from Phase 3, and pairs it with an Anthropic dashboard cap that Drew configures by hand. Two layers of defense: dashboard cap is the hard wall, Worker breaker is the early warning.

Carrying forward from Phase 3:
- `PRICING_MICRO_USD` table in `workers/agent/src/index.js` (Haiku 4.5: 1/5 µUSD per input/output token).
- `teeWithUsage` already parses Anthropic SSE `message_start` / `message_delta` events into `inputTokens` / `outputTokens`.
- KV namespace `RATE_LIMIT` (id `b22c64c77ec34f57bc161773a3b301c1`) already bound; reuse it for the daily-cost counter to avoid a second KV namespace.
- Analytics Engine binding `TELEMETRY` is documented but commented out (Drew enables in CF dashboard, then uncomments).

---

## Decisions locked

### Monthly ceiling — $10 / month

Daily threshold = $10 / 30 ≈ $0.333. Stored as **`DAILY_COST_LIMIT_MICRO_USD = 333000`** (333,000 µUSD = $0.333). Configurable via wrangler `[vars]` so future-Drew can raise it without code changes.

Rationale: matches the Cloudflare free-tier discipline already in place. At Haiku 4.5 pricing ($1 / MTok input, $5 / MTok output) and typical chat usage (~500 input + ~150 output tokens per turn = ~$0.001 / turn), $0.333/day = ~166 chat turns before the breaker fires. A normal day stays well under it; a coordinated abuse run trips it.

### Circuit breaker — global daily counter in KV

- Key: `cost:YYYY-MM-DD` (UTC date — matches Cloudflare's clock and the Anthropic billing day).
- Value: cumulative µUSD as JSON `{"total":<number>,"requests":<number>}`. JSON instead of bare number so future fields (per-model breakdown, last-reset) don't require a schema migration.
- TTL: 48 hours (covers timezone gray zone + simplifies eviction).
- Atomicity: KV is eventually consistent, but for a portfolio site with single-digit concurrent requests this is fine — accept the rare under-count, reject hard on read.

**Sequence per request:**
1. Read `cost:<today>` from KV (treat read failure as fail-open — never break the agent because of KV).
2. If `total >= DAILY_COST_LIMIT_MICRO_USD`: short-circuit immediately with HTTP 503 + a clear "agent's resting" message. Write telemetry `outcome: 'cost_capped'`. Do NOT call the Anthropic API.
3. Otherwise: proceed with the upstream call. After `usagePromise` resolves (via `ctx.waitUntil`), atomically increment the counter:
   - Read current value, add this request's µUSD cost, write back.
   - Wrap in try/catch — telemetry write failure must never affect the response path.

### Short-circuit response shape

Match the existing rate-limit response shape so the frontend's existing error handling renders it correctly:

```json
{
  "error": "agent's resting — Drew's daily Anthropic budget is spent for today. Try again tomorrow, or email Drew directly at dhruvmalhotra2026@gmail.com."
}
```

HTTP 503 (Service Unavailable). `Retry-After` header set to seconds until UTC midnight so well-behaved clients back off appropriately.

### Telemetry outcomes (new)

Add `cost_capped` to the outcomes enum alongside `ok`, `rate_limited`, `bad_request`, `upstream_error`, `misconfigured`. Existing telemetry path already accepts arbitrary outcome strings — no schema change.

### Anthropic dashboard cap — Drew action

Drew sets the cap at https://console.anthropic.com/settings/billing → Spend limits → Monthly spend cap = **$10** with email alerts at 50% ($5) and 90% ($9). This is the hard wall; the Worker breaker is the early-warning that keeps the dashboard cap unreached.

The plan ships:
- A SUMMARY note describing exactly where in the Anthropic console to set the cap.
- A screenshot placeholder in `workers/agent/README.md` (Drew adds the screenshot after setting it).

### README documentation

`workers/agent/README.md` gets a new "Cost guardrails" section that documents:
- Per-turn cost math (with the Haiku 4.5 pricing).
- Daily threshold ($0.333) and how to change it (wrangler var).
- KV key shape and how to manually reset the counter (`wrangler kv:key delete --binding=RATE_LIMIT "cost:YYYY-MM-DD"`).
- The two layers: Worker breaker (early warning) + Anthropic dashboard cap (hard wall).
- How to monitor: Analytics Engine query for `outcome=cost_capped` events.

### Scope guardrail — what's NOT in Phase 10

- Per-user budgets (the rate limiter is per-IP; cost cap is global). Adding per-user would require auth, out of scope.
- Currency anything other than µUSD — stays internal to the Worker.
- Dynamic pricing fetches from the Anthropic API. Pricing table stays inline; bumped when prices change.
- A cost dashboard UI on drewmalhotra.com — telemetry feeds Analytics Engine; CF dashboard renders it. No new UI.
- Pre-emptive throttling (slow down before the cap). Hard cap is simpler and matches "viral day cannot cost more than ceiling."

---

## Code context

| Surface | File | Reuse |
|---|---|---|
| Pricing | `workers/agent/src/index.js` (lines 23–26) | `PRICING_MICRO_USD` table → use as-is for breaker. |
| Token extraction | `workers/agent/src/index.js` (lines ~213–245, `teeWithUsage`) | Already parses input/output tokens — feed cost into the daily counter. |
| KV binding | `workers/agent/wrangler.toml` | `RATE_LIMIT` namespace already exists; reuse with `cost:` key prefix. |
| Rate-limit shape | `workers/agent/src/index.js` (lines ~291–306) | Short-circuit response pattern to mirror for cost cap. |
| ctx.waitUntil | `workers/agent/src/index.js` (lines ~363–375) | Already keeping Worker alive past response for telemetry — extend with cost-counter write. |
| Frontend error UX | `src/components/AgentDock.jsx` (lines ~155–168) | Already surfaces server `error` field; no frontend change required. |

---

## Canonical refs

- `.planning/PROJECT.md` — REQ-07 ("Cost-bounded — a viral day cannot run up an unbounded bill"); Constraint: "Anthropic API costs must stay below a Drew-configured monthly ceiling — Risk: viral abuse spike."
- `.planning/ROADMAP.md` Phase 10 — success criteria + plan list.
- `.planning/phases/03-agent-leveling-up/` — Phase 3 SUMMARY documents the existing KV rate limit + cost telemetry.
- `workers/agent/src/index.js` — Worker entry point (PRICING_MICRO_USD, teeWithUsage, telemetry write).
- `workers/agent/wrangler.toml` — KV namespace binding + var configuration.
- `workers/agent/README.md` — to be extended with cost guardrails section.

No external specs / ADRs referenced.

---

## Deferred ideas

| Idea | Why deferred |
|---|---|
| Per-IP cost caps (not just per-IP rate limit) | Marginal value over global cap + per-IP rate limit; complexity not justified. |
| Pre-emptive throttling above N% of daily budget | Hard cap is sufficient for the goal. |
| Cost dashboard UI on the site | Telemetry → CF Analytics Engine → CF dashboard already does this. No new UI needed. |
| Per-model cost split in KV value | Add when we run multiple models in production. |
| Slack/email alert when the breaker trips | Anthropic dashboard alerts cover the "should I be worried" question. |

---

*Authored: 2026-05-23 during Phase 10 (`--auto`, budget supplied: $10/mo).*
