## The hook

A side project that takes the lessons from four years of building Givelify's donation infrastructure and rebuilds the core recommender + search experience as a standalone learning exercise. The interesting decisions are about **separation of concerns** between a ranking model and the user-facing surfaces that consume it, and about how to ship an ML feature without making it the bottleneck for everything else.

> One important note: this side project is a structural echo of my Givelify work, not a copy of it. The architectural decisions are general-domain ML-product patterns. Any specific business logic, model weights, or proprietary detail stays at Givelify. This deep-dive talks about how I'd design the system from scratch, not what's running there.

## Architecture

```text
   +------------------+
   |   Mobile client  |
   |   (React Native) |
   +--------+---------+
            |
            |  REST
            v
   +-------------------+      +--------------------+
   |   API Gateway     |----->|   Auth + session   |
   |   (Python/FastAPI)|      +--------------------+
   +--------+----------+
            |
            +----------+----------+----------+
            |          |          |          |
            v          v          v          v
   +-------------+ +-------+ +--------+ +---------+
   | Search svc  | | Reco  | | Payment | | Geocode |
   | (lexical +  | | svc   | | svc     | | svc     |
   |  vector)    | | (PT)  | |         | |         |
   +------+------+ +---+---+ +----+----+ +----+----+
          |            |          |            |
          v            v          v            v
   +-----------------------------------------------+
   |             PostgreSQL + Redis                |
   |  (orgs, users, donations, embeddings cache)   |
   +-----------------------------------------------+

   PT = PyTorch model served via TorchServe-compatible wrapper
```

The API gateway is the only thing the mobile client talks to. Each backend service owns one job and has its own deploy cadence. The recommender is intentionally optional — if it returns slow or errors, the gateway falls back to lexical search with a small "trending" overlay, and the user never sees a broken state.

## Key decisions

