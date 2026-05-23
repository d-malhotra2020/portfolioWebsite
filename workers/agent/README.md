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

## Tightening security before launch

Open `wrangler.toml` and replace:

```toml
ALLOWED_ORIGIN = "*"
```

with your real origin(s):

```toml
ALLOWED_ORIGIN = "https://drewmalhotra.com,https://d-malhotra2020.github.io"
```

Then redeploy. Browsers from other origins will be blocked by CORS.

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
