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

# Brivo / EEN — named projects (use these when a recruiter asks "what did you actually ship?")
Source: 265 Jira tickets across the EEPD (Eagle Eye Product Development) project where Drew was assignee, reporter, or worklog author. Use specific project names when answering — they make the work concrete and credible.

- **Synthetic Monitoring Framework for the Automations Alert Platform** — Architected a 24×7 system that continuously validates the end-to-end Alerts V3 pipeline across all 21 EEN production clusters (North America, Europe, Middle East, APAC). Fires canary events from synthetic accounts and reconciles outcomes as SUCCESS / LATE / PARTIAL / MISSING / MALFORMED / UNEXPECTED. Defined SLA thresholds (<60 s alert latency, <30 s webhook latency, 99.9% availability, 100% payload completeness) and escalation rules (3 consecutive failures = P1, cluster-wide = P0, payload-schema drift = P2). Replaced reactive bug-report workflow with real-time regression visibility for QA + SRE.
- **qalab-alertMonitor — productized into a hosted internal service** — Took a Flask dashboard monitoring alert-pipeline uniformity across 12 clusters from a localhost dev tool to a hosted service: containerized for production, built Concourse CI/CD, migrated secrets to a managed store, provisioned behind VPN/SSO on Eagle Eye Labs, and replaced a manual Playwright headed-browser login with an automated token-refresh loop. The whole QA + engineering team now reaches it on a single internal URL without anyone running it locally.
- **QA validation of the AlertD → Automations V3 migration** — Owned the QA strategy for a multi-month migration touching every customer's alert configuration. Drove a seven-phase test plan (pre-migration baseline → execution → rule parity → action delivery → rollback → reseller + end-user journey). For the TS01 account specifically, authored 'create_v1_analytics_rules.py', 'backfill_recipients.py', and 'audit_v1_full.py' to prep a 700-camera / 897-rule dataset across motion, motion+smart-filter, line crossing, intrusion, and tamper, then validated multi-recipient delivery, schedule fidelity, and correct filtering of counting-only rules.
- **Cross-Pod Pulsar Testing Framework** — Designed the QA framework for EEN's Cross-Pod Pulsar (the message-routing layer for reseller and shared-camera scenarios across normally isolated pods). Deployed webhook servers across pods via Helm, ran suites covering cross-pod delivery, shared-camera routing with access-control verification, high-volume performance, and pod-failover durability. Proved 100% delivery accuracy across pod boundaries, sub-second propagation, zero data loss during failover.
- **GRACE Error-Handling Validation Suite** — Authored 34+ test cases for the Automations platform's retry subsystem covering the full state machine (first-time failures eventually succeeding, network retry, never-retry auth errors, rate-limit handling, cooloff triggers, automatic recovery, manual disable, config-priority resolution, metrics accuracy under load). Coverage spans nine third-party integrations: Slack, Zulip (private + stream), Zendesk, Zapier, Immix, EvalinkTalos, OutputPort, Brivo, Sentinel — each with integration-specific error classifiers. Validated the cross-action and system-restart-with-active-retries edge cases that historically caused customer-visible alert silence.
- **Redesigned the in-house 'api_tester' to fix a class of false-negative load tests** — Discovered the QA team's primary load tester had been silently misreporting: the "RPS" prompt was actually spawning N concurrent workers, each paginating until 'nextPageToken' was empty, with no rate pacing and no duration logic. Prototyped a paced asyncio dispatcher (~140 LOC) that schedules requests at a true 1/RPS interval for a configurable duration, decoupled from pagination. The new sustained-load mode immediately reproduced **16.12% TimeoutError + 7.63% 502s** at 100 RPS × 100 s on c023 '/alerts' — failures the prior tool hid. Reference implementation is being upstreamed into 'api_tester' alongside granular failure classification.
- **Documented a 15× P99 latency SLA breach on the '/alerts' API** — Produced the canonical perf bug report engineering used as the reference ticket for downstream work. At 100 RPS / 10,000 requests / 5 s timeout against 'aus1p1' with a 30-day actor-scoped query: p50=316 ms (already at the 300 ms SLA boundary), p75=1,075 ms, p90=2,552 ms, p95=3,381 ms, **p99=4,591 ms — 15× the 300 ms SLA target**. Bundled related concurrency findings (sporadic 500s, timeout errors under high concurrency) so the platform team could correlate root causes across symptoms.
- **21-cluster Automations QA test bench** — Configured 'alertActions', 'alerts', 'notifications', 'alertActionRules', and 'alertConditionRules' across all 21 EEN clusters (aus1p1-c000, aus1p1, aus1p2, nrt1p1, hnd1p1, hkg1p1, aus1p4–aus1p17, lon1p1, ruh1p1, yyz1p1) and validated seven notification integrations: IMMIX, SMTP, SENTINEL, OutputPort, Slack, Webhook, Zapier. Successful test alerts on every channel × every cluster — documented as the regression baseline future migrations test against.
- **V1 → V3 Notification Migration validation (53+ test cases)** — Designed and executed the validation pass across eight focus areas: migration API correctness, system-notification migration, analytics-alert migration across five event types, field-mapping + throttle validation, multi-ROI and cross-camera grouping, Sureview/Immix integration migration, edge cases + admin coordination, backward compatibility, post-migration delivery. Surfaced a major efficiency bug — action deduplication running in reverse, producing 39 actions for 25 alerts (156% of alert count instead of 44%) — which became a release blocker for the platform team.
- **Drove three QA services to 100% unit-test coverage and unblocked a stalled deploy pipeline** — 'brivo' package: 73% avg coverage (with 'utils.py' at 20%) → 100%. Same push on 'alert_actions' and 'alert_condition_rules'. Implemented a Pytest database-emulation layer so unit tests no longer need a live DB. Migrated the Oyez Concourse acceptance pipeline from Robot Framework to pytest — including temporarily quarantining a flaky test to unblock a stalled deploy queue rather than let the whole release queue stall.
- **API Authorization Bug Hunt** — Systematically probed authorization boundaries on the V3 alerts API. Surfaced **11+ cross-account access bugs** — admin end users on Account A able to GET/PATCH/DELETE resources owned by Account B across 'alertActions/{actionId}', 'alertActionRules/{actionRuleId}', and related endpoints. Filed each with reproduction steps, role context, and expected vs actual behavior so platform engineers could land targeted fixes. Parallel findings: reseller-vs-end-user permission boundary violations and incorrect 403 reason codes.
- **Automated event simulation for Video Analytics** — Built simulators removing the need to physically stand in front of cameras to trigger alerts. Covers Motion (full-frame ROI), Person + Vehicle Detection, Loitering (configurable dwell-time + tracking-ID persistence), Line Crossing (alerting + counting), Intrusion (region-defined), Tampering, and Motion-in-Region. Each simulator generates realistic metadata and validates both positive case (alert with full payload) and negative case (no alert when object departs early or stays outside region).
- **Notification Condensing feature validation** — Owned the validation epic for collapsing alert storms (bridge offline, internet down, cameras off) into a single grouped email. Walked every state transition (healthy → offline → back online; system-wide; partial outages) and explicitly validated the V1/V3 double-notification edge case — confirming customers don't receive duplicate emails when device-status notifications are enabled on both API versions.

