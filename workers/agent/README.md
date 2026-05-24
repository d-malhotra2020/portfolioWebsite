# drew-agent · Cloudflare Worker

A thin proxy in front of the Anthropic Claude API. The browser chat dock on
drewmalhotra.com posts a conversation here, the Worker injects Drew's resume +
project profile as a system prompt, and streams the response back as SSE.

The Worker exists so the Anthropic API key never ships to the browser.

---

## One-time setup

```bash
cd workers/agent
npm install
npx wrangler login           # opens browser, links to your Cloudflare account
```

Set the Anthropic API key as a Worker secret (never commit it):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
# paste your sk-ant-... key when prompted
```

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
Update those whenever Anthropic prices change or the default model rotates.

---

## Cost & rate-limits

Defaults to `claude-haiku-4-5-20251001` for speed and low cost. Most chats
will land under 1,500 tokens total. Cloudflare's free tier covers 100k
Worker requests/day, so the bottleneck is Anthropic billing.

If you want to swap models, set `MODEL = "claude-sonnet-4-6"` in
`wrangler.toml` and redeploy.

---

## Updating the system prompt

The system prompt — Drew's resume + voice instructions — lives at the top of
`src/index.js`. Edit it in place, then redeploy with `npm run deploy`.

---

## Anthropic dashboard configuration

The Anthropic dashboard spend cap is the **hard wall** in this Worker's
two-layer cost defense. The Worker-side daily-cost circuit breaker
(documented in **Cost guardrails** below) is the **early warning** that
ideally trips first and keeps the dashboard cap from ever being reached.
This is a one-time Drew-action, not a code change. Future-Drew should
re-run these steps whenever the Anthropic API key is rotated, a new
Anthropic project is created, or a new month's billing window opens and
you want to confirm the cap is still attached.

1. Sign in at `https://console.anthropic.com/settings/billing`.
2. Under "Spend limits", set "Monthly spend cap" = **$10**.
3. Enable email alerts at **50% ($5)** and **90% ($9)** so you get a
   heads-up well before the hard cap fires.
4. Confirm the configured cap by running `npx wrangler tail` (from
   `workers/agent/`) while sending a real chat from the deployed site,
   and watch for an `outcome=ok` telemetry event with a non-zero cost —
   that confirms the API key the Worker is using is the same one the
   dashboard cap applies to.
5. Replace the screenshot placeholder below with a screenshot of the
   configured cap page (drag-and-drop into the README on GitHub, or
   commit a PNG to `workers/agent/docs/` and link it).

[Anthropic dashboard cap screenshot — Drew adds]

See **Cost guardrails** below for the Worker-side daily breaker that
fires before this dashboard cap does.

---

## Cost guardrails

Two layers of cost defense protect against a viral day running up an
unbounded Anthropic bill. The **Anthropic dashboard spend cap** (configured
in the section above) is the hard wall — once the monthly cap is hit, the
API itself rejects further requests. The Worker's **daily-cost circuit
breaker**, documented here, is the early warning that ideally trips first,
so visitors get a clean "agent's resting" message instead of upstream
failures, and the dashboard cap stays comfortably out of reach.

### Per-turn cost math

Cost is computed inside `writeTelemetry` from the `PRICING_MICRO_USD` table
in `src/index.js`. At the default `claude-haiku-4-5-20251001`:

- $1 / MTok input → **1 micro-USD per input token**
- $5 / MTok output → **5 micro-USD per output token**

A typical interview-agent chat turn lands around **500 input + 150 output
tokens** ≈ `500 × 1 + 150 × 5 = 1,250 µUSD ≈ $0.00125 per turn`. At the
default $0.333/day threshold, that's roughly **130–170 chat turns/day**
before the breaker fires. A normal day stays well under it; a coordinated
abuse spike trips it.

### Daily threshold + how to change it

The breaker reads `DAILY_COST_LIMIT_MICRO_USD` from the wrangler `[vars]`
block. Default `"333000"` = $0.333/day = **$10/month ÷ 30**.

To raise or lower it, edit `workers/agent/wrangler.toml`, change the value,
and run `npx wrangler deploy`. No code change required.

If future-Drew raises the Anthropic monthly cap (e.g. to $20), also raise
this variable to `"666000"` (= 20 / 30 = $0.666/day) so the Worker breaker
continues to fire *before* the dashboard cap rather than after it.

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
  "error": "agent's resting — Drew's daily Anthropic budget is spent for today. Try again tomorrow, or email Drew directly at dhruvmalhotra2026@gmail.com."
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
