## The hook

A take-home technical test for Lansweeper, built test-first: two data-quality validation suites for an IT asset-discovery platform. Scenario 1 reconciles the same device seen by four different scanners into one canonical asset without ever lying about where a value came from. Scenario 2 validates a vulnerability-enrichment pipeline against real NVD semantics — including the version comparator that knows OpenSSL `1.0.1f` is Heartbleed-vulnerable and `1.0.1g` isn't.

41/41 tests green in ~0.5s, pure standard library for the core logic (`pytest` + `jsonschema` are the only dependencies). Every test is named for its case ID in the companion strategy document (`test_VPI_002_patched_version_excluded`), so the `pytest -v` output reads as a live coverage report against the test plan.

## Scenario 1 — Cross-Scanner Data Consistency

Four scanner types (network radar, active scanner, installed agent, OT sensor) each observe the same devices with different fidelity. The suite covers:

- **Identity resolution.** Device fingerprinting is keyed on **MAC + serial** — hardware-bound identifiers. IP and hostname are explicitly *not* identity keys: IPs get recycled by DHCP and hostnames collide, so merging on them produces false merges. Records without strong identifiers never auto-merge.
- **Trust-precedence reconciliation.** For software/OS fields, `AGENT > ACTIVE > RADAR`; for OT devices, the OT sensor is authoritative. The precedence rules live in a `ReconcilerConfig` dataclass — data, not code — so they can change without edits and be re-run on rule changes.
- **Conflict retention.** A lower-trust value never silently disappears. When scanners disagree, the winner is recorded *with* the dissenting values and a resolution tag (`agent-wins`), so provenance survives reconciliation.
- **Freshness monitoring.** A merged field is flagged stale when it's older than its source's TTL — or when it has *no* timestamp or *no* configured TTL. A field that can't be proven fresh is treated as stale, because an unverifiable field passing silently would defeat the monitor.

## Scenario 2 — Vulnerability Pipeline Integrity

CPE matching against NVD's applicability version ranges (`versionStartIncluding` / `versionEndExcluding`) rather than exact string equality, validated against a frozen slice of real NVD 2.0 JSON:

- **OpenSSL-aware version comparison.** `1.0.1 < 1.0.1a < 1.0.1f < 1.0.1g < 1.0.2` — the letter-suffix ordering naive comparators get wrong, and exactly the boundary that separates Heartbleed-vulnerable from patched.
- **Never guess a match.** An unparseable version returns *no match* rather than a fuzzy one. Vendor and product must match before any version range is consulted, so a wildcard for product A never blanket-matches product B.
- **Edge CVE states.** REJECTED/withdrawn CVEs are never attached; unscored CVEs are flagged rather than given a fabricated score; dual-source score discrepancies (NVD vs VulnCheck) keep one association with NVD precedence and flag the disagreement.
- **Silent-failure detection.** A pipeline run that enriches fewer assets than expected — or whose upstream feed returned non-200 — is reported degraded with a reason. A coverage gap never reads as success.
- **Schema-transform fidelity.** NVD raw → schema-validated internal record → per-store shapes (ClickHouse, MongoDB), compared with *semantic* equality — canonicalized keys, normalized numbers, store-only keys like Mongo's `_id` ignored — because per-store serializers legitimately differ and byte equality would produce false alarms.

## Built test-first

The repo's commit history is the TDD receipt: synthetic asset builders and the frozen NVD golden slice landed first, then each module went RED → GREEN against its case catalog, then a hardening pass grew the suite from 27 to 41 tests while externalizing the reconciliation rules. The companion strategy document maps every case ID to its test.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

pytest -v            # 41 tests
pytest -v -k XSC     # Scenario 1 only
pytest -v -k VPI     # Scenario 2 only

PYTHONPATH=src python -m lansweeper_dq.demo   # reconciliation + Heartbleed-match walkthrough
```

## Key decisions

**Fail loud on anything unverifiable.** The same principle shows up in all four corners of the code: an unparseable version is no-match, a field without a TTL is stale, a coverage delta is a degraded run, an unscored CVE is a flag. Data-quality tooling that guesses politely is worse than no tooling.

**Rules as data.** Trust precedence is configuration, not branching logic — the brief asks what happens when reconciliation rules change, and the answer is "re-run `deduplicate()` with a new config," not a code edit.

**Frozen fixtures over live APIs.** The NVD slice is a committed golden file in the real NVD 2.0 JSON shape. Tests are deterministic and run offline in half a second, while still exercising the actual parsing path a live feed would hit.

**Stdlib core.** No pandas, no ORM, no framework. The problem is logic, not plumbing — dataclasses and pure functions keep every rule visible and every test fast.

## What I'd do differently

**Property-based testing for the version comparator.** `compare_versions` is a perfect Hypothesis target — total ordering, antisymmetry, transitivity — and a handful of property tests would cover more of the input space than the example-based cases.

**Scenario 3.** The brief said pick two of three; multi-database consistency (the ClickHouse/Mongo/Postgres drift case) is sketched by the transform-fidelity work but deserves its own suite.

## Stack

Python 3.14, pytest, jsonschema. Pure standard library for all core logic — dataclasses, `re`, `json`, `datetime`. Fixtures: synthetic scan-record builders + a frozen NVD 2.0 golden slice. Companion design/strategy document shipped alongside the code.