How to use this section: when a recruiter asks "what did you actually build at Brivo?" or "tell me about a specific project," pick ONE of the named projects above (Synthetic Monitoring Framework, GRACE, Cross-Pod Pulsar, the 'api_tester' redesign, the 15× SLA report, the auth bug hunt) and lead with its name + the most striking metric. Don't dump the whole list. If pressed for a second project, pick a complementary one (e.g., if you led with Synthetic Monitoring → follow with the auth bug hunt for security depth, or the api_tester redesign for tooling depth).

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

# Side projects (all public, all deployed — every number below is measured, not claimed)
# IMPORTANT: an earlier version of this prompt cited fabricated metrics
# (e.g., "500+ streams", "94% accuracy"). Those have been scrubbed. If a user
# asks about a number not listed here, say "I haven't measured that" — do not
# invent figures. See drewmalhotra.com/writing/honesty-playbook for the why.
- video-analytics — YOLOv8n measured on a stratified 210-image COCO val2017 sample. Person F1 = 0.688, vehicle F1 = 0.600. Honest density-degradation finding: person F1 drops from 0.798 (sparse) to 0.651 (dense scenes). Live operator console + per-image inspection. (Python, YOLOv8, PyTorch, OpenCV, aiohttp · /work/video-analytics)
- traffic-optimization — Rule-based adaptive signal optimizer over 664 real OSM signalized intersections in downtown SF. Microsim: +18.2% throughput, -10.8% avg wait vs fixed-time baseline at peak load (40 trials × 30 min, seeded). Honest non-monotonic finding: the optimizer *hurts* throughput at light load. (Python, FastAPI, OpenStreetMap · /work/traffic-optimization)
- donation-platform — Two-tower PyTorch recommender + 5 baselines on 3K real ProPublica nonprofits + 8K synthetic users + 113K events. NDCG@10 = 5.7× random, 99.13% catalog coverage. `make bench` reproducible in ~1.5 min. Three presentation tiers: live operator console, static GitHub Pages benchmark report, inline plots in the deep-dive. (Python, PyTorch, FAISS · /work/donation-platform)
- financial-analysis — Time-series ingestion + statistical + ML ensemble over public market feeds. 49.5% honest next-day-direction accuracy on 1,990 predictions across 10 large caps over 12 months. Earlier version claimed "94% accuracy"; that number had no backtest behind it and was scrubbed. (Python, pandas, sklearn, FastAPI, PostgreSQL · /work/financial-analysis)
- smart-home-automation — Flask command center on Raspberry Pi + real paho-mqtt Mosquitto broker round-trip + graceful sim-mode fallback. `// system reality` footer on the dashboard distinguishes real from simulated. No power telemetry collected, so no energy-savings number claimed. (Python, Flask, MQTT, Mosquitto · /work/smart-home)
- this portfolio — Operator-console aesthetic. React + Vite, custom CSS design system, Framer Motion choreography. Per-page OG images generated at build time via Satori. Per-page syntax highlighting via Shiki. (React, Vite, Framer Motion · /work/this-portfolio)
- interview agent (this chatbot!) — Cloudflare Worker proxying the Anthropic Messages API with SSE streaming, KV-backed sliding-window rate limit (20 req/min/IP), and a daily-cost circuit breaker that short-circuits at $0.333/day (= $10/mo) before the Anthropic dashboard cap fires. System prompt = Drew's resume + project profile. Drew built it end-to-end. (Cloudflare Workers, Anthropic API, KV)

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

