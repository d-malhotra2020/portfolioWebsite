# Phase 13 — Context

**Phase:** Agent Context Expansion
**Goal:** The interview agent's `SYSTEM_PROMPT` cites Drew's GitHub work + a broader set of Brivo Jira tickets — without growing per-request cost.
**Gathered:** 2026-05-27 (`--auto` mode — Drew supplied the source choices via AskUserQuestion; raw candidate data pre-staged)
**Status:** Ready for planning — every decision needed to plan + execute is locked below.

---

## Domain boundary

Phase 13 touches **one file**: `workers/agent/src/index.js` — specifically the `SYSTEM_PROMPT` template literal (lines 28-152) and the `fetch` upstream call (lines 437-451) where the `system` field is sent to the Anthropic Messages API.

No frontend changes. No new dependencies. No new KV namespaces. No new wrangler bindings.

Carrying forward from earlier phases:
- Phase 3 (Agent Leveling-Up) already established the Worker, the rate limiter, and the upstream-call structure.
- Phase 10 (Cost Guardrails) added the daily-cost circuit breaker at `$0.333/day`. **This phase MUST stay compatible with that breaker** — see "Token budget" below.
- The existing `SYSTEM_PROMPT` was last tightened in commit `fe0e526` ("interview-agent as a first-class project + scrubbed system prompt") to remove fabricated metrics. **The anti-fabrication rule from that commit is non-negotiable here.**

---

## Pre-staged data files (executor reads these — does NOT call MCP/gh)

