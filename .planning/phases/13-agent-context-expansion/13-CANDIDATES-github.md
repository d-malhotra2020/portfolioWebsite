# Phase 13 — GitHub candidate PRs + repos (curated raw)

**Source:** `gh repo list d-malhotra2020` + `gh api graphql` search for merged PRs authored by Drew
**Pulled:** 2026-05-27
**Scope of this file:** Pre-vetted candidate pool the autonomous executor curates DOWN from.

> **Sensitivity rules (executor MUST follow):**
> - Private-repo PR URLs: OMIT — they 404 for the public. State the repo name + PR title + outcome only. The fact that Drew has merged work in EENCloud/* private repos IS the proof.
> - Public-repo PR URLs: ALLOWED (they resolve for anyone).
> - Numbers from PR metadata (additions, deletions, files changed): ALLOWED — these are factual.
> - Inferred impact ("improved performance by X%"): NEVER — only metrics actually in the PR title or already in the existing prompt.
> - Cross-org repos (EENCloud/*, american-valor/*): treat EENCloud as "Brivo (fmr. Eagle Eye Networks)". The american-valor org also belongs to Brivo's ecosystem; if uncertain, default to "EENCloud" framing.

## Already named in the existing prompt (skip — don't duplicate)

- portfolioWebsite (self), interview agent, video-analytics, traffic-optimization, donation-platform, financial-analysis-tool, smart-home-automation, qalab-alertMonitor (productization), api_tester redesign.

## Candidate pool — public repos (executor picks ~5-7 for a flagship list)

| Repo | Description | Why include |
|------|-------------|-------------|
| `d-malhotra2020/portfolioWebsite` | This site. React + Vite, Cloudflare Worker for the agent. | Already in prompt — don't re-add as a repo; the existing project entry is enough. |
| `d-malhotra2020/video-analytics` | YOLOv8 honest benchmark + operator console. | Already in prompt. |
| `d-malhotra2020/traffic-optimization` | 664-intersection adaptive signal optimizer. | Already in prompt. |
| `d-malhotra2020/donation-platform` | Two-tower recommender benchmark. | Already in prompt. |
| `d-malhotra2020/financial-analysis-tool` | Time-series + ML ensemble. | Already in prompt. |
| `d-malhotra2020/smart-home-automation` | Flask + Mosquitto MQTT command center. | Already in prompt. |
| `d-malhotra2020/Grind75` | LeetCode practice submissions (Python). Updated 2026-05-27. | Optional. Useful as a "Drew practices fundamentals" signal — but only worth including if framed honestly ("ongoing DS&A practice"), not as a flex. |
| `d-malhotra2020/qa-webhook-server` | Public sibling to the private EENCloud/test-tools webhook server. HTML/Python. | **Strong include.** Public artifact of internal QA infrastructure work. |
| `d-malhotra2020/CCFraudProject` | Credit-card fraud ML practice project. Python. | Optional. Old. |
| `d-malhotra2020/PersonalProjects` | Catch-all repo. | Skip — no signal. |
| `d-malhotra2020/BatteryChecker` | Personal laptop-battery script. | Skip — too small. |
| `d-malhotra2020/flaskProject` | Flask coursework. | Skip — coursework signal. |

**Selection guidance:** the 6 portfolio projects + interview agent are already richly described. The ONE public repo worth adding to a new "GitHub" section is **`qa-webhook-server`** — it's the public face of QA infra work, and pairs with the private EENCloud/test-tools PR list below.

## Candidate pool — private/work merged PRs (executor picks ~6-8 representative entries)

> **Framing rule:** Private PRs are referenced as evidence of named work without leaking links. Format:
> `- **<PR title>** — EENCloud/<repo> (private), merged <YYYY-MM-DD>. <one-line outcome>.`

Sorted by recency.

### EENCloud/qalab-alertMonitor (the productization private repo)
- **Bugfixes, test foundation, legacy cleanup, and route audit** · PR #4 · merged 2026-05-26 · +875/-1368 across 31 files. The hardening pass after the initial deploy: net code reduction while adding tests.
- **Self-heal stale rule actors and per-account pipeline tests** · PR #2 · merged 2026-05-20 · +1329/-162 across 10 files. Added the self-healing layer that keeps the monitor running without manual intervention when upstream rule actors go stale.
- **Add alert monitor implementation** · PR #1 · merged 2026-05-11 · +19,309 across 61 files. The initial productization commit — the "from localhost script to hosted service" jump described in the existing prompt's qalab-alertMonitor entry.

### EENCloud/test-tools (the public-facing QA tooling repo, internal)
- **Complete Advanced QA Webhook Server v2 — All Critical Issues Fixed & Stress Tested** · PR #29 · merged 2026-03-17 · +3805 across 7 files. The v2 ship of the webhook server. (Public sibling: `d-malhotra2020/qa-webhook-server`.)
- **Add Claude Context System — QA Integration Edition** · PR #25 · merged 2026-02-11 · +2146 across 4 files. Internal Claude/agent tooling for QA workflows — direct evidence of the "LLM-augmented QA workflow at Brivo" claim already in the prompt.

### EENCloud/api-v3-documentation
- **Update PATCH /alertActions/{actionId} documentation to clarify partial update behavior** · PR #1400 · merged 2025-12-10 · EEPD-91192. Documentation fix tied directly to the PATCH-vulnerability case study already on drewmalhotra.com/writing/patch-vulnerability.
- **Add missing 500 error response to POST /alertActionRules** · PR #1394 · merged 2025-12-10 · EEPD-75462. API contract correctness.

### EENCloud/oyez (the main test-tooling monorepo)
- **Add performance comparison analytics + browser-based visualization to API tester** · PR #773 · merged 2025-12-05 · +490/-58 across 3 files. Follow-on to the api_tester redesign (already cited in prompt) — adds dashboards.
- **[EEPD-93642] Refactor API tester to support multiple endpoints via YAML configuration** · PR #678 · merged 2025-10-15 · +737/-140 across 10 files. Already cited in prompt under api_tester redesign — confirm the framing.
- **[EEPD-93639] Alerts-Sequential-Filter-Validation** · PR #662 · merged 2025-08-20 · +271/-47. Filter-correctness test pass.
- **[EEPD-93637] Refactor API Load Tester to Improve Pagination, Logging, and Token Visibility** · PR #624 · merged 2025-07-30 · +799/-0 across 13 files. The original api_tester redesign — also already cited in prompt.
- **Alert actions unit tests** · PR #526 · merged 2025-06-06 · +1951/-8. EEPD-87222 — already cited.
- **Alert condition rule unit tests** · PR #506 · merged 2025-05-19 · +780/-6 across 4 files. EEPD-87223 — already cited.
- **Mock database integration** · PR #465 · merged 2025-03-25 · EEPD-81794. The pytest DB-emulation work cited in prompt.

### EENCloud/concourse-pipelines (CI/CD infra)
- **Add unit tests to acceptance tests herald** · PR #2706 · merged 2025-05-14 · EEPD-86039. CI pipeline wiring.
- **Temporarily remove `test_alert_get_images` to unblock deployment** · PR #2684 · merged 2025-05-14 · EEPD-87069. The flaky-test quarantine cited in prompt under "100% coverage" — keep distinct framing.
- **sqlite3 concourse update** · PR #2621 · merged 2025-03-26 · EEPD-81794. CI infra for the DB-emulation work.

## Selection guidance for the executor

Aim for **5-7 PR entries total** (private + public combined) that demonstrate breadth:
1. **One "productization scale" entry** — qalab-alertMonitor PR #1 (the 19K-line initial implementation).
2. **One "post-ship hardening" entry** — qalab-alertMonitor PR #4 (the -493 net diff while adding tests).
3. **One "LLM-tooling in production QA" entry** — test-tools PR #25 (Claude Context System).
4. **One "API contract correctness" entry** — api-v3-documentation PRs (PATCH docs + 500 response).
5. **One "test infrastructure" entry** — concourse-pipelines unblock or YAML config refactor.
6. **One public-repo entry** — `qa-webhook-server` as the public artifact.

Skip the "Clean tracked IDE metadata" / "Clean tracked artifacts" PRs entirely — they're real but signal noise, not engineering depth.
