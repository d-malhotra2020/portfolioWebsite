## The hook

The chat dock on the right side of [this site](/) is an in-page agent that speaks as me. Recruiters, hiring managers, and engineers type a question; the response streams back in real time, citing specific projects from my résumé. The whole thing runs on a single Cloudflare Worker proxying [Workers AI](https://developers.cloudflare.com/workers-ai/) — an open-source Llama model, run on Cloudflare's own infra — no backend server, no database, no auth flow, no external API key to manage. Source lives in [`workers/agent/`](https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent) of this repo.

A few things make the agent more than a wrapper around `env.AI.run()`:

- **Server-Sent Events streaming** end-to-end, so the response paints word-by-word like a real chat product.
- **KV-backed sliding-window rate limit** (20 requests / minute / IP) — protects the Worker from a single bad actor hammering the endpoint.
- **Daily-cost circuit breaker** that short-circuits with HTTP 503 once estimated cumulative cost for the current UTC day crosses `$0.333` (= $10 / month / 30) — an independent safety net on top of Workers AI's own generous free tier (10,000 neurons/day), so the agent goes down *gracefully* with a banner instead of an unbounded bill.
- **Anti-fabrication system prompt** — explicit instruction set telling the agent which numbers it can quote (the measured ones) and what to say if asked about something not in the profile.

**Migrated from the Anthropic API.** The agent originally proxied Claude Haiku. I moved it to Workers AI to drop the external vendor dependency entirely — same Cloudflare account already running the Worker, no separate API key to provision or rotate, and pricing that's still a fraction of a cent per conversation. The architecture below (rate limiting, cost breaker, streaming, system prompt) carried over essentially unchanged; only the model call itself moved.

## Architecture

```text
                                       drewmalhotra.com (GitHub Pages — static)
                                       ┌──────────────────────────────┐
                                       │  React SPA · AgentDock.jsx   │
                                       │   ↳ fetch POST              │
                                       │     keeps stream open as     │
                                       │     EventSource              │
                                       └──────────────┬───────────────┘
                                                      │  CORS (origin allowlist)
                                                      ▼
                       Cloudflare edge ┌──────────────────────────────────────┐
                                       │  drew-agent · Cloudflare Worker      │
                                       │                                      │
                                       │  1. Origin check                     │
                                       │  2. Per-IP sliding-window rate limit │  ← KV: ratelimit:<ip>
                                       │  3. Daily-cost circuit breaker check │  ← KV: cost:<utc-date>
                                       │  4. Inject system prompt + history   │
                                       │  5. Call Workers AI binding (stream) │
                                       │  6. Re-stream tokens to browser SSE  │
                                       │  7. After-stream: estimate usage,    │
                                       │     update cost KV                   │
                                       └──────────────┬───────────────────────┘
                                                      │  env.AI binding
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │  Workers AI (same account)   │
                                       │  Llama 3.3 70B Instruct      │
                                       └──────────────────────────────┘
```

There's no API key at all — the Worker reaches Workers AI through a native binding (`env.AI`, declared in `wrangler.toml`), scoped to the same Cloudflare account that runs the Worker. A build-time env var on the SPA points the browser at the Worker URL.

## Key decisions

**Cloudflare Workers, not a Lambda / Vercel function.** Three reasons: (1) the rate-limit + cost-breaker state needs a KV store with single-digit-millisecond reads and writes from the same edge region — Workers KV is built for exactly this, and the alternative (DynamoDB / Upstash / Redis) adds a network hop and a separate billing surface. (2) Cold-start latency on Workers is ~5 ms; a Lambda cold start is hundreds of milliseconds and would interfere with the streaming UX. (3) Workers AI binds natively into the same Worker — no separate vendor, no separate network hop for inference itself.

**SSE not WebSockets.** Workers AI streams in Server-Sent Events format natively. Re-streaming the same protocol to the browser is one less translation layer. WebSockets would add bidirectional capability I don't need (the user sends one message, the agent streams one reply, then the connection closes). SSE also degrades gracefully on networks where WebSocket upgrades fail.

**Llama 3.3 70B over a smaller model.** The default is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. Workers AI also offers 8B-class models at an even lower per-token cost, but for a personal-portfolio agent that needs to follow a fairly long system prompt (résumé + project profile + anti-fabrication guardrails) and answer nuanced "what did Drew actually build" questions, the instruction-following headroom of a 70B model is worth the small cost delta — output tokens run $2.25/MTok vs. Haiku's old $5/MTok, so the swap is cheaper *and* the model is bigger.

**Sliding-window rate limit, not a token bucket.** A 60-second sliding window with a 20-request limit. The implementation: on each request, read the existing timestamp array from KV, drop any older than `now - 60s`, append the new timestamp if there's room, write back. ~10-15 lines of Worker JS. The alternative — a leaky-bucket counter — is more bandwidth-efficient but loses the "drop stale entries" semantics that make burstiness recoverable. I'd rather a user who got rate-limited two minutes ago be able to send 20 messages now than have them stuck at "you have 4 requests until next refill."

**Daily-cost circuit breaker as a second, independent safety net.** Workers AI's own free tier (10,000 neurons/day) already covers this site's realistic traffic, and Cloudflare's dashboard has its own billing controls. The Worker breaker adds a belt-and-suspenders layer on top: it fires at an estimated daily *budget* (chars/4 token heuristic × Workers AI's published per-token pricing) and short-circuits with a clean 503 + a "the daily budget has been reached, try again tomorrow" banner, rather than letting a burst of traffic run unmonitored.

