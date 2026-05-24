# Phase 12 — Context

**Phase:** Recurring Maintenance Scaffolding
**Goal:** This roadmap and the site stay current after the milestone ships.
**Gathered:** 2026-05-23 (`--auto`)
**Status:** Ready for planning

---

## Domain boundary

Phase 12 ships the scaffolding that prevents drewmalhotra.com from drifting once Drew stops actively building it. Two artifacts: a GitHub issue template that pre-populates a maintenance checklist (so future-Drew never starts from a blank slate), and a one-time exercise of running that checklist + reprioritizing the ROADMAP based on what the milestone surfaced.

Carrying forward:
- GH Pages deploy on push to `main` (Phase 0).
- Worker telemetry → Analytics Engine (Phase 3, pending Drew enabling AE in CF dashboard).
- ROADMAP.md is the canonical priority queue (Phase 0 GSD setup).
- STATE.md tracks Drew-actions across phases — the maintenance checklist will reference STATE.md as the long-term parking lot.

---

## Decisions locked

### GitHub issue template — monthly check-in

File: `.github/ISSUE_TEMPLATE/monthly-checkin.md`.

Front-matter:
- `name`: "Monthly site check-in"
- `about`: "Recurring checklist that keeps drewmalhotra.com current. Open one per month on or near the 1st."
- `title`: "Monthly check-in — YYYY-MM"
- `labels`: `maintenance`

Body — a Markdown checklist grouped into 5 sections so each block can be skipped if irrelevant:

1. **Content freshness (5 min)** — Verify About / Career dates still accurate; current employer + role still correct; any new side projects to surface; résumé.pdf in `public/` matches `src/data/whoami.js` and the agent system prompt.
2. **Agent health (5 min)** — `curl https://drewmalhotra.com/` returns 200; `curl <worker-url>` with a test prompt returns a coherent response; check Anthropic dashboard spend MTD vs the $10/mo cap; check Analytics Engine for any `cost_capped` or `upstream_error` outcomes in the last 30 days; rotate the Anthropic API key if it's >6 months old.
3. **Discoverability (5 min)** — Search "Drew Malhotra SDET Austin" on Google; confirm drewmalhotra.com is on page 1; check Google Search Console for new crawl errors; verify robots.txt + sitemap.xml still resolve.
4. **Engagement signal (5 min)** — Skim Worker telemetry for unique IPs in the last 30 days; note any chat outliers (long conversations, hot-lead vocabulary); update STATE.md "Drew actions waiting" with anything that surfaced.
5. **Roadmap reprioritize (10 min)** — Re-read ROADMAP.md's "Phases remaining" list; for each, ask "did the last 30 days move this closer or further?"; promote / demote / delete as needed; commit `docs(state): monthly reprioritize YYYY-MM`.

Total: ~30 minutes once a month.

### One-time first run — Phase 12 SUMMARY itself is the artifact

Plan 12-02 is "run the first check-in." Since the site has just shipped its initial milestone and there's no live engagement data yet, "running the checklist" means:
- Validate the checklist actually works by going through each section against today's state.
- Re-read ROADMAP.md and confirm the remaining (un-shipped) phases are still the right next things (Phases 6, 8, 11 — all blocked on external inputs).
- Document what got promoted/demoted in the SUMMARY.md.
- Open a real GH issue using the new template (so Drew sees the template render correctly in GitHub's UI).

### Scope guardrail — what's NOT in Phase 12

- A cron job / scheduled action that opens the issue automatically — adds infra complexity; Drew opens it manually on the 1st of each month. (Could be a Phase 13 if the manual cadence falls off.)
- A self-updating ROADMAP that watches metrics — out of scope.
- Dependabot, weekly npm audit, etc. — orthogonal infra, can be added separately.
- A "yearly" or "quarterly" template — start with monthly; consolidate later if it's too frequent.

---

## Code context

| Surface | File | Reuse |
|---|---|---|
| GH templates | `.github/` (only `workflows/` exists today) | Create the `ISSUE_TEMPLATE/` directory. |
| Drew-actions tracking | `.planning/STATE.md` "Drew actions waiting" section | Checklist references STATE.md as the long-term parking lot. |
| Roadmap | `.planning/ROADMAP.md` | Section 5 of the checklist directly edits this. |
| Worker telemetry | `workers/agent/README.md` "Cost guardrails" | Section 2 of the checklist links to the README query examples. |
| Deploy flow | `.github/workflows/deploy.yml` | Reference in checklist for "verify last deploy succeeded." |

---

## Canonical refs

- `.planning/PROJECT.md` — REQ-08 ("Self-maintaining — recurring checklist keeps the site from going stale").
- `.planning/ROADMAP.md` Phase 12 — success criteria.
- `.planning/STATE.md` — Drew-actions parking lot referenced from the checklist.
- `workers/agent/README.md` — Cost guardrails section (referenced in checklist section 2).
- GitHub issue templates docs: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository

---

## Deferred ideas

| Idea | Why deferred |
|---|---|
| Scheduled action that auto-opens the issue monthly | Manual cadence first; automate if it sticks. |
| Quarterly / yearly templates | Start with monthly. |
| Dependabot config | Orthogonal — separate maintenance concern. |
| Self-updating ROADMAP from metrics | Out of scope; ROADMAP curated by hand by Drew. |

---

*Authored: 2026-05-23 during Phase 12 (`--auto`).*
