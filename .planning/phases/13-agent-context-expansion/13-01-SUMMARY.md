---
phase: 13-agent-context-expansion
plan: 01
subsystem: agent
tags: [anthropic, prompt-caching, system-prompt, agent-context, jira, github]

# Dependency graph
requires:
  - phase: 03-agent-leveling-up
    provides: SYSTEM_PROMPT + upstream fetch call + teeWithUsage (parses message_start.usage which already covers cache_creation + cache_read tokens)
  - phase: 10-cost-guardrails
    provides: Daily-cost circuit breaker @ $0.333/day — Phase 13 stays compatible because prompt caching makes the per-request cost DROP once cache warms (within 5 minutes of any traffic)
provides:
  - "SYSTEM_PROMPT contains two new sections: `# Additional Brivo Jira — supplementary named tickets` (8 EEPD entries) and `# GitHub — shipped work` (5 private PRs + qa-webhook-server public callout)"
  - "Upstream Anthropic Messages API call uses structured `system` array with `cache_control: { type: 'ephemeral' }` — enables 5-minute prompt caching on the system block"
affects: [13-02-deploy-verification, agent-cost-curve]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Anthropic prompt caching via `cache_control: { type: 'ephemeral' }` on the system block — cached reads cost 10% of normal input"
    - "Structured `system` field as an array of typed blocks (vs bare string) — required to opt into prompt caching"
    - "Anti-fabrication discipline: every Jira / GitHub entry traces to the staged candidate file; no invented metrics"

key-files:
  created: []
  modified:
    - workers/agent/src/index.js

key-decisions:
  - "Inserted the two new sections RIGHT AFTER the existing `# Brivo / EEN — named projects` block's `How to use this section:` paragraph, BEFORE the Yunex career entry — keeps the narrative flow: depth (named projects) → breadth (Jira tickets) → shipped artifacts (GitHub) → chronological resume continues"
  - "Picked 8 Jira entries spanning 8 distinct failure-mode categories (input validation, state cleanup, cascading state, dedup/idempotency, i18n, process maturity, CI maturity, data lifecycle) per CANDIDATES-jira.md guidance — so the agent can field varied recruiter questions without repeating the same example"
  - "Picked 6 GitHub entries (5 private + 1 public) covering the 6 categories in CANDIDATES-github.md guidance: productization scale, post-ship hardening, LLM tooling, API-contract correctness, test infra, public artifact"
  - "Customer names redacted across all entries — none of the 8 chosen Jira entries reference customer names in the candidate file, so this was a check-not-a-fix"
  - "Private-repo URLs omitted — only repo name + PR title + outcome, per CONTEXT.md sensitivity rule"
  - "No fabricated metrics — used `(61 files)` and `(31 files)` from PR metadata, not invented percentages"

patterns-established:
  - "Phase 13 staged-candidate pattern: pre-curate raw MCP / gh output into `13-CANDIDATES-*.md` during context-gathering, executor selects DOWN from a fixed pool during plan-execution — keeps autonomous execution deterministic without re-querying external services"
  - "Prompt expansion + caching ship as a single atomic commit — the two changes are causally linked (cache_control offsets the +tokens cost) so they should not land separately"

requirements-completed: [REQ-AGENT-13]

# Metrics
duration: 8min
completed: 2026-05-27
---

# Phase 13 Plan 01: SYSTEM_PROMPT Expansion + Prompt Caching Summary

**Two new sections appended to the interview agent's `SYSTEM_PROMPT` (8 Brivo Jira tickets + 6 GitHub entries) AND the upstream Anthropic `system` field switched to the structured array form with `cache_control: { type: 'ephemeral' }` to enable 5-minute prompt caching — both shipped in a single atomic commit.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-27 20:30 CDT
- **Completed:** 2026-05-27 20:38 CDT
- **Tasks:** 4 / 4 (curate, insert, switch system field, commit)
- **Files modified:** 1
- **Commits:** 1 (`72076e0`)

## Accomplishments

