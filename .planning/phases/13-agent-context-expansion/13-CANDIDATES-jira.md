# Phase 13 — Jira candidate tickets (curated raw)

**Source:** Atlassian MCP, project EEPD, eagleeyenetworks.atlassian.net
**Pulled:** 2026-05-27, assignee + reporter = Drew Malhotra
**Scope of this file:** A pre-vetted candidate pool the autonomous executor curates DOWN from. Not all entries make the final prompt. Executor selects ~8-10 highest-signal tickets that are NOT already named in the existing `SYSTEM_PROMPT` (in `workers/agent/src/index.js`).

> **Sensitivity rules (executor MUST follow):**
> - Customer names: REDACT. The candidate `EEPD-102149 Duplicate Email Notification | 00170369 - Trinity College London` becomes "Duplicate-email notification bug filed against a named education customer" — no org name, no account ID.
> - Cluster IDs (c023, aus1p1, etc.): allowed — already in existing prompt.
> - EEPD ticket IDs: allowed in the prompt (they're internal references but not sensitive on their own).
> - Vulnerability repro steps: NEVER include. Outcomes + remediation language only.
> - Specific dollar figures, headcounts, customer SLAs: REDACT unless already public on drewmalhotra.com.

## Already named in the existing prompt (skip — don't duplicate)

These themes are already covered. Don't re-add — pick complementary tickets.

- Synthetic Monitoring Framework (covers EEPD-113421/22/23/25 cluster)
- qalab-alertMonitor productization (covers EEPD-117944/45/46/47/48/57)
- AlertD → Automations V3 migration (covers EEPD-115226, 116463-116469)
- Cross-Pod Pulsar Testing (covers EEPD-110894, 110896, 110916, 110897)
- GRACE Error-Handling Validation
- api_tester redesign (covers EEPD-93637, EEPD-93642)
- 15× P99 latency SLA report (covers EEPD-93041)
- 21-cluster Automations QA test bench (covers EEPD-107931)
- V1 → V3 Notification Migration validation
- 100% unit-test coverage push (covers EEPD-81794, EEPD-87222, EEPD-87223, EEPD-86039, EEPD-87069)
- API Authorization Bug Hunt
- Automated event simulation for Video Analytics
- Notification Condensing feature validation (covers EEPD-87380)

## Candidate pool (executor picks ~8-10)

### Bugs Drew reported (highest-signal — "Drew found this")

- **EEPD-112424 — V1→V3 Migration: email + bell-icon notifications not working after analytics migration** · High priority. Filed during the V3 migration validation pass; a release blocker.
- **EEPD-93041 — P99 Latency for /alerts Exceeds SLA (target ≤300ms, actual 4591ms)** · Already cited in prompt's "15× SLA report" — keep linkage explicit in the new section.
- **EEPD-93039 — Sporadic 500 Errors During API Load Testing on /alerts** · Filed alongside the latency bug as a related symptom.
- **EEPD-93037 — Timeout Errors During High-Concurrency Load Testing on /alerts** · Third correlated load-test finding.
- **EEPD-117237 — imageOptions: missing alertImage returns HTTP 500 instead of 400** · Input-validation bug — agent should be able to cite this as "the kind of validation gap I look for."
- **EEPD-115813 — 500 Internal Server Error on GET /eventAlertConditionRules for cluster c032** · Cluster-specific reliability finding.
- **EEPD-108893 — Notifications still being sent after the rule has been deleted** · Stateful-cleanup bug — exactly the failure mode adversarial testing catches.
- **EEPD-97000 — Error thrown when changing alert action recipient and toggling status to 'on'** · State-transition edge case.
- **EEPD-96197 — Disabling an AlertAction fails if associated user has been deleted** · Cascading-state bug.
- **EEPD-93926 — Unable to change rearm time on alert action after rule association** · Dependency-ordering bug.
- **EEPD-91221 — Multiple push notifications in V3** · Duplicate-delivery bug.
- **EEPD-106998 — Camera I/O alert emails missing "Play Video" / "View Camera Live" buttons** · UX completeness bug.
- **EEPD-106035 — Time zone not reflecting in email notification** · Localization correctness bug.
- **EEPD-105889 — Language change doesn't apply to "Motion Detected" string (except Japanese)** · i18n inconsistency.
- **EEPD-92085 — Multiple alerts populating for the same event** · Dedup/idempotency bug.
- **EEPD-86871 — Post-Test Cassandra Thread Scheduler crash causes segfault in Docker (herald-consumer)** · Infra crash — found through test runs.

### Stories Drew shipped (named work, beyond existing prompt list)

- **EEPD-74866 — Create an API traceability matrix** · High priority. A QA-coverage artifact that ties tests → endpoints → requirements. Useful "process maturity" signal.
- **EEPD-103925 — PR Review, Deployment, End-to-End Testing** · High priority. Cross-functional QA ownership covering review + deploy + E2E.
- **EEPD-77111 — Automations Milestone 3 (QA)** · Epic-level ownership of a milestone.
- **EEPD-80160 — Cloud: Purging Video Alerts based on Video Retention** · Data-retention validation work.
- **EEPD-70928 — Test thermal detection rule creation and email/push notifications** · Sensor-channel validation.
- **EEPD-84011 — Add tests for sensor-based alert permissions** · Permission-model test coverage.
- **EEPD-55075 — Test count + latency between alert and alert actions** · End-to-end latency measurement.
- **EEPD-75169 — Oyez Concourse acceptance tests to run pytest** · CI/CD migration work (Robot Framework → pytest, mentioned in prompt under "100% coverage" — keep distinct framing here as the CI work itself).
- **EEPD-100619 — False Positive Regression Tracking (≤ 0.01%)** · Quality-bar enforcement.
- **EEPD-100624 — Generic Event Counting API Validation** · API behavior test pass.
- **EEPD-112833 — Test Plan — Reseller Automation Workflows — 50% Manual Reduction Validation** · Manual-work-reduction measurement.

### Selection guidance for the executor

Aim for a MIX across these categories so the agent can field varied recruiter questions:
1. **One "bug I found with X-type pattern" entry per recurring failure mode** — input validation, state cleanup, cross-account auth, i18n. Don't list every bug; pick representative examples.
2. **One "process maturity" entry** — API traceability matrix (EEPD-74866) is a strong choice.
3. **One "infrastructure/CI maturity" entry** — pytest migration (EEPD-75169) or PR/deploy/E2E ownership (EEPD-103925).
4. **One "data-retention / lifecycle" entry** — EEPD-80160 if it fits.

Final count target: **8 entries**. If trimming further, drop the lowest-priority bugs first (Lowest priority tickets are real but not interview-defining).