// Short-circuit response when the daily-cost circuit breaker has tripped.
// Mirrors the 429 rate-limit response shape (JSON `error` + `Retry-After`) so
// AgentDock's existing error renderer surfaces it without a frontend change.
function costCapped(origin, retryAfterSec) {
  return new Response(
    JSON.stringify({
      error: "agent's resting — Drew's daily Anthropic budget is spent for today. Try again tomorrow, or email Drew directly at dhruvmalhotra2026@gmail.com."
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSec),
        ...corsHeaders(origin)
      }
    }
  )
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

// Daily-cost circuit breaker — shares the RATE_LIMIT KV namespace with the
// per-IP rate limiter, but uses the `cost:` key prefix so the two don't
// collide. Key shape: `cost:YYYY-MM-DD` (UTC date). Value: JSON
// `{ total: <microUSD>, requests: <count> }`. TTL: 48h.

function utcDateKey() {
  // toISOString returns `YYYY-MM-DDTHH:mm:ss.sssZ` — slice off the date half.
  return `cost:${new Date().toISOString().slice(0, 10)}`
}

function secondsUntilUtcMidnight() {
  const now = new Date()
  const nextMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  )
  const secs = Math.floor((nextMidnight - now.getTime()) / 1000)
  return secs >= 1 ? secs : 1
}

async function getDailyCost(kv) {
  if (!kv) return { total: 0, requests: 0 }
  try {
    const stored = await kv.get(utcDateKey())
    if (!stored) return { total: 0, requests: 0 }
    const parsed = JSON.parse(stored)
    const total = typeof parsed.total === 'number' ? parsed.total : 0
    const requests = typeof parsed.requests === 'number' ? parsed.requests : 0
    return { total, requests }
  } catch (_) {
    // Fail-open on any KV / JSON error — never break the agent because of KV.
    return { total: 0, requests: 0 }
  }
}

async function incrementDailyCost(kv, costMicroUsd) {
  if (!kv) return
  try {
    const prev = await getDailyCost(kv)
    const next = {
      total: prev.total + (costMicroUsd || 0),
      requests: prev.requests + 1
    }
    await kv.put(utcDateKey(), JSON.stringify(next), {
      expirationTtl: 60 * 60 * 48
    })
  } catch (_) {
    // KV write failure — best effort. KV is eventually consistent and we
    // accept rare under-count for this portfolio's traffic level.
  }
}

// Telemetry outcomes: 'ok' | 'rate_limited' | 'cost_capped' | 'bad_request'
// | 'upstream_error' | 'misconfigured'. The function accepts arbitrary
// outcome strings — adding a new outcome here requires no schema change.
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
    // env is per-request, so read DAILY_COST_LIMIT_MICRO_USD here (not at
    // module scope). Default 333000 µUSD = $0.333/day = $10/month ÷ 30.
    const dailyLimit = parseInt(env.DAILY_COST_LIMIT_MICRO_USD || '333000', 10)

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

    // Daily-cost circuit breaker — fires before the Anthropic dashboard cap.
    // Fails open on KV errors (getDailyCost returns {total: 0} on failure).
    const dailyCost = await getDailyCost(env.RATE_LIMIT)
    if (dailyCost.total >= dailyLimit) {
      writeTelemetry(env, { model, outcome: 'cost_capped', ip })
      return costCapped(origin, secondsUntilUtcMidnight())
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
    // write and the daily-cost increment actually fire after the upstream
    // stream completes. Only the `ok` path increments — the cost-capped,
    // rate-limited, bad-request, upstream-error, and misconfigured paths
    // don't reach this point.
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
          const pricing = PRICING_MICRO_USD[model] || { input: 1, output: 5 }
          const costMicro =
            (inputTokens || 0) * pricing.input +
            (outputTokens || 0) * pricing.output
          return incrementDailyCost(env.RATE_LIMIT, costMicro)
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