- `workers/agent/src/index.js` SYSTEM_PROMPT now contains:
  - `# Additional Brivo Jira — supplementary named tickets` block (line 74) — 8 entries: EEPD-117237 (input validation), EEPD-108893 (state cleanup), EEPD-96197 (cascading state), EEPD-92085 (dedup), EEPD-106035 (i18n), EEPD-74866 (process maturity), EEPD-75169 (CI maturity), EEPD-80160 (data lifecycle).
  - `# GitHub — shipped work` block (line 86) — 6 entries: qalab-alertMonitor PR #1 (productization), qalab-alertMonitor PR #4 (post-ship hardening), test-tools PR #25 (Claude Context System), api-v3-documentation PR #1400 (PATCH docs), concourse-pipelines PR #2684 (test infra unblock), qa-webhook-server (public callout).
- Upstream fetch body's `system` field (line ~467-475) switched from bare string to structured array with `cache_control: { type: 'ephemeral' }`. The `anthropic-version: 2023-06-01` header already supports prompt caching (GA), no header change required.
- `node --check workers/agent/src/index.js` exits 0 — every backtick inside the SYSTEM_PROMPT template literal remains properly escaped.
- Single atomic commit `72076e0` containing exactly `workers/agent/src/index.js` (no README, no wrangler.toml, no frontend).

## Task Commits

1. **Tasks 1-4: Curate + insert + switch system field + commit** — `72076e0` (feat)

## Files Created/Modified

- `workers/agent/src/index.js` — appended two new sections to SYSTEM_PROMPT (28 added lines) + switched the upstream `system` field from `SYSTEM_PROMPT` to `[{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }]` (+7 / -1 lines on the fetch body).

## Decisions Made

- **Insertion point.** Placed the two new sections between the existing `# Brivo / EEN — named projects` block's closing "How to use this section:" paragraph and the next career entry (Yunex). This preserves the narrative arc: named projects (depth) → supplementary tickets (breadth) → shipped artifacts (proof) → chronological resume continues.
- **Anti-fabrication.** Every Jira entry's outcome line is paraphrased from the candidate file's description. Every GitHub entry uses only the file-count + merge-date metadata that was actually in the PR title or candidate file. No invented percentages, no fictional customer names.
- **Public repo callout format.** Used `github.com/d-malhotra2020/qa-webhook-server` (no `https://`) per CONTEXT.md's locked format — keeps it readable without making the agent emit raw URLs in conversation.

## Deviations from Plan

None. Plan was followed verbatim. The selection guidance in `13-CANDIDATES-jira.md` and `13-CANDIDATES-github.md` was pre-bracketed by the user in the executor prompt; the executor's job was to apply it.

## Issues Encountered

- **Pre-existing staged files.** When the executor entered Plan 13-01, `git status` showed several pre-existing staged files from prior orchestrator runs (PROJECT.md, ROADMAP.md, DEFERRED-DREW.md notes for earlier phases). Per executor instructions ("Do NOT touch `.planning/ROADMAP.md` or `.planning/STATE.md`"), I ran `git reset HEAD` before committing to ensure Plan 13-01's atomic commit contained only `workers/agent/src/index.js`. The previously-staged files are now unstaged but still present in the working tree — the orchestrator can handle them per its own rules.

## User Setup Required

None. Plan 13-01 is fully autonomous. Deploy is Plan 13-02.

## Next Phase Readiness

- Plan 13-02 can proceed immediately. The Worker source is ready to deploy; the cache_control is already wired; the system prompt has been validated to parse.

## Self-Check: PASSED

- `grep -n "# Additional Brivo Jira" workers/agent/src/index.js` returns line 74 (verified).
- `grep -n "# GitHub — shipped work" workers/agent/src/index.js` returns line 86 (verified).
- `grep -n "qa-webhook-server" workers/agent/src/index.js` returns line 94 (verified).
- `grep -n "cache_control: { type: 'ephemeral' }" workers/agent/src/index.js` returns line 473 (verified).
- `node --check workers/agent/src/index.js` exits 0 (verified).
- Commit `72076e0` present; diff is exactly `workers/agent/src/index.js` (verified).

---
*Phase: 13-agent-context-expansion*
*Completed: 2026-05-27*
