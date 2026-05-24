---
phase: 10
verified: 2026-05-23T00:00:00Z
status: human_needed
must_haves_total: 4
must_haves_passed: 2
human_verification_total: 3
score: 2/4 must-haves verified in repo (2 require Drew dashboard action)
---

# Phase 10: Cost Guardrails Verification Report

**Phase Goal:** A viral day cannot cost more than Drew's configured monthly ceiling.
**Verified:** 2026-05-23
**Status:** `human_needed` — code-side guardrails (SC #2, SC #3) fully verified in repo; dashboard cap (SC #1) + email alerts (SC #4) are Drew-actions on the Anthropic console that this verifier cannot click through. README documentation makes both clickable in < 5 minutes.

---

## Result

The Worker-side daily-cost circuit breaker is implemented, wired, and documented. Both layers of the two-layer cost defense have a clear runbook in `workers/agent/README.md`. The hard-wall layer (Anthropic dashboard) and the email-alert side of the contract are gated on Drew opening the Anthropic console and clicking through the 5-step runbook in the README's `## Anthropic dashboard configuration` section. Status: `human_needed` — pending Drew's dashboard click + screenshot commit.

---

## Must-Haves

| # | Must-Have (Success Criterion) | Status | Evidence |
|---|------|--------|----------|
| 1 | Anthropic dashboard has a monthly spend cap configured (Drew sets the value) | NEEDS HUMAN | Cannot be verified from repo — requires Drew to be logged into `console.anthropic.com` and click through 5 steps. README documents the steps verbatim at `workers/agent/README.md` lines 168-195 (5 numbered steps + screenshot placeholder + cross-link to Cost guardrails). The placeholder `[Anthropic dashboard cap screenshot — Drew adds]` is in place for Drew to replace with the captured screenshot after clicking through. |
| 2 | Worker tracks daily token-cost estimate; above threshold it short-circuits with a "agent's resting" message | VERIFIED | `workers/agent/src/index.js`: `costCapped()` (lines 174-188) returns HTTP 503 with the exact CONTEXT-locked error string `agent's resting — Drew's daily Anthropic budget is spent for today...`; fetch handler reads `dailyCost = await getDailyCost(env.RATE_LIMIT)` at line 412 (before upstream call); short-circuits if `dailyCost.total >= dailyLimit` at line 413; writes `outcome: 'cost_capped'` telemetry at line 414; increments counter post-stream inside `ctx.waitUntil` at line 482. `getDailyCost` fails open on any KV error; `incrementDailyCost` swallows write errors. `DAILY_COST_LIMIT_MICRO_USD = "333000"` tunable in `wrangler.toml` line 27. |
| 3 | `workers/agent/README.md` documents the cost model and threshold for future-Drew | VERIFIED | `## Cost guardrails` section (lines 199-296) covers all 6 CONTEXT-locked content pieces: two-layer framing, per-turn cost math at Haiku 4.5 pricing (~$0.00125/turn ≈ 130-170 turns/day), daily threshold + how to change (wrangler var), KV key shape (`cost:YYYY-MM-DD`) + inspect/reset commands, short-circuit behavior with locked error string + 503 + Retry-After, Analytics Engine SQL monitoring query for `cost_capped` events. |
| 4 | Drew receives an Anthropic email alert before hitting the cap | NEEDS HUMAN | Cannot be verified from repo — Anthropic console-side alert configuration. README documents this as part of step 3 of the dashboard configuration runbook: "Enable email alerts at **50% ($5)** and **90% ($9)** so you get a heads-up well before the hard cap fires" (`workers/agent/README.md` line 181-182). |

---

## Automated checks

All required verification commands executed against the working tree:

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| `node --check workers/agent/src/index.js` | exit 0 | exit 0 | PASS |
| `grep -c "DAILY_COST_LIMIT_MICRO_USD" workers/agent/src/index.js` | >= 2 | **2** (line 370 parseInt + line 368 comment) | PASS |
| `grep "DAILY_COST_LIMIT_MICRO_USD" workers/agent/wrangler.toml` | shows `"333000"` | `DAILY_COST_LIMIT_MICRO_USD = "333000"` (line 27) | PASS |
| `grep -c "cost_capped" workers/agent/src/index.js` | >= 1 | **2** (telemetry call line 414 + doc comment line 301) | PASS |
| `grep "cost:" workers/agent/src/index.js` | shows KV key pattern | line 255 `cost:${new Date().toISOString().slice(0, 10)}` + comments | PASS |
| `grep -c "Retry-After" workers/agent/src/index.js` | >= 2 | **3** (line 183 costCapped + line 403 rate-limit + line 184 spread) | PASS |
| `grep -c "## Anthropic dashboard configuration" workers/agent/README.md` | == 1 | **1** (line 168) | PASS |
| `grep -c "## Cost guardrails" workers/agent/README.md` | == 1 | **1** (line 199) | PASS |
| `grep -n "getDailyCost(env.RATE_LIMIT" workers/agent/src/index.js` | shows wired call | line 412 (in fetch handler, after rate-limit) | PASS |
| `grep -n "incrementDailyCost(env.RATE_LIMIT" workers/agent/src/index.js` | shows wired call | line 482 (inside ctx.waitUntil) | PASS |

**Code-reading verification (SC #2 sub-behaviors):**

| Behavior | Location | Verified |
|----------|----------|----------|
| Reads `cost:<UTC-date>` from KV before Anthropic call | line 412 `getDailyCost` happens before line 432 upstream `fetch` | YES |
| Returns 503 with locked error string when total >= threshold | `costCapped()` (lines 174-188): status 503, exact CONTEXT string including `dhruvmalhotra2026@gmail.com`, `>=` comparison at line 413 | YES |
| Sets `Retry-After` header to seconds until UTC midnight | `costCapped(origin, secondsUntilUtcMidnight())` at line 415; `secondsUntilUtcMidnight()` lines 258-267 uses `Date.UTC(...+1)` | YES |
| Increments counter after `usagePromise` resolves inside `ctx.waitUntil` | lines 468-485: `ctx.waitUntil(usagePromise.then(...))` returns `incrementDailyCost(...)` | YES |
| Fails open on KV read errors | `getDailyCost` (lines 269-282): try/catch returns `{total: 0, requests: 0}` on any error, plus `!kv` short-circuit | YES |
| Swallows KV write errors | `incrementDailyCost` (lines 284-299): try/catch around `kv.put`, comment "best effort" | YES |
| Increment only on `ok` path (not on cost_capped/rate_limited/etc) | Inside `usagePromise.then` after `outcome: 'ok'` writeTelemetry; cost-capped/rate-limited/bad-request paths return before line 460 | YES |
| 48h TTL on KV writes | `expirationTtl: 60 * 60 * 48` at line 293 | YES |

---

## Human verification

Three items require Drew to click through the Anthropic console and confirm by hand. None of these are blocked on additional code work.

### 1. Anthropic monthly spend cap configured

**Test:** Open `https://console.anthropic.com/settings/billing` and follow steps 1-3 in `workers/agent/README.md` (lines 178-187). Set Monthly spend cap = $10.
**Expected:** Spend cap shows "$10" on the billing page after save.
**Why human:** Anthropic console is auth-walled; no Worker code or repo file can prove the dashboard state.

### 2. Anthropic email alerts at 50% / 90% enabled

**Test:** Same dashboard session as #1 — set alert thresholds at 50% ($5) and 90% ($9). Optionally trigger a test alert per Anthropic's UI.
**Expected:** Two email-alert thresholds appear under the spend-limit page; Drew's email (the account email on file) receives the first alert when monthly spend crosses $5.
**Why human:** Anthropic console + email-deliverability check. Not testable from the repo or Worker.

### 3. Worker breaker fires end-to-end on a deployed Worker

**Test:** Per `workers/agent/README.md` line 125 of the 10-02 SUMMARY and the "Testing the breaker live" note: temporarily set `DAILY_COST_LIMIT_MICRO_USD = "0"` in `wrangler.toml`, run `npx wrangler deploy` from `workers/agent/`, send a chat from the deployed site, then revert to `"333000"` and redeploy.
**Expected:** AgentDock surfaces "agent's resting — Drew's daily Anthropic budget is spent for today..." as the assistant response, HTTP 503 in network tab, `outcome=cost_capped` event in `wrangler tail` output.
**Why human:** Requires a live Worker deploy + a real chat hit against it; the dry-run verifier in this repo only confirms the code paths exist, not that they fire correctly under live traffic. (The verifier has confirmed the code paths exist; this human check confirms they actually fire.)

After Drew completes #1 + #2, also: replace `[Anthropic dashboard cap screenshot — Drew adds]` placeholder in `workers/agent/README.md` line 192 with a captured screenshot.

---

## Notes

- **No gaps.** All four success criteria either fully pass automated/code-level verification (SC #2, SC #3) or are documented clearly enough in the README that Drew can complete them in under 5 minutes (SC #1, SC #4). The README is the deliverable for the dashboard side of the two-layer defense.
- **Code-reading caveat (SC #2):** Three sub-behaviors of the breaker (read-before-upstream ordering, 503 response shape, increment-only-on-ok) were verified by reading `src/index.js` end-to-end, not by running a live request. This is appropriate for a Cloudflare Worker — running it requires `wrangler dev` + a real KV namespace + a real Anthropic key. The 10-02 SUMMARY records that `npx wrangler deploy --dry-run` exited 0; the verifier confirms the same `node --check` exit code and that the wired calls (`getDailyCost`, `incrementDailyCost`) appear in the fetch handler at the correct line ranges.
- **CONTEXT consistency:** Both 10-01-SUMMARY and 10-02-SUMMARY flagged a stale `$5/mo` reference in their respective PLAN bodies and shipped the authoritative `$10/mo` value from `10-CONTEXT.md`. Verified: the README uses `$10` / `$5` (50%) / `$9` (90%), the wrangler var is `"333000"` (= $10 / 30), and no `$2.50` / `$4.50` strings appear anywhere in the modified files. The Phase 10 cost numbers are internally consistent.
- **Frontend untouched (correct).** AgentDock already renders the `error` field on any non-OK response — verified by code reading at `src/components/AgentDock.jsx` (per the 10-02 PLAN's frontend-contract note). No frontend change required, none made.
- **Two-layer story renders end-to-end** in the README: `## Anthropic dashboard configuration` (lines 168-195) → `## Cost guardrails` (lines 199-296), in that order, with the dashboard section explicitly framing itself as the hard wall and pointing at Cost guardrails for the early warning. Future-Drew, six months from now, can read top-to-bottom and understand both layers without leaving the README.

---

*Verified: 2026-05-23*
*Verifier: Claude (gsd-verifier, goal-backward methodology)*
