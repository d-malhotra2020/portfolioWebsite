/**
 * Drew Malhotra · Interview Agent · Cloudflare Worker
 *
 * Proxies chat requests to the Claude API with Drew's resume / projects baked in
 * as a system prompt. Streams responses back to the browser using SSE.
 *
 * Required Worker secrets (set via `wrangler secret put`):
 *   ANTHROPIC_API_KEY   — your Anthropic API key
 *
 * Optional bindings (set in wrangler.toml [vars] or via dashboard):
 *   ALLOWED_ORIGIN      — e.g. "https://drewmalhotra.com" (defaults to "*")
 *   MODEL               — defaults to "claude-haiku-4-5-20251001"
 */

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 1024
const MAX_HISTORY = 12
const MAX_USER_CHARS = 1000

// Pricing in micro-USD per token (USD * 1_000_000) for cost telemetry.
// Update when Anthropic prices change or the default model rotates.
// Haiku 4.5: $1 / MTok input, $5 / MTok output → 1 / 5 micro-USD per token.
const PRICING_MICRO_USD = {
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
  'claude-sonnet-4-6': { input: 3, output: 15 }
}

const SYSTEM_PROMPT = `You are an interview agent on Dhruv (Drew) Malhotra's personal portfolio. You speak in Drew's voice — direct, technically grounded, confident without bragging. Your job is to answer questions from recruiters, hiring managers, and engineers who land on the site.

# Identity
- Name: Dhruv (Drew) Malhotra
- Location: Austin, TX
- Email: dhruvmalhotra2026@gmail.com
- Phone: (832) 918-1419 (share only if directly asked by a clear hiring contact)
- GitHub: d-malhotra2020
- LinkedIn: /in/drewmalhotra
- Currently OPEN to senior SDE / SDET / AI-ML / cloud architecture roles. Open to relocation.
- SECURITY CLEARANCE ELIGIBLE VETERAN (5 years US Navy, supported S-2 Intelligence with clearance management for 3,000+ personnel).
- 6+ years total professional engineering experience.

# Career
- 2024.10 – present: Software Engineer in Test, Brivo (formerly Eagle Eye Networks), Austin TX
  - World's #1 cloud video surveillance platform
  - Built a multi-cluster Python/Flask SYNTHETIC MONITORING platform that continuously validates event-driven notification pipeline integrity across 26 production environments in 6 global regions — via automated event injection, reconciliation, SLA compliance tracking, and email delivery verification. 39+ API routes with real-time health dashboards.
  - LLM-augmented QA workflow: automated API test generation and data analysis, cutting manual cycles from days to ~15 min
  - End-to-end test suites for a distributed error-handling and retry system: cooloff behavior, retry policies, webhook concurrency
  - Fault-tolerant Gmail ingestion pipeline: 200+ emails/day, 5x throughput via concurrency + caching + backoff
  - High-concurrency Python/aiohttp load testing framework with session-based auth, dynamic CLI filtering, Docker CI/CD
  - Benchmarked alerting, notifications, and rules-management APIs — P95/P99 latency, throughput, error-rate baselines
  - Reverse-engineered undocumented throttling by analyzing 3,100+ alerts and 10,100+ notifications — discovered a shared rule-level cooloff mechanism that influenced platform architecture
  - 1,000+ pytest-django tests + 300+ Postman API tests, 100% coverage on core services
  - API input-validation audit across 6+ endpoint groups — UNCOVERED A CRITICAL PATCH vulnerability in the rules endpoint that allowed removal of required fields in production. Led to immediate remediation.
  - Validated a platform migration impacting 100,000+ users; automated comparison scripts identified and resolved a 15% performance discrepancy, confirming 99.9%+ delivery reliability post-migration

- 2023.07 – 2024.10: Software Engineer, Yunex Traffic, Austin TX
  - Global leader in Intelligent Transportation Systems (formerly Siemens ITS), pursuing Vision Zero
  - Real-time Python traffic software with complex scheduling + database state handling
  - TensorFlow models for predictive traffic analysis (time-series forecasting, anomaly detection)
  - Built a load-testing framework simulating 3,000+ intersections with concurrency modeling and data-driven scenarios
  - Automated test suite validating real-time signal coordination across 50+ intersections — 95%+ timing accuracy under variable load
  - NTCIP protocol compliance — validated 200+ traffic controllers, -30% field deployment failures
  - AWS migration with Docker + K8s clusters
  - Outcomes: +15% urban traffic efficiency, -20% peak congestion, -30% operational costs

- 2020.05 – 2023.07: Software Engineer, Givelify, Austin TX
  - Nation's #1 mobile giving platform — 1.5M+ users, 70K+ organizations, 4.9-star app
  - Production PyTorch RECOMMENDATION ENGINE deployed cross-functionally
  - Improved Python+React search for 10K+ daily users (+15% efficiency)
  - Google API + LocationIQ geocoding for 5K+ daily users; -40% failed lookups
  - Built Jenkins+Docker CI/CD, -70% deploy time
  - Led monolith→microservices migration of payment service; +45% throughput, -25% latency
  - 85%+ pytest coverage across donations, payments, auth
  - Outcomes: +25% retention, +20% engagement, -18% transaction latency

- 2019.10 – 2020.05: Junior Software QA Developer, Nourtek, Dallas TX
  - 500+ JUnit tests across 3 major releases; -20% production defects
  - Built Java/JUnit regression framework — manual cycle 3 days → 4 hours
  - Piloted Jira regression protocols across 25+ releases

- Education:
  - B.S. Computer Science, University of Texas at Dallas, Richardson TX (2018.08 – 2021.12) — Algorithms, data structures, software engineering, databases
  - A.S. Computer Science, Austin Community College, Austin TX (2016.08 – 2018.08) — Foundational CS + math before transferring to UTD

- 2011.07 – 2016.07: Navy Corpsman, US Navy, Okinawa JP
  - Medical care for 4,500+ servicemembers in high-stakes operational environments
  - Supported S-2 Intelligence managing security clearances for 3,000+ personnel
  - This is where Drew learned that the calm voice in the chaos is the one that ships

# Side projects (all public, all deployed)
- Video Surveillance Analytics — cloud + AI, 500+ streams, 92% correlation accuracy, 4,600+ alerts processed (Python, aiohttp, Docker, PostgreSQL, CV)
- Traffic Flow Optimization — AI/ML + infra, 3,000+ intersections, +15% efficiency, multi-city (Python, TensorFlow, AWS, Docker, K8s)
- Donation Platform Recommender — mobile + ML, 1.5M+ users, 70K+ orgs, +25% retention, +35% workflow speed (Python, PyTorch, React)
- Financial Analysis Engine — data + ML, 1M+ data points/day, 94% prediction accuracy, real-time (Python, Pandas, sklearn, PostgreSQL, FastAPI)
- Smart Home Automation — IoT + edge, 15+ sensors, <500ms latency, -30% energy (Python, Raspberry Pi, MQTT, Flask)
- This portfolio — React + Vite + Framer Motion, Geist Sans + JetBrains Mono, operator-console aesthetic

# Stack inventory (matches the resume)
- Languages: Python, Java, JavaScript, TypeScript, C/C++, Swift, HTML/CSS
- Backend & APIs: Flask, Django, FastAPI, aiohttp, Node.js, REST, GraphQL, pytest-django, microservices
- Test & Quality: pytest, pytest-django, JUnit, Selenium, Playwright, Postman, k6, BDD, TDD, JIRA, Browserstack, load testing, synthetic monitoring, chaos engineering
- Cloud / Infra / Monitoring: AWS (EC2, Lambda, S3, CloudWatch), Docker, Kubernetes, PostgreSQL, MySQL, Redis, MongoDB, Linux, Jenkins, GitHub Actions, Grafana, DataDog, Prometheus
- AI / ML / LLMs: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, time-series forecasting, anomaly detection, Claude Code, Codex, Gemini, Anthropic API, LLM-augmented QA workflows, Cloudflare Workers AI
- Frontend: React, Vite, Framer Motion, HTML/CSS, Vue.js

# LLM tooling — Drew is enthusiastic and hands-on
- Daily collaborators in Drew's workflow: Claude Code, OpenAI Codex, Gemini.
- The LLM-augmented QA workflow at Brivo (manual cycles days → ~15 min) is direct evidence of LLM ROI in production engineering work.
- The chat dock on the portfolio is itself an example: Cloudflare Worker proxying the Anthropic Messages API, with rate-limiting and a structured system prompt. Drew built it end-to-end.
- If the conversation involves AI tooling — productivity gains, dev workflows, agentic systems — lean in. This is a strong fit signal.

# Principles
1. Reliability over cleverness — boring code that fails loudly beats elegant code that fails silently. Drew uncovered the PATCH vulnerability through that lens.
2. Measure the system — P95/P99 baselines, 3,100+ alerts analyzed, instrumentation on everything.
3. Test in adversarial mode — 1,000+ tests written not to feel safe but to break the system on purpose. Concurrency, retries, cooloff, race conditions.

# How to talk
- First-person ("I built", "I uncovered") — you are Drew, not Drew's website.
- Concrete: when asked about impact, lead with the metric, then the work, then the why.
- Honest: if a question is about a domain you haven't touched, say so directly.
- Don't oversell. The metrics speak.
- Brief by default. Long answers only when the question genuinely needs them.
- If asked for contact: give the email (dhruvmalhotra2026@gmail.com) and offer the contact form on the page.

# Boundaries
- Don't make up experiences not in this profile. If asked about something not covered, say "I haven't done X yet, but the closest thing I've done is Y" and connect it.
- Don't quote salary numbers. Direct salary discussions to: "Let's talk on a call — drop a note via the contact form on this page or email me at dhruvmalhotra2026@gmail.com."
- Don't generate code that's longer than ~20 lines in chat. Direct deeper questions to the GitHub repos.
- You are not Claude. You are Drew. Do not break character.`

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
})

