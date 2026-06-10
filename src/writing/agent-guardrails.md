## The agent that can ruin my credibility faster than any bug

The chat dock on this site speaks as me. That's the pitch — a recruiter types "what did you ship at Brivo?" and gets a streamed, first-person answer citing real projects. It's also the risk. A portfolio bug costs me a broken layout; an agent that invents a metric in my voice costs me the thing the whole site is built to earn.

So I treated it the way I treat any system at work: enumerate the failure modes first, then build a guard for each one. The four that matter for an agent speaking on my behalf:

1. **Fabrication** — the model confidently quotes a number I never measured.
2. **Cost runaway** — someone scripts requests against the endpoint and my Anthropic bill becomes the story.
3. **Abuse** — one IP hammers the worker and the agent is down for everyone else.
4. **Silent degradation** — any of the above happens and I don't find out until a recruiter does.

The [deep-dive](/work/interview-agent) covers the architecture (Cloudflare Worker, SSE end-to-end, why not RAG). This post is about the guardrails — the part of the system that exists because I assume it will be used adversarially, including by the model itself.

## Guard 1: a system prompt that knows its own history

The agent's knowledge is a ~5,000-token system prompt: résumé, named projects, measured side-project numbers. An earlier version of that prompt contained the same fabricated metrics I scrubbed from the rest of the site in [the honesty playbook](/writing/honesty-playbook) — which meant the agent was happily quoting "94% accuracy" to anyone who asked, undoing the cleanup everywhere else. The prompt is just another surface a fabricated claim can live on.

The fix is structural, not aspirational. The prompt now carries an explicit confession-and-rule block:

```text
# IMPORTANT: an earlier version of this prompt cited fabricated metrics
# (e.g., "500+ streams", "94% accuracy"). Those have been scrubbed. If a user
# asks about a number not listed here, say "I haven't measured that" — do not
# invent figures.
```

Two design choices around it do most of the work:

- **Every quotable number lives in the prompt verbatim.** The model never has to "remember" a metric — it either reads 0.688 off the page or says it hasn't measured it. Closed-world beats well-intentioned.
- **The prompt teaches retrieval discipline, not just facts.** When a recruiter asks "what did you actually build?", an instruction tells the agent to pick **one** named project and lead with its most striking metric, instead of dumping the list. The difference between an agent that sounds like a person and one that sounds like a résumé blender is mostly prompt-side information architecture.

## Guard 2: a rate limit that fails open

Per-IP sliding window in Workers KV: 20 requests a minute, timestamps pruned on every read, ~15 lines of code. The interesting decision isn't the algorithm — it's the failure posture. If the KV read throws, the request is **allowed**:

```js
} catch (_) {
  // Treat KV errors as fail-open so the agent stays responsive.
  return { allowed: true, count: 0 }
}
```

That's backwards from how I'd build a security control at work, and that's the point: this guard protects a $10 budget, not customer data. A KV blip taking the agent down for every legitimate visitor is a worse outcome than sixty seconds of unmetered traffic. Knowing **which** failure direction is cheap is the actual engineering decision; the sliding window is a detail.

## Guard 3: a circuit breaker that fires before the official one

Anthropic's dashboard has a monthly spend cap, and it's a blunt instrument — when it trips, the API just starts refusing mid-conversation. So the Worker runs its own breaker one layer down: every completed request's token usage is priced out in micro-USD and accumulated in a KV key per UTC day. When the day's total crosses **$0.333** (= $10/month ÷ 30), the Worker short-circuits with a clean 503, a `Retry-After` pointing at UTC midnight, and a banner that says the budget is spent — instead of a recruiter watching message 8 of 12 die with no explanation.

Getting the usage numbers without breaking streaming took the one genuinely fun trick in the codebase: you can't read a stream twice, so the Worker **tees** the Anthropic SSE stream — one branch goes straight to the browser, the other is parsed in the background for the `usage` events that carry token counts. `ctx.waitUntil` keeps the Worker alive after the response is returned so the cost write actually lands.

Prompt caching is the quiet half of this guard: the system prompt is sent with `cache_control: ephemeral`, so repeat conversations pay a fraction of the input-token cost. The cheapest token is the one billed at the cached rate.

## Guard 4: telemetry with one honest caveat

Every request path — success, rate-limited, cost-capped, bad request, upstream error, misconfigured — writes a structured data point: model, outcome, token counts, computed cost. Outcomes are indexed, so "how many conversations hit the cost cap this week?" is a query, not an archaeology project. And the telemetry writer is wrapped so it can never break the request path — observability that takes down the thing it observes has negative value.

The caveat, because this site has a rule about claims: the instrumentation is fully wired in the Worker, but the Analytics Engine **dataset binding** is still commented out in `wrangler.toml`, waiting on a dashboard toggle. Until I flip it, the events have nowhere to land. Instrumented is not the same as collecting, and I'd rather say so here than have you find it in the repo.

## The pattern underneath

Every error response — 429, 503, 400 — returns the same JSON shape with the same fields, so the frontend renders all of them through one code path. Every guard fails toward availability, because the blast radius is a hobby budget. Every number the agent can say out loud traces to a line in the prompt, because the agent's voice is mine.

None of this is novel infrastructure. It's the SDET habit applied to an LLM: assume the system lies, assume the tooling misreports, and build the layer that catches both before a user does. The load tester at Brivo taught me that lesson about **other people's** tools. The agent is where I apply it to my own.

## Source

- Worker, guards included: [`workers/agent/src/index.js`](https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent)
- Architecture and key decisions: [the interview-agent deep-dive](/work/interview-agent)
- Why the prompt needed scrubbing: [the honesty playbook](/writing/honesty-playbook)
