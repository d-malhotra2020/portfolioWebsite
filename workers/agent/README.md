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