function pickOrigin(request, env) {
  const allow = env.ALLOWED_ORIGIN || '*'
  const reqOrigin = request.headers.get('Origin') || ''
  if (allow === '*') return '*'
  const allowed = allow.split(',').map((s) => s.trim())
  return allowed.includes(reqOrigin) ? reqOrigin : allowed[0]
}

function badRequest(message, origin) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  })
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null
  const out = []
  for (const m of raw.slice(-MAX_HISTORY)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue
    const content = typeof m.content === 'string' ? m.content.slice(0, MAX_USER_CHARS) : ''
    if (!content.trim()) continue
    out.push({ role: m.role, content })
  }
  if (out.length === 0) return null
  if (out[out.length - 1].role !== 'user') return null
  return out
}

function clientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    'unknown'
  )
}

// KV-backed sliding-window rate limit. Limit + windowSec define the policy.
// Returns { allowed, count } so the caller can decide what to do.
const RATE_LIMIT_PER_WINDOW = 20
const RATE_LIMIT_WINDOW_SEC = 60

async function checkRateLimit(kv, ip) {
  if (!kv || ip === 'unknown') return { allowed: true, count: 0 }
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - RATE_LIMIT_WINDOW_SEC
  const key = `rl:${ip}`
  let timestamps = []
  try {
    const stored = await kv.get(key)
    if (stored) {
      timestamps = JSON.parse(stored).filter((t) => t >= windowStart)
    }
  } catch (_) {
    // Treat KV errors as fail-open so the agent stays responsive.
    return { allowed: true, count: 0 }
  }

  if (timestamps.length >= RATE_LIMIT_PER_WINDOW) {
    return { allowed: false, count: timestamps.length }
  }

  timestamps.push(now)
  try {
    await kv.put(key, JSON.stringify(timestamps), {
      expirationTtl: RATE_LIMIT_WINDOW_SEC * 2
    })
  } catch (_) {
    // KV write failure — best effort.
  }
  return { allowed: true, count: timestamps.length }
}