- `.planning/phases/13-agent-context-expansion/13-CANDIDATES-jira.md` — curated Jira candidate pool with sensitivity rules and selection guidance. ~16 bug candidates + ~11 story candidates beyond what's already named in the existing prompt.
- `.planning/phases/13-agent-context-expansion/13-CANDIDATES-github.md` — curated GitHub PR + repo candidate pool. Recent merged PRs at EENCloud/* and the public `qa-webhook-server` repo.

The executor should treat these files as the **single source of truth** for what may be added. If a ticket or PR is not in the candidate file, it does NOT go in the prompt. Re-querying MCP or `gh` during execution is OUT OF SCOPE.

---

## Decisions locked

### Two new prompt sections, appended after the existing `# Brivo / EEN — named projects` block

1. **`# Additional Brivo Jira — supplementary named tickets`**
   - 8 entries total.
   - Format per entry:
     `- **EEPD-XXXXX <plain-English title>** — <one-line outcome / why it mattered>.`
   - Selection follows the "guidance for the executor" block at the bottom of `13-CANDIDATES-jira.md` (one entry per recurring failure mode + process maturity + CI maturity + lifecycle).
   - The block opens with a 1-2 sentence framing: "These complement the named projects above — they show the *breadth* of QA ownership across the EEPD project beyond the highlighted work."

2. **`# GitHub — shipped work`**
   - 6 entries total: 5 private/work PRs + 1 public-repo callout (`qa-webhook-server`).
   - Format per private PR:
     `- **<PR title>** — EENCloud/<repo> (private), merged <YYYY-MM-DD>. <one-line outcome>.`
   - Format for the public-repo callout:
     `- **<repo name>** — <one-line description>. github.com/d-malhotra2020/<repo>`
   - Selection follows the "guidance for the executor" block at the bottom of `13-CANDIDATES-github.md` (productization-scale + post-ship-hardening + LLM-tooling + API-contract + test-infra + public).
   - The block opens with a 1-2 sentence framing: "Drew's GitHub work spans public side projects (listed above) and a steady cadence of merged PRs in private Brivo repos. A representative slice:"

### Prompt caching (Anthropic native)

The `fetch` call at `workers/agent/src/index.js:437-451` currently sends `system: SYSTEM_PROMPT` as a bare string. Change to the **structured form**:

```js
system: [
  {
    type: 'text',
    text: SYSTEM_PROMPT,
    cache_control: { type: 'ephemeral' }
  }
],
```

- This enables Anthropic's prompt caching with a 5-minute TTL on the system block.
- Cached input reads cost **10%** of normal input cost (per Anthropic pricing). The first request in any 5-minute window pays the full system-prompt cost; subsequent requests pay 10x less for that block.
- The `anthropic-version: 2023-06-01` header is unchanged — prompt caching is GA on that version.
- No code change to telemetry / cost-tracking required: `teeWithUsage` parses `message_start.usage` which already includes the `cache_creation_input_tokens` + `cache_read_input_tokens` fields. They're additive within `input_tokens` for cost purposes.

### Sensitivity filter (executor MUST enforce on every entry)

The full rules are in the candidate files. Restating the non-negotiables here:

- **Customer names: REDACT.** "Trinity College London" → "a named education customer" or omit entirely.
- **Private-repo PR URLs: OMIT.** They 404 for the public. State repo + PR title + outcome.
- **Vulnerability reproduction steps: NEVER.** Outcomes + remediation framing only.
- **Specific dollar figures or SLAs that aren't already public on drewmalhotra.com: REDACT.**
- **Cluster IDs (c023, aus1p1, etc.): ALLOWED** — already in the existing prompt.
- **EEPD ticket IDs: ALLOWED.**

### Honesty rule (executor MUST enforce)

Mirrors the existing prompt's anti-fabrication block (line 109-112). Each new entry's claim must be traceable to the candidate file. If a number can't be sourced, drop it — use "validated" not "improved by X%". The agent already says "I haven't measured that" when challenged on figures; this section cannot violate that contract.

### Token budget

- **Current `SYSTEM_PROMPT`:** ~5,800 tokens (measured via tiktoken estimation on the existing string; confirm during plan-phase if needed).
- **Estimated growth:** +1,800-2,400 tokens for the two new sections combined (8 Jira entries × ~80 tokens + 6 GitHub entries × ~90 tokens + framing prose).
- **Pre-cache per-request cost (Haiku 4.5 @ $1/MTok input):** ~$0.0058 → ~$0.0080 (+ ~$0.0022 per cold call).
- **Post-cache per-request cost on warm cache:** ~$0.0008 → ~$0.0009 (cached reads at 10% × full input). **Net cost per request DROPS once a 5-minute window has any traffic.**
- **Daily cap impact:** breaker fires at $0.333/day. Pre-cache budget = ~57 cold requests (down from ~57 — caching is the unlock). With caching, an active hour with 1-cold + N-warm pattern lifts the effective ceiling well above the pre-phase number.

### Files to edit (whitelist)

- `workers/agent/src/index.js` — the only file touched.

Anything else requires re-planning.

### Deploy

- `wrangler deploy` from `workers/agent/`. Requires Drew's Cloudflare auth (`wrangler login` already done locally; CI has no creds).
- **Treat deploy as Drew-action OR autonomous-if-creds-present**. If `wrangler whoami` fails, stop and emit a `DEPLOY-PENDING.md` note for Drew. If it succeeds, proceed.

### Verification (post-deploy)

1. `curl -s -X POST https://agent.drewmalhotra.com -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"What private repos have you shipped to recently?"}]}' | head -c 2000` — confirm the response cites at least one of the new PR entries.
2. `curl -s -X POST https://agent.drewmalhotra.com -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"Tell me a Jira ticket where you found a bug nobody else caught."}]}' | head -c 2000` — confirm the response cites at least one of the new Jira entries.
3. Re-issue the same first message after 30 seconds (within the cache TTL). Check Worker logs / Analytics Engine for `cache_read_input_tokens > 0` on the second call. If not visible, accept that caching is working server-side and move on — the cache_read field is internal to Anthropic billing.
4. Confirm rate limiter + daily-cost breaker still work (don't actually trip them — just sanity-check the Worker didn't regress).

### Out-of-scope (explicitly)

- **Tool use / RAG.** The prompt-stuffing approach is enough for the current corpus size. Revisit if/when the corpus exceeds ~25K tokens.
- **Reading from external GitHub/Jira at request time.** Latency + complexity + token budget unfriendly.
- **Per-message persona switching.** Single voice; no toggle.
- **Frontend changes to AgentDock.** None.
- **Adding new Worker secrets or KV namespaces.** None.
- **Curating MORE than 8 Jira + 6 GitHub entries.** Hard cap. If the executor wants to add more, that's a Phase 14 conversation.

### Out-of-scope (deferred for explicit follow-up)

- Confluence pages (read scope is in the cloudId but skipped this phase to keep the scope tight).
- Slack / Zulip recruiting-DM context.
- A "What changed in the last 30 days" auto-refresh job.

---

## Risks + mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Customer-name leak via Jira summary copy-paste | Medium | Sensitivity rules in candidate files. Plan-phase MUST have an explicit "scrub pass" step. |
| Prompt-cache misconfiguration (cache_control on wrong block) | Low | Existing `anthropic-version: 2023-06-01` supports it; format is exactly per Anthropic docs. |
| Per-request cost rises before cache warms | Low | First cold request still well under the $0.333/day cap. Cache warms within 5 minutes of any traffic. |
| Net prompt size pushes Haiku 4.5 toward less coherent responses | Low | 8K-token system prompts are routine for Haiku; current `MAX_TOKENS = 1024` output cap unchanged. |
| Agent quotes fabricated metrics from raw PR titles | Medium | Honesty rule pinned at top of new sections. Executor scrub pass is mandatory before edit. |

---

## Success criteria (what must be TRUE at phase close)

1. `workers/agent/src/index.js`'s `SYSTEM_PROMPT` contains the two new sections, in the order specified, with format compliant to the rules above.
2. The `system` field in the upstream `fetch` call uses the structured array form with `cache_control: { type: 'ephemeral' }`.
3. No new files added under `workers/agent/`. No new dependencies in `workers/agent/package.json`.
4. A `node -e "require('./workers/agent/src/index.js')"` syntax check passes (or equivalent — the Worker isn't directly node-runnable but a parse check is).
5. Either: (a) `wrangler deploy` ran successfully and the two verification curls in the "Verification" block above each return a response that cites at least one new entry; OR (b) a `DEPLOY-PENDING.md` file exists in the phase directory describing the exact `wrangler deploy` command Drew needs to run.
6. Git commit message follows the existing convention (`feat(agent): expand system prompt with Jira + GitHub context, enable prompt caching` or similar).