**Explicit anti-fabrication block in the system prompt.** The agent has a long system prompt — Drew's name, employer, role, projects, stack, principles. An earlier version of the project bullets included the same fabricated metrics I scrubbed from the rest of the site this week ("500+ streams", "94% accuracy", etc.). When a recruiter asked "tell me about Drew's video-analytics project," the agent confidently quoted those numbers, undoing all of the honesty work elsewhere. I rewrote the bullets with measured numbers and added an explicit note:

```text
# IMPORTANT: an earlier version of this prompt cited fabricated metrics
# (e.g., "500+ streams", "94% accuracy"). Those have been scrubbed. If a user
# asks about a number not listed here, say "I haven't measured that" — do not
# invent figures.
```

Same playbook as [the honesty post](/writing/honesty-playbook): the agent's training data is just another surface where a fabricated claim can live. Closing that gap matters as much as scrubbing the readme.

## What's intentionally simple

- **No vector database, no RAG.** The system prompt is ~5,000 tokens — Drew's whole résumé and project list fit. Adding RAG would let me index longer-form content (deep-dive markdown, writing posts) but at the cost of an embedding model, a vector store, and a retrieval step that adds latency. Current setup is fast enough that the marginal value isn't worth it.
- **No conversation persistence.** Each conversation is a fresh `messages: []` array passed by the browser. The Worker doesn't remember prior conversations. This is intentional — recruiters don't expect agents to remember them across sessions, and persistence would mean storage costs + auth + privacy considerations.
- **No fine-tuning.** Llama 3.3 70B stock + a careful system prompt. Fine-tuning would let me bias responses toward Drew's voice more aggressively, but the per-token cost of fine-tuned models would blow the budget, and the marginal voice improvement on a chatbot of this scope isn't worth it.

## What I'd do differently next time

**Telemetry — since shipped.** This sat at the top of this list for a couple of weeks: cost lived in the breaker's KV record with no dashboard behind it, and the `[[analytics_engine_datasets]]` block in `wrangler.toml` was commented out. It's live now — the Worker writes a structured event per request to Workers Analytics Engine (model, outcome — `ok` / `rate_limited` / `cost_capped` / `bad_request` / `upstream_error` — token counts, and computed micro-USD cost), captured by teeing the SSE stream and parsing the usage events in the background. [The guardrails post](/writing/agent-guardrails) covers the design.

**Streaming-aware error handling.** When Workers AI returns mid-stream with an error — rare but happens — the current code drops the connection. A more robust implementation would catch the error, send a structured SSE event the browser can render as "the agent got cut off, retry?", and let the user click to resume. ~30 lines of code, not yet shipped.

**A `/healthz` endpoint with cost-budget headroom.** Right now the breaker reports its trip-state inside a 503 response. A dedicated health endpoint that returns the *current* daily spend + remaining budget would let me put a small status pill on the chat UI ("$1.42 / $10.00 used today") so visitors know the agent is alive before they type the first message.

## What this is not

- **Not a general-purpose chat product.** It's a portfolio agent with a fixed scope. If a user asks about something unrelated to Drew's work, the system prompt instructs the agent to redirect.
- **Not a production AI platform.** No SLA, no support, no auth. The cost cap is on a personal-budget scale. A real customer-facing chat product would need observability, fallback models, content safety filters, and a much bigger budget envelope.
- **Not the agent itself.** I built the *plumbing* around an off-the-shelf open-source model. I didn't train the model; I didn't write the inference engine. The interesting work is the operational layer — rate limiting, cost control, streaming, system-prompt design — not the underlying intelligence.

## Source

- Worker: [github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent](https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent)
- Live: the chat dock on [drewmalhotra.com](/)
- System prompt: source-of-truth in `workers/agent/src/index.js`, ~120 lines starting at the `SYSTEM_PROMPT = ` constant
- Companion post: [The honesty playbook](/writing/honesty-playbook) covers why the agent's training data needed the same scrub as the rest of the site