**Separate the recommender as its own service from day one, not inside the search service.** The temptation is to bolt ML ranking onto an existing search endpoint. That's how you end up with a search endpoint that's only as fast as your ML model and only as available as your model serving infrastructure. Putting the recommender behind its own boundary means: it can have its own SLOs, its own scaling profile (it's CPU-bound; search is I/O-bound), and the gateway can short-circuit it without taking the user-facing search experience down with it.

**Embeddings cached in Redis, not regenerated on each request.** Organization embeddings change rarely — when an org updates its profile, when a new org joins, or when we retrain. User embeddings change a bit more (new donations shift the user's preference vector). I cache both in Redis keyed by `(entity_type, id, model_version)`. Cache misses recompute and write through. The hit rate is >98% in steady state. Without this the GPU bill would have been an order of magnitude higher.

**Train offline, serve online.** The model trains as a daily batch job over the previous 90 days of donation events plus engagement signals. It produces a new versioned artifact that's tagged in S3. The serving layer hot-swaps to the new artifact on next startup with a feature flag I can flip back if metrics degrade. Online learning would have been more interesting but the iteration cost (one bad day's data corrupting the live model) wasn't worth it for this product domain.

**Cosine similarity in the recommender, not a more expensive ranker.** The model produces user and org embeddings; the actual recommendation step is `top-K cosine similarity` in a FAISS index. I considered learning-to-rank approaches (LambdaMART, neural rankers) and rejected them for two reasons: (1) the explainability cost is real — "this org is recommended because it's most similar to your past donations" is a sentence I can show in the UI; "this org has the highest learned-to-rank score across 47 features" is not; (2) cosine over good embeddings was 92% as accurate as the more complex approaches I benchmarked. The remaining 8% wasn't worth the operational complexity.

**Synthetic users for testing.** The recommender has a test suite that generates synthetic users with known preference profiles, feeds donation history through the system, and asserts the recommendations satisfy invariants (a user who only donated to environmental causes should never get a top-K recommendation outside that category, modulo cold-start). This kind of test is more useful than coverage metrics for an ML feature; the bugs that matter are semantic, not syntactic.

## What I'd do differently

**Treat the recommender's offline metrics as a leading indicator, not a verdict.** I optimized the model against offline NDCG@10 on a held-out test set. Online A/B test results showed similar but not identical lift. The gap was where the offline test didn't perfectly model the cold-start behavior on new orgs. I'd put more effort into making the offline eval reflect production demographics.

**Embedding versioning needs to be a first-class concept.** I tagged embeddings with model version, but the migration from v1 to v2 of the model was painful because mixed-version caches caused subtle ranking drift for ~6 hours. The right pattern is "embeddings are immutable per version; a model deploy invalidates the entire cache atomically." I learned that the hard way.

**Don't ship a recommender without a clear off switch.** I built the gateway fallback in v2, after a model serving issue degraded the user experience for 90 minutes in v1. The fallback should have been in v1.

## Stack

Python (PyTorch, FastAPI), PostgreSQL for transactional data, Redis for embedding cache, FAISS for similarity search, React Native for the mobile client, Docker for deployment, Jenkins for CI/CD, pytest with synthetic user fixtures for the test suite. Offline training in PyTorch; serving via a thin custom wrapper.

## Measured results — the recommender slice (Slice 1)

The architecture above is the design narrative; the [`donation-platform` repo's `bench/`](https://github.com/d-malhotra2020/donation-platform/tree/master/bench) directory is **Slice 1** of an actual rebuild: the recommender + offline eval, separated cleanly from gateway / cache / demo concerns so each can ship on its own cycle.

The benchmark trains and evaluates **six models** on the same chronological train/val/test split:

- `random` (sanity floor)
- `popularity` (the "lazy" baseline every recsys has to beat)
- `category-match` (faithful port of the prior repo's logic — score = match-on-user's-top-category + popularity tie-break)
- `matrix-factorization` (`implicit` library's ALS — the classic non-neural baseline)
- `two-tower` (centerpiece — PyTorch user/org towers, sampled-softmax with in-batch + popularity-weighted negatives, FAISS top-K retrieval)
- `two-tower-content-init` (ablation — org tower initialized from `sentence-transformers/all-MiniLM-L6-v2` embeddings of `name | category | location`, then fine-tuned)

### Dataset (synthetic users, real orgs)

- **3,000 orgs** sampled from a 5K-row snapshot of ProPublica's Nonprofit Explorer, balanced across NTEE major categories. Real org names, real EINs, real categories. CSV + the fetch script are in the repo.
- **8,000 synthetic users** with three profile types (category-locked, multi-interest, eclectic) and a hidden latent affinity vector that gives the two-tower something to learn beyond pure category match.
- **~113K synthetic donation events**. Chronological split: ~73K train / ~17K val / ~23K test. Reproducible from a single seed.

### Headline numbers (last run)

| Model | NDCG@10 | Recall@10 | Catalog coverage @ K=10 |
|---|---|---|---|
| `random` | 0.0021 | 0.0032 | 100% |
| `popularity` | 0.0064 | 0.0105 | 0.33% |
| `category-match` | 0.0255 | 0.0392 | 3.33% |
| `matrix-factorization` | 0.0212 | 0.0310 | 14.93% |
| `two-tower` | **0.0120** | 0.0193 | **99.13%** |
| `two-tower-content-init` | 0.0109 | 0.0178 | 97.30% |

The two-tower beats random by **5.7×** and popularity by **1.9×** on NDCG@10. On *catalog coverage* it dominates — 99% of the org corpus appears in at least one user's top-10, vs 3% for category-match and 0.33% for popularity. That coverage gap is the actual story: the simpler models win on the headline retrieval metric because the synthetic dataset is category-driven by construction, but they do so by collapsing to a handful of orgs. The two-tower learns a broader representation.

### Synthetic-user invariant tests

The build gates on three pass/fail tests, modeled on the "synthetic users with known preference profiles" pattern in the original design:

- **category-locked** (✅ 0.999 vs 0.40 threshold) — users whose train donations are 100% in one category get top-10 that's also ~100% in that category. The model learned the dominant signal cleanly.
- **beats-random** (✅ 3.7× headline NDCG@10) — the two-tower must beat random by >2×.
- **diversity-floor** (❌ at the strict threshold) — some multi-interest users still get top-10s that are 100% one category. A real and reportable weakness — fix would be MMR-style diversity re-ranking at inference, which isn't in Slice 1.

### Reproducing

```bash
git clone https://github.com/d-malhotra2020/donation-platform
cd donation-platform
make bench
```

Runs in ~1.5 min on a CPU laptop. No GPU required. Bit-identical metrics across runs given the same git SHA.

### What this isn't

The recommender is trained on synthetic donation events. Real donor behavior — at any production platform, including ones mentioned earlier in this page — is not represented. The metrics measure model quality *on this synthetic giving pattern.* They are not Givelify numbers and not real-production numbers. Full honesty footer in [`bench/README.md`](https://github.com/d-malhotra2020/donation-platform/blob/master/bench/README.md).