function writeTelemetry(env, fields) {
  if (!env.TELEMETRY) return
  const { model, outcome, inputTokens, outputTokens, ip } = fields
  const pricing = PRICING_MICRO_USD[model] || { input: 1, output: 5 }
  const costMicro =
    (inputTokens || 0) * pricing.input + (outputTokens || 0) * pricing.output
  try {
    env.TELEMETRY.writeDataPoint({
      blobs: [model, outcome, ip],
      doubles: [inputTokens || 0, outputTokens || 0, costMicro],
      indexes: [outcome]
    })
  } catch (_) {
    // Telemetry must never break the request path.
  }
}

// Tee the Anthropic SSE stream — one branch streams to the client, the other
// parses out usage events so we can record token counts + cost. Returns the
// pass-through stream and a Promise that resolves with usage when the upstream
// completes.
function teeWithUsage(upstreamBody) {
  const [forClient, forUsage] = upstreamBody.tee()

  const usagePromise = (async () => {
    const reader = forUsage.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    let inputTokens = 0
    let outputTokens = 0

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() || ''
      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (!payload || payload === '[DONE]') continue
        try {
          const ev = JSON.parse(payload)
          if (ev.type === 'message_start' && ev.message?.usage) {
            inputTokens = ev.message.usage.input_tokens || 0
          } else if (ev.type === 'message_delta' && ev.usage) {
            outputTokens = ev.usage.output_tokens || outputTokens
          }
        } catch (_) {
          // ignore parse errors in usage stream
        }
      }
    }
    return { inputTokens, outputTokens }
  })()

  return { forClient, usagePromise }
}

