## The hook

The chat dock on the right side of [this site](/) is an in-page agent that speaks as me. Recruiters, hiring managers, and engineers type a question; the response streams back in real time, citing specific projects from my résumé. The whole thing runs on a single Cloudflare Worker proxying the Anthropic [Messages API](https://docs.anthropic.com/api/messages) — no backend server, no database, no auth flow. Source lives in [`workers/agent/`](https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent) of this repo.

A few things make the agent more than a wrapper around `fetch('/messages')`:

- **Server-Sent Events streaming** end-to-end, so the response paints word-by-word like a real chat product.
- **KV-backed sliding-window rate limit** (20 requests / minute / IP) — protects the Anthropic key from a single bad actor hammering the endpoint.
- **Daily-cost circuit breaker** that short-circuits with HTTP 503 once cumulative cost for the current UTC day crosses `$0.333` (= $10 / month / 30). The Anthropic dashboard cap is the safety net; this fires earlier so the agent goes down *gracefully* with a banner instead of being silently rate-limited mid-conversation.
- **Anti-fabrication system prompt** — explicit instruction set telling the agent which numbers it can quote (the measured ones) and what to say if asked about something not in the profile.

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
                                       │  5. Stream to Anthropic Messages API │
                                       │  6. Re-stream tokens to browser SSE  │
                                       │  7. After-stream: tally usage,       │
                                       │     update cost KV                   │
                                       └──────────────┬───────────────────────┘
                                                      │  HTTPS + SSE
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │  api.anthropic.com           │
                                       │  Claude Haiku 4.5            │
                                       └──────────────────────────────┘
```

The browser never sees the Anthropic API key — that's the whole point of the proxy. The Worker holds it as a secret (`wrangler secret put ANTHROPIC_API_KEY`); a build-time env var on the SPA points at the Worker URL.

## Key decisions

**Cloudflare Workers, not a Lambda / Vercel function.** Three reasons: (1) the rate-limit + cost-breaker state needs a KV store with single-digit-millisecond reads and writes from the same edge region — Workers KV is built for exactly this, and the alternative (DynamoDB / Upstash / Redis) adds a network hop and a separate billing surface. (2) Cold-start latency on Workers is ~5 ms; a Lambda cold start is hundreds of milliseconds and would interfere with the streaming UX. (3) The Workers free tier handles the traffic this site sees comfortably, and the daily-cost cap is on the model side anyway.

**SSE not WebSockets.** The Anthropic Messages API streams in Server-Sent Events format natively. Re-streaming the same protocol to the browser is one less translation layer. WebSockets would add bidirectional capability I don't need (the user sends one message, the agent streams one reply, then the connection closes). SSE also degrades gracefully on networks where WebSocket upgrades fail.

**Haiku 4.5 over Sonnet.** The default model is `claude-haiku-4-5-20251001`. Sonnet is ~10× the cost per token. For a personal-portfolio agent answering questions like "what did Drew build at Brivo?" the marginal quality from Sonnet doesn't justify the cost — and the cost-breaker thresholds I'd have to set to use Sonnet would mean fewer conversations before the daily cap. Haiku at $1 / MTok in + $5 / MTok out fits the $10/mo budget for ~hundreds of conversations.

**Sliding-window rate limit, not a token bucket.** A 60-second sliding window with a 20-request limit. The implementation: on each request, read the existing timestamp array from KV, drop any older than `now - 60s`, append the new timestamp if there's room, write back. ~10-15 lines of Worker JS. The alternative — a leaky-bucket counter — is more bandwidth-efficient but loses the "drop stale entries" semantics that make burstiness recoverable. I'd rather a user who got rate-limited two minutes ago be able to send 20 messages now than have them stuck at "you have 4 requests until next refill."

**Daily-cost circuit breaker fires *before* the dashboard cap.** The Anthropic dashboard cap is a settings page Drew clicks once: "stop responding when monthly spend exceeds $10." Useful as a safety net, but it acts mid-conversation — a recruiter could be on message 8 of 12 when the API starts returning 429s with no warning. The Worker breaker fires earlier (at the daily *budget*, not the monthly *cap*) and short-circuits with a clean 503 + a "the daily budget has been reached, try again tomorrow" banner. Same outcome, much cleaner UX.

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
- **No fine-tuning.** Haiku 4.5 stock + a careful system prompt. Fine-tuning would let me bias responses toward Drew's voice more aggressively, but the per-token cost of fine-tuned models would blow the budget, and the marginal voice improvement on a chatbot of this scope isn't worth it.

## What I'd do differently next time

**Telemetry — since shipped.** This sat at the top of this list for a couple of weeks: cost lived in the breaker's KV record with no dashboard behind it, and the `[[analytics_engine_datasets]]` block in `wrangler.toml` was commented out. It's live now — the Worker writes a structured event per request to Workers Analytics Engine (model, outcome — `ok` / `rate_limited` / `cost_capped` / `bad_request` / `upstream_error` — token counts, and computed micro-USD cost), captured by teeing the SSE stream and parsing the usage events in the background. [The guardrails post](/writing/agent-guardrails) covers the design.

**Streaming-aware error handling.** When the Anthropic API returns mid-stream with a 5xx — rare but happens — the current code drops the connection. A more robust implementation would catch the error, send a structured SSE event the browser can render as "the agent got cut off, retry?", and let the user click to resume. ~30 lines of code, not yet shipped.

**A `/healthz` endpoint with cost-budget headroom.** Right now the breaker reports its trip-state inside a 503 response. A dedicated health endpoint that returns the *current* daily spend + remaining budget would let me put a small status pill on the chat UI ("$1.42 / $10.00 used today") so visitors know the agent is alive before they type the first message.

## What this is not

- **Not a general-purpose chat product.** It's a portfolio agent with a fixed scope. If a user asks about something unrelated to Drew's work, the system prompt instructs the agent to redirect.
- **Not a production AI platform.** No SLA, no support, no auth. The cost cap is on a personal-budget scale. A real customer-facing chat product would need observability, fallback models, content safety filters, and a much bigger budget envelope.
- **Not the agent itself.** I built the *plumbing* around an off-the-shelf Anthropic model. I didn't train the model; I didn't write the inference engine. The interesting work is the operational layer — rate limiting, cost control, streaming, system-prompt design — not the underlying intelligence.

## Source

- Worker: [github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent](https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent)
- Live: the chat dock on [drewmalhotra.com](/)
- System prompt: source-of-truth in `workers/agent/src/index.js`, ~120 lines starting at the `SYSTEM_PROMPT = ` constant
- Companion post: [The honesty playbook](/writing/honesty-playbook) covers why the agent's training data needed the same scrub as the rest of the site
