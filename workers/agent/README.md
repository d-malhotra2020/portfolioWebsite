# drew-agent · Cloudflare Worker

A thin proxy in front of Cloudflare Workers AI (an open-source Llama model,
hosted on Cloudflare's own infra). The browser chat dock on drewmalhotra.com
posts a conversation here, the Worker injects Drew's resume + project profile
as a system prompt, and streams the response back as SSE.

No external API key is involved — the Worker reaches the model through a
native `env.AI` binding scoped to the same Cloudflare account.

---

## One-time setup

```bash
cd workers/agent
npm install
npx wrangler login           # opens browser, links to your Cloudflare account
```

No secret to provision — the `[ai]` binding in `wrangler.toml` is all that's
needed; it activates automatically on deploy for any Cloudflare account with
Workers AI access (on by default).

Deploy:

```bash
npm run deploy
```

After deploy completes, copy the `https://drew-agent.<your-subdomain>.workers.dev`
URL it prints. That's your endpoint.

Then in the portfolio repo, create `.env.local` (or set a Vite env var
elsewhere) with:

```
VITE_AGENT_ENDPOINT=https://drew-agent.<your-subdomain>.workers.dev
```

…and restart `npm run dev` in the portfolio. The agent dock will start hitting
the live Worker.

---

## Custom domain (optional but recommended)

After the first deploy, in the Cloudflare dashboard:

1. Workers & Pages → drew-agent → Settings → Triggers → Custom Domains
2. Add `api.drewmalhotra.com` (or any subdomain you control)
3. Update `VITE_AGENT_ENDPOINT` to use that URL

This buys you stable URLs and removes the `*.workers.dev` look.

---

## Local dev

```bash
npm run dev   # runs the Worker locally on http://127.0.0.1:8787
```

Point the portfolio at `http://127.0.0.1:8787` via `VITE_AGENT_ENDPOINT` to
test end-to-end without deploying.

---

## CORS state (already locked down)

`wrangler.toml` is configured with an origin allowlist:

```toml
ALLOWED_ORIGIN = "https://drewmalhotra.com,https://d-malhotra2020.github.io,http://localhost:3000"
```

The Worker echoes one of these back as `Access-Control-Allow-Origin` for every
request whose `Origin` matches; mismatched origins get the first allowed origin
echoed back, which fails the browser's CORS check client-side. To add or remove
origins, edit the line and `npx wrangler deploy`.

## Updating the agent's knowledge

The system prompt at the top of `src/index.js` is Drew's career profile +
voice instructions. Keep it in sync with the live résumé whenever:
- A new role / project ships
- A metric changes (test counts, user counts, env counts)
- A new tool joins the daily workflow (e.g. a new LLM dev tool)

After editing, run `npx wrangler deploy` — the Worker picks up the new prompt
on the next request.

## Rate limiting

The Worker is rate-limited to **20 requests per IP per 60-second sliding
window**, backed by a KV namespace (binding `RATE_LIMIT`). When the limit
is hit, the request returns HTTP 429 with a friendly JSON message and a
`Retry-After: 60` header.

To adjust the limit, edit `RATE_LIMIT_PER_WINDOW` and `RATE_LIMIT_WINDOW_SEC`
near the top of `src/index.js`, then redeploy.

If KV is unavailable the limiter fails open (returns `{ allowed: true }`)
rather than blocking legitimate traffic.

## Cost telemetry

The Worker captures per-request telemetry — model, outcome (`ok` /
`rate_limited` / `upstream_error` / `bad_request` / `misconfigured`), client
IP, input + output token counts, and estimated cost in micro-USD — and writes
it to Cloudflare Workers Analytics Engine when the `TELEMETRY` binding is
configured.

**One-time setup before telemetry captures anything:**

1. Enable Workers Analytics Engine on your Cloudflare account dashboard:
   `https://dash.cloudflare.com/<account>/workers/analytics-engine`
2. Uncomment the `[[analytics_engine_datasets]]` block in `wrangler.toml`.
3. Run `npx wrangler deploy`.

Once configured, query telemetry via the Cloudflare Analytics SQL API:

```sql
-- Last 24h: requests by outcome
SELECT
  outcome AS outcome,
  COUNT() AS requests,
  SUM(_sample_interval) AS adjusted_requests
FROM drew_agent_events
WHERE timestamp > NOW() - INTERVAL '1' DAY
GROUP BY outcome;

-- Last 7d: estimated spend per day (USD)
SELECT
  formatDateTime(timestamp, '%Y-%m-%d') AS day,
  SUM(double3) / 1000000 AS cost_usd
FROM drew_agent_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND blob2 = 'ok'
GROUP BY day
ORDER BY day DESC;
```

The cost estimate uses constants in `src/index.js` (`PRICING_MICRO_USD`).
Update those whenever Cloudflare's Workers AI prices change or the default
model rotates. Token counts come from the real `usage` object Workers AI
emits in the final stream event; a chars/4 heuristic is only a fallback for
the rare case that event never arrives (see `teeWithUsage` in `src/index.js`).

---

## Cost & rate-limits

Defaults to `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for a balance of
quality and cost. Most chats will land under 1,500 tokens total. Cloudflare's
Workers free tier covers 100k Worker requests/day, and Workers AI's own free
tier (10,000 neurons/day) comfortably covers this site's realistic traffic —
overage beyond that is billed at $0.011 / 1,000 neurons.

If you want to swap models, set `MODEL = "@cf/meta/llama-3.1-8b-instruct"`
(cheaper, smaller) in `wrangler.toml` and redeploy. See
[developers.cloudflare.com/workers-ai/models](https://developers.cloudflare.com/workers-ai/models/)
for the full catalog.

---

## Updating the system prompt

The system prompt — Drew's resume + voice instructions — lives at the top of
`src/index.js`. Edit it in place, then redeploy with `npm run deploy`.

---

## Cloudflare billing configuration (optional)

Unlike the old Anthropic setup, there's no separate dashboard to configure
before deploying — Workers AI's free tier + the Worker's own daily-cost
breaker (below) are the guardrails out of the box. Two optional additions
for extra visibility, neither required:

1. **Budget alerts** (informational, on by default for pay-as-you-go
   accounts) — see
   [developers.cloudflare.com/billing/manage/budget-alerts](https://developers.cloudflare.com/billing/manage/budget-alerts/).
   These notify but don't block traffic.
2. **AI Gateway spend limits** (hard cap, closer to what the Anthropic
   dashboard cap used to do) — routes the `env.AI.run()` call through an AI
   Gateway with a configurable per-day/per-user dollar limit that actually
   blocks further requests. Not wired in here; would mean adding a gateway
   binding. Worth it only if traffic outgrows the Worker's own breaker.

---

## Cost guardrails

The Worker's **daily-cost circuit breaker** is the primary defense against a
viral day running up cost: it fires before Workers AI's free tier is
exhausted, so visitors get a clean "agent's resting" message instead of the
Worker silently eating cost or erroring upstream.

### Per-turn cost math

Cost is computed inside `writeTelemetry` from the `PRICING_MICRO_USD` table
in `src/index.js`. At the default `@cf/meta/llama-3.3-70b-instruct-fp8-fast`:

- $0.293 / MTok input → **0.293 micro-USD per input token**
- $2.253 / MTok output → **2.253 micro-USD per output token**

A typical interview-agent chat turn lands around **500 input + 150 output
tokens** ≈ `500 × 0.293 + 150 × 2.253 ≈ 484 µUSD ≈ $0.00048 per turn`. At the
default $0.333/day threshold, that's roughly **690 chat turns/day** before
the breaker fires — and Workers AI's own 10,000-neurons/day free tier covers
realistic traffic on its own well before that. A normal day stays well
under both; a coordinated abuse spike trips the breaker.

### Daily threshold + how to change it

The breaker reads `DAILY_COST_LIMIT_MICRO_USD` from the wrangler `[vars]`
block. Default `"333000"` = $0.333/day.

To raise or lower it, edit `workers/agent/wrangler.toml`, change the value,
and run `npx wrangler deploy`. No code change required.

### KV key shape + manual reset

The running daily total lives in the `RATE_LIMIT` KV namespace under the
key `cost:YYYY-MM-DD` (UTC date). The value is JSON
`{ "total": <microUSD>, "requests": <count> }`. TTL is 48 hours, which
covers the timezone gray zone and removes the need for explicit eviction.

Inspect today's spend:

```bash
cd workers/agent
npx wrangler kv:key get --binding=RATE_LIMIT "cost:$(date -u +%Y-%m-%d)"
```

Manually reset the counter (e.g. after a false alarm, or to test the
breaker by pre-seeding a large value with `kv:key put`):

```bash
cd workers/agent
npx wrangler kv:key delete --binding=RATE_LIMIT "cost:$(date -u +%Y-%m-%d)"
```

KV is eventually consistent — counts may briefly under-report under
concurrent writes. That's acceptable for this portfolio's traffic level,
documented in `.planning/phases/10-cost-guardrails/10-CONTEXT.md`.

### Short-circuit behavior

When `total >= DAILY_COST_LIMIT_MICRO_USD`, the Worker returns HTTP **503**
with a `Retry-After` header set to seconds-until-UTC-midnight and a JSON
body:

```json
{
  "error": "agent's resting — Drew's daily agent budget is spent for today. Try again tomorrow, or email Drew directly at dhruvmalhotra2026@gmail.com."
}
```

The browser dock (`src/components/AgentDock.jsx`) already renders the
`error` field as the assistant's response — no frontend code change is
required. Telemetry records `outcome: 'cost_capped'`.

### Monitoring

Once the `TELEMETRY` binding is uncommented (see the "Cost telemetry"
section above), query Analytics Engine for cost-cap events:

```sql
-- Last 7d: cost-cap events per day
SELECT
  formatDateTime(timestamp, '%Y-%m-%d') AS day,
  COUNT() AS cost_capped_events
FROM drew_agent_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND blob2 = 'cost_capped'
GROUP BY day
ORDER BY day DESC;
```

A row showing up here is the signal future-Drew should investigate — it
means the breaker actually fired, and a real day's traffic (or an abuse
spike) reached the daily ceiling.
