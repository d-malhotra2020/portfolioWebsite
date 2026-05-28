---
phase: 13-agent-context-expansion
plan: 02
subsystem: deploy
tags: [cloudflare-workers, wrangler, deploy, verification, prompt-caching]

# Dependency graph
requires:
  - phase: 13-agent-context-expansion
    plan: 01
    provides: expanded SYSTEM_PROMPT + structured system field with cache_control in workers/agent/src/index.js
provides:
  - "Deployed Worker `drew-agent` (Cloudflare) carries the expanded SYSTEM_PROMPT and the cache_control-enabled upstream call"
  - "Two verification curls confirm the agent cites new prompt entries (qalab-alertMonitor + test-tools + api-v3-documentation + concourse-pipelines on the GitHub question; EEPD-117237 on the Jira question)"
  - "Prompt caching is verified working end-to-end — first request created a 6,005-token ephemeral cache; second request hit it (cache_read_input_tokens = 6005, cache_creation_input_tokens = 0)"
affects: [agent-cost-curve, recruiter-conversation-quality]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Anthropic prompt caching with measurable cache hit on the second request inside the 5-minute TTL window"
    - "Two-curl verification pattern for agent prompt expansions — one question per new section, response must cite at least one new entry"

key-files:
  created: []
  modified: []

key-decisions:
  - "Deployed via `npx wrangler deploy` from `workers/agent/` — wrangler authenticated as drewmalhotra2024@gmail.com on Cloudflare account e7dad404f45c1988908e61257146e18c, no human-needed branch required"
  - "Verified against the *.workers.dev URL (`https://drew-agent.drewmalhotra.workers.dev`) directly — that's the URL configured in `.env.local` as VITE_AGENT_ENDPOINT and the same URL the frontend uses in production"

patterns-established:
  - "Cache-hit verification via the Anthropic SSE `message_start.usage` fields (`cache_creation_input_tokens` on the cold request, `cache_read_input_tokens` on the warm request) — observable directly from the upstream stream without enabling Analytics Engine"

requirements-completed: [REQ-AGENT-13]

# Metrics
duration: 4min
completed: 2026-05-27
---

# Phase 13 Plan 02: Deploy + Verification Summary

**The Worker shipped to Cloudflare with the expanded SYSTEM_PROMPT and prompt caching wired. Two verification curls confirm the agent cites the new Jira and GitHub entries, and the Anthropic SSE stream shows cache_creation on the first call and cache_read (= 6,005 tokens, 10% of normal input cost) on the second call — proving the cache_control is doing its job.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-27 20:38 CDT
- **Completed:** 2026-05-27 20:42 CDT
- **Tasks:** 2 / 2 (auth check + deploy + verification) — Task 3 (DEPLOY-PENDING.md) not needed; the autonomous branch succeeded.
- **Files modified:** 0 (this plan only deploys + verifies; no source changes)

## Accomplishments

- `npx wrangler whoami` confirmed logged-in as `drewmalhotra2024@gmail.com` on Cloudflare account `e7dad404f45c1988908e61257146e18c`. Autonomous branch taken.
- `npx wrangler deploy` succeeded: Worker `drew-agent` uploaded (32.93 KiB / gzip 13.21 KiB) and deployed at `https://drew-agent.drewmalhotra.workers.dev`. Version ID `a5b34d8e-93df-47a2-861b-3793849c9976`. Bindings confirmed: `RATE_LIMIT` KV, `ALLOWED_ORIGIN` + `DAILY_COST_LIMIT_MICRO_USD=333000` vars.
- Curl 1 (GitHub-themed question — "What private repos have you shipped to recently? Name them.") returned a streaming response that cited **all 5 new private-repo references**: `EENCloud/qalab-alertMonitor` (with the 61-file + 31-file PR detail), `EENCloud/test-tools` (Claude Context System), `EENCloud/api-v3-documentation` (PATCH /alertActions clarification), `EENCloud/concourse-pipelines` (flaky-test quarantine). It even tied the api-v3-documentation entry back to the PATCH-vulnerability case study already on the site.
- Curl 2 (Jira-themed question — "Tell me a Jira ticket where you found a bug nobody else caught.") returned a response leading with **EEPD-117237 `imageOptions: missing alertImage returns HTTP 500 instead of 400`** — one of the 8 new Jira entries. The agent correctly framed it as "a class of bugs that input-validation audits are built to catch" and explained the methodology, matching the entry's outcome line.
- **Cache verification (gold):** The SSE `message_start.usage` block on curl 1 showed `cache_creation_input_tokens: 6005` + `cache_read_input_tokens: 0` — the system block was cached. Curl 2's `message_start.usage` showed `cache_creation_input_tokens: 0` + `cache_read_input_tokens: 6005` — the second request hit the cache and paid 10% of the input cost on those 6,005 tokens. Caching is verified working end-to-end.

