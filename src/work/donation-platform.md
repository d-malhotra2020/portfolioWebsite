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
