---
phase: 10-cost-guardrails
plan: 01
subsystem: infra
tags: [anthropic, cost-cap, docs, drew-action, cloudflare-worker]

# Dependency graph
requires:
  - phase: 03-agent-leveling-up
    provides: PRICING_MICRO_USD table + cost telemetry in the Worker that future Worker-side breaker (10-02) will draw from
provides:
  - "workers/agent/README.md ## Anthropic dashboard configuration section — 5-step Drew-action runbook"
  - "Hard-wall half of the two-layer cost defense (Anthropic dashboard cap = $10/mo; alerts at 50% / 90%)"
affects: [10-02-cost-guardrails-worker-breaker, recurring-maintenance]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Drew-action runbook in README — 5 numbered steps, screenshot placeholder, sized to re-follow in under 5 minutes"
    - "Two-layer cost defense narrative: dashboard cap (hard wall) + Worker daily breaker (early warning) told end-to-end in a single README"

key-files:
  created: []
  modified:
    - workers/agent/README.md

key-decisions:
  - "Used $10/mo cap with 50% ($5) / 90% ($9) email alerts (per CONTEXT.md and user instruction; plan body's $5/mo references were stale)"
  - "Section appended at end of README so 10-02's Cost guardrails block can land below it and the two-layer story reads top-to-bottom"
  - "Screenshot placeholder is plain bracketed text (not a Markdown image tag) so it's obviously a placeholder until Drew replaces it"

patterns-established:
  - "Phase 10 docs-then-code split: Drew-action runbooks (10-01) land before code-side counterparts (10-02), so the README never has a dangling reference to a section that doesn't exist yet"

requirements-completed: [REQ-07]

# Metrics
duration: 4min
completed: 2026-05-23
---

# Phase 10 Plan 01: Anthropic Dashboard Configuration Runbook Summary

**Drew-action runbook in `workers/agent/README.md` documenting the 5 clicks to set a $10/mo Anthropic spend cap with 50% / 90% email alerts — the hard-wall half of Phase 10's two-layer cost defense.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-23 (single-task autonomous run)
- **Completed:** 2026-05-24T00:42:00Z
- **Tasks:** 1 / 1
- **Files modified:** 1

## Accomplishments

- New `## Anthropic dashboard configuration` section appended to `workers/agent/README.md` (31 lines, lands cleanly after `## Updating the system prompt`).
- 5 numbered steps documented end-to-end: sign-in URL → set $10 monthly cap → enable 50% ($5) / 90% ($9) alerts → confirm via `wrangler tail` → replace screenshot placeholder.
- Section explicitly frames itself as the **hard wall** and points the reader at the (yet-to-land) `## Cost guardrails` section as the **early warning** — sets up 10-02 to slot in below without a discontinuity.
- Plain-text screenshot placeholder `[Anthropic dashboard cap screenshot — Drew adds]` in place for Drew to drop a PNG into.
- Zero code changes — `workers/agent/src/index.js` and `workers/agent/wrangler.toml` byte-identical to pre-plan state, exactly as scoped.

## Task Commits

1. **Task 1: Append the Anthropic dashboard configuration section to workers/agent/README.md** — `2395ed1` (docs)

**Plan metadata commit:** _added below after SUMMARY commits_

## Files Created/Modified

- `workers/agent/README.md` — appended `## Anthropic dashboard configuration` section (5-step runbook + screenshot placeholder + cross-link to forthcoming Cost guardrails section)

## Decisions Made

- **$10/mo cap, not $5.** The plan body still references $5/$2.50/$4.50 (stale from an earlier planning pass). `10-CONTEXT.md` (final, locked-in version, authored 2026-05-23 in `--auto` mode) and the executor prompt both specify $10/$5/$9 — those are the authoritative numbers. I followed the authoritative source.
- **Placeholder as plain text, not a Markdown image tag.** Easier for future-Drew to spot and replace with either a drag-and-drop on GitHub or a committed `workers/agent/docs/*.png`. An image tag with a broken `src=""` would render as a broken-image icon and look like a bug.
- **Section placement at end of file.** Per the plan's `<action>` block, this leaves 10-02's `## Cost guardrails` section room to land below without breaking the two-layer narrative.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Stale spec inside plan body] Plan body listed $5 / $2.50 / $4.50; CONTEXT and user instruction lock in $10 / $5 / $9**
- **Found during:** Task 1 (initial read of plan + CONTEXT)
- **Issue:** The `<action>` block of `10-01-PLAN.md` lists step 2 as "Monthly spend cap = **$5**" and step 3 as "50% ($2.50) and 90% ($4.50)". These numbers contradict `10-CONTEXT.md` § "Anthropic dashboard cap — Drew action" (which says $10 + 50% / 90% = $5 / $9) and contradict the executor prompt (which explicitly notes "Drew revised from $5 mid-planning — CONTEXT.md and plan already reflect $10"). The plan body's $5 references are stale.
- **Fix:** Used the CONTEXT.md numbers ($10 / $5 / $9) in the README. CONTEXT.md is the locked decision source; plan body lag is a known artifact of mid-planning revisions.
- **Files modified:** `workers/agent/README.md`
- **Verification:** `grep` confirms `$10`, `$5`, `$9` all present in the README section; no `$2.50` or `$4.50` strings present.
- **Committed in:** `2395ed1` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 stale-spec resolution against authoritative CONTEXT source)
**Impact on plan:** Required for correctness — using the stale $5 numbers would have shipped a runbook that contradicts the actual cost ceiling locked into the phase. No scope creep.

## Issues Encountered

None — single-task plan, single commit, automated verification (`grep` for headings + dollar amounts + screenshot placeholder) passes on first run.

## User Setup Required

This plan IS the user-setup runbook. After this plan ships, Drew (separately) opens https://console.anthropic.com/settings/billing and clicks through steps 1–5 in the new README section. The Drew-action remains tracked in STATE.md "Drew actions waiting" until completed.

## Next Phase Readiness

- README section is in place for 10-02 to append its `## Cost guardrails` block immediately below, completing the two-layer cost-defense narrative.
- No blockers for 10-02 (the Worker-side daily-cost circuit breaker). 10-02 may proceed in parallel with Drew's dashboard click — the two are independent.
- After 10-02 lands, the only remaining Phase 10 action is Drew's dashboard click + screenshot commit.

## Self-Check: PASSED

- `workers/agent/README.md` line 168 contains `## Anthropic dashboard configuration` (verified via `grep -n`).
- `workers/agent/README.md` line 192 contains `[Anthropic dashboard cap screenshot — Drew adds]` (verified).
- Commit `2395ed1` present in `git log` (verified).
- `git diff --name-only HEAD~1 HEAD` returns exactly `workers/agent/README.md` (verified).

---
*Phase: 10-cost-guardrails*
*Completed: 2026-05-23*