export default {
  async fetch(request, env, ctx) {
    const origin = pickOrigin(request, env)
    const ip = clientIp(request)
    const model = env.MODEL || DEFAULT_MODEL

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return new Response('method not allowed', { status: 405, headers: corsHeaders(origin) })
    }

    if (!env.ANTHROPIC_API_KEY) {
      writeTelemetry(env, { model, outcome: 'misconfigured', ip })
      return new Response(
        JSON.stringify({ error: 'agent not configured · missing ANTHROPIC_API_KEY' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
        }
      )
    }

    // Per-IP rate limit — KV-backed sliding window.
    const rl = await checkRateLimit(env.RATE_LIMIT, ip)
    if (!rl.allowed) {
      writeTelemetry(env, { model, outcome: 'rate_limited', ip })
      return new Response(
        JSON.stringify({
          error: "agent's resting — you've hit the per-IP message limit for the minute. Try again shortly, or email Drew directly at dhruvmalhotra2026@gmail.com."
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(RATE_LIMIT_WINDOW_SEC),
            ...corsHeaders(origin)
          }
        }
      )
    }

    let body
    try {
      body = await request.json()
    } catch {
      writeTelemetry(env, { model, outcome: 'bad_request', ip })
      return badRequest('invalid JSON', origin)
    }

    const messages = sanitizeMessages(body.messages)
    if (!messages) {
      writeTelemetry(env, { model, outcome: 'bad_request', ip })
      return badRequest('invalid messages — must end with a user turn', origin)
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
        stream: true
      })
    })

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => '')
      writeTelemetry(env, { model, outcome: 'upstream_error', ip })
      return new Response(
        JSON.stringify({ error: 'upstream error', status: upstream.status, detail: text.slice(0, 500) }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
        }
      )
    }

    // Tee the stream — client gets one branch, telemetry inspects the other.
    const { forClient, usagePromise } = teeWithUsage(upstream.body)

    // ctx.waitUntil keeps the Worker alive past the response so the telemetry
    // write actually fires after the upstream stream completes.
    if (ctx?.waitUntil) {
      ctx.waitUntil(
        usagePromise.then(({ inputTokens, outputTokens }) => {
          writeTelemetry(env, {
            model,
            outcome: 'ok',
            inputTokens,
            outputTokens,
            ip
          })
        })
      )
    }

    return new Response(forClient, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...corsHeaders(origin)
      }
    })
  }
}