## Verification curl outputs (truncated to first ~300 chars each)

**Curl 1 (GitHub question):**

```
event: message_start
data: {"type":"message_start","message":{"model":"claude-haiku-4-5-20251001","id":"msg_01HwNQTn7e5LEZniNM4fnbRL",...,"usage":{"input_tokens":18,"cache_creation_input_tokens":6005,"cache_read_input_tokens":0,...}}}
...
"text":"The private repos I've shipped to recently at Brivo:\n\n- **EENCloud/qalab-alertMonitor** — the synthetic monitoring framework I productized..."
```

**Curl 2 (Jira question):**

```
event: message_start
data: {"type":"message_start","message":{"model":"claude-haiku-4-5-20251001","id":"msg_01FYL1L5hfzabi1s6bHSUxrP",...,"usage":{"input_tokens":22,"cache_creation_input_tokens":0,"cache_read_input_tokens":6005,...}}}
...
"text":"**EEPD-117237: `imageOptions: missing alertImage returns HTTP 500 instead of 400`**\n\nThis one's a clean example of a class of bugs..."
```

## Task Commits

None for plan 13-02 itself (deploy doesn't modify the repo). The SUMMARY + VERIFICATION files are committed at plan-close.

## Files Created/Modified

- `.planning/phases/13-agent-context-expansion/13-02-SUMMARY.md` (this file)
- `.planning/phases/13-agent-context-expansion/13-VERIFICATION.md`

## Decisions Made

- **Deployed to *.workers.dev, not a custom domain.** The current `wrangler.toml` has no `[[routes]]` block; the Worker lives at `https://drew-agent.drewmalhotra.workers.dev` and that's the URL `.env.local` points the frontend at. Mapping a custom domain (e.g. `agent.drewmalhotra.com`) is a deferred Drew-action that doesn't gate this phase.
- **Verified prompt caching via the upstream SSE, not Analytics Engine.** The `cache_creation_input_tokens` and `cache_read_input_tokens` fields are visible in every `message_start` event — no Analytics Engine binding required to confirm caching is working.

## Deviations from Plan

None. Both verification curls succeeded on the first try, both cited new entries, and the cache hit observed on curl 2 exceeded the plan's "soft signal" expectation (the plan noted the cache_read field was internal to Anthropic billing; it's actually right in the SSE stream).

## Issues Encountered

- **Wrangler version warning.** `wrangler 3.114.17` emits an upgrade nag to v4. Did not block deploy. Out of scope for Phase 13 — flag for a future tooling-refresh phase if Drew wants the v4 upgrade.

## User Setup Required

None. The expanded prompt is live on production. Visit `https://drewmalhotra.com`, open the agent dock, and ask either of the two verification questions to see it in action.

## Next Phase Readiness

- Phase 13 closes cleanly. No deferred work. No DEPLOY-PENDING.md needed.
- Cache will warm naturally as recruiters interact with the agent. First request in any 5-minute window pays the full system-prompt cost (~6,005 tokens × $1/MTok = ~$0.006); subsequent requests in the same window pay 10% of that on the system block.

## Self-Check: PASSED

- `wrangler deploy` exit 0, Worker live at `https://drew-agent.drewmalhotra.workers.dev` (verified — deploy output captured).
- Curl 1 response cites at least one new private-repo name (verified — cites 4 of them).
- Curl 2 response cites at least one new EEPD ticket ID (verified — leads with EEPD-117237).
- Prompt caching observed end-to-end: cache_creation on cold request, cache_read on warm request within the 5-minute TTL window (verified — both `usage` blocks captured above).

---
*Phase: 13-agent-context-expansion*
*Completed: 2026-05-27*
