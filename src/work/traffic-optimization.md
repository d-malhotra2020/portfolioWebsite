## The hook

An adaptive traffic signal optimizer measured against a fixed-time baseline on a Poisson-arrival microsim, draped over a real topology of **664 signalized intersections in downtown San Francisco** fetched from OpenStreetMap. The optimizer is rule-based, the topology is real, the +18.2% throughput delta is measured. No ML, no proprietary algorithms, no "94% accuracy" — the previous version of this repo claimed all of those, and they have all been removed.

Live operator console at [traffic-optimization-production.up.railway.app](https://traffic-optimization-production.up.railway.app/), reproducible locally with `python -m src.bench.microsim`.

```text
Microsim:  5-intersection corridor, Poisson arrivals
Strategy:  adaptive (queue-balancing rule-based) vs fixed-time
Trials:    40 per strategy × 1800 s (30 min) sim time
Seed:      deterministic, base 20260524

           throughput (veh/min)   avg wait (s)
fixed         11.95 ± 0.39          521 ± 28
adaptive      14.13 ± 0.33          465 ± 26
delta         +18.2%                −10.8%
```

That's the peak-load number. The arrival-rate sweep is the more honest read.

## Why this exists

The pre-rewrite repo was a textbook hobby-project lie. The README claimed "Ensemble Random Forest + LSTM" with a hardcoded `model_accuracy = 0.94` in `ml_models/traffic_predictor.py`. The "5 cities" with "3000+ intersections" were a Python literal: `for city in ["NYC", "LA", "Chicago", ...]: for i in range(600): ...`. The "94% accuracy" never measured anything — it was a constant returned from a function called `predict_traffic_flow`.

The rewrite holds itself to a different bar:

1. **Real topology, fetched from a citation-able source.** `scripts/fetch_osm.py` runs an Overpass API query for `highway=traffic_signals` within the downtown SF bounding box, gets 664 features, persists the snapshot at `data/sf_intersections.json` with the OSM IDs, lat/lon, and ODbL attribution. Anyone can re-run it and get the same numbers (modulo OSM edits since the snapshot).
2. **Measured optimizer delta, not claimed accuracy.** The microsim is the smallest viable corridor — 5 intersections — but Poisson-arrival traffic with a saturation flow rate, all the seeded, 40 trials per strategy. Two strategies: a fixed 45/45-second cycle (the baseline most pre-2010 traffic engineers default to) and the adaptive optimizer. Numbers are committed to `data/bench_results.json` alongside their parameters.
3. **Honest non-monotonic finding.** The headline +18.2% is at the peak arrival rate (0.4 veh/s east-west). The sweep tells a different story:

   ```text
   arrival rate (veh/s)   fixed thrpt   adaptive thrpt   throughput Δ
        0.2                 10.97          10.81          −1.4%
        0.3                 11.76          13.24         +12.6%
        0.4                 11.85          13.63         +15.0%
        0.5                 11.72          13.44         +14.7%
        0.6                 11.78          13.75         +16.7%
   ```

   At light load, the adaptive optimizer **hurts** throughput (−1.4%) and adds wait time (+18.7%) — because its queue-balancing logic adds switching overhead that's not justified when the demand fits the fixed cycle. The optimizer earns its keep only at moderate-to-heavy load, which is when real-world signalized corridors actually need help. This is the kind of finding I'd never have seen if I'd reported a single headline number — and the kind of finding a single headline number was originally fabricated to hide.

## Architecture

```text
   +-------------------------+
   | scripts/fetch_osm.py    |    Overpass API one-shot, ODbL-attributed
   |  - 664 SF signals       |    -> data/sf_intersections.json
   +-----------+-------------+
               |
               v
   +-------------------------+
   | TrafficSystemManager    |    boots from snapshot at app startup
   |  - loads JSON snapshot  |    no live sensor input — entire vehicle
   |  - exposes /system      |    state is the in-process simulator
   |    /topology endpoint   |
   +-----+-------------+-----+
         |             |
         v             v
   +---------+    +-----------------+
   | Traffic |    | SignalOptimizer |
   | Simul-  |    |  - 175 lines    |
   | ator    |<-->|  - rule-based:  |
   |         |    |    queue-bal +  |
   |         |    |    pattern-     |
   |         |    |    adaptive +   |
   |         |    |    congestion-  |
   |         |    |    relief       |
   +----+----+    +--------+--------+
        |                  |
        v                  v
   +-------------------------+
   | FastAPI dashboard       |    Chart.js metrics history,
   |  - /api/v1/traffic      |    SVG map of all 664 dots with
   |  - /api/v1/optimization |    bbox/scale-bar/compass,
   |  - /api/v1/bench        |    `// system reality` footer
   +-------------------------+    that distinguishes real from sim
```

The microsim (`src/bench/microsim.py`) is a separate offline harness: it instantiates the optimizer + a fresh simulator per trial, runs 30 min of sim time at 1 s ticks, records throughput / wait / queue / cleared-vehicle counts, persists summary statistics to `data/bench_results.json`. The same harness with a different arrival-rate loop produces `data/bench_sweep.json`.

## Key decisions

**OSM via Overpass, not a curated traffic dataset.** The other obvious data source would be Caltrans PeMS (real loop-detector data) or NYC Open Data signal locations. Both are sharper than OSM — they have signal IDs that map to real-world install records. I picked OSM because the snapshot is one curl away, the licensing is ODbL with attribution (clean), and the question I'm answering ("can I show a measured delta over a real topology") doesn't actually need install-record granularity. Tradeoff: OSM's `highway=traffic_signals` includes pedestrian-crossing signals and some stop-line markers, so 664 is slightly above the true count of vehicle-control intersections downtown. The dashboard footer says exactly this.

**5-intersection corridor for the bench, not all 664.** The microsim is a queue-dynamics model — it solves a difference equation per signal per tick. Scaling to 664 intersections would require routing logic between them (where do vehicles go after they clear the intersection?), which means a route generator, which means either a fixed OD matrix or a stochastic one, which means *another* set of assumptions you have to defend. The 5-intersection corridor is the smallest model that lets the adaptive optimizer differ meaningfully from fixed-time, and it's measurable in 1.5 minutes per strategy. The 664-intersection map is *topology* (real), not the *bench substrate* (5-intersection synthetic) — the dashboard never claims otherwise.

**Rule-based optimizer, not ML.** The optimizer is `src/optimization/signal_optimizer.py`, 175 lines of Python. It implements four heuristics — queue-balancing, time-of-day pattern adaptation, efficiency boost, congestion relief — combined into a single recompute step that runs every 30 simulated seconds. I wrote it because every paper I read on adaptive signal control eventually says "our ML model converges to a queue-balancing policy on common road geometries." If the convergent behavior is queue-balancing, I'd rather write the queue-balancer directly and call it what it is than train a model that learns the same thing and call it AI. The performance is what it is — measured, not claimed.

**`// system reality` footer on every page.** The dashboard has a literal two-column "Real / Simulated" table baked into the template. It says, in plain language: the topology is real, the optimizer Δ is measured, the vehicles/queues/sensor data are simulated, the previous "94%" was fabricated. I built this because the playbook for hobby-project ML projects is to put a fake number on the homepage and never qualify it. Putting the qualification on the page *next to* the number is the only way to keep the project honest as the codebase grows.

**4-line `requirements.txt`.** FastAPI, Uvicorn, requests, python-dotenv. No TensorFlow, no PyTorch, no scikit-learn. Earlier scaffolding pulled all three in for the fake "Random Forest + LSTM" claim. They're gone. The smallest dep tree is honest to what the code actually does, and the Docker image is correspondingly slim.

## What this is not

- **Not connected to real traffic data.** No SCATS feed, no Caltrans PeMS, no in-car GPS streams, no loop detectors. The corridor microsim is the entire source of "vehicles."
- **Not a deployable signal controller.** Real SCATS / OPAC / SCOOT controllers run on hardened embedded hardware, with cellular failover, signal-conflict matrices, and pedestrian-call inputs. This is a research-grade microsim — its purpose is to show whether the optimizer rule set produces a measurable delta in a controlled experiment, not to actually time signals.
- **Not an ML system.** Despite the original repo's claims. The "predictor" was never trained on anything — it returned the same hardcoded 0.94 confidence regardless of input.

## What I'd do differently

**Wire in a real OD matrix.** The microsim currently has vehicles arrive at the corridor's east edge and depart at the west edge (or vice versa). A real urban network has origin-destination demand: vehicles enter at point A, want to reach point B, and the route they take is a function of network state. Adding a tiny OD generator + a routing layer (even just shortest-path with congestion-aware re-routing) would let the bench cover network-scale effects, not just corridor effects.

**Switch the optimizer to a proper MILP at peak load and compare against the rule-based version.** Mixed-integer linear programming over a finite signal-state space is the textbook optimal-control approach for short corridors. It's slow (typically seconds per recompute), but it gives an upper bound on what *any* optimizer could achieve on this microsim. If my rule-based optimizer is within 5% of the MILP optimum, that's a strong claim. If it's at 60%, the rule set is the bottleneck and I'd know exactly where to invest.

**Add multi-modal (peds + transit). I haven't tested whether the optimizer's adaptive behavior gracefully degrades when the cost function includes pedestrian wait minimization or transit signal priority. Real downtown SF has both — and most adaptive optimizers fail at this in ways that aren't visible from a vehicle-only metric. This is the kind of follow-up that turns a hobby project into something a city would actually look at.

**The /api/v1/bench endpoint should embed the OSM snapshot's `generated_at` timestamp.** Currently the snapshot is committed; the API serves it from disk. If a new commit lands with a fresher OSM pull, there's no way to tell from the dashboard. A timestamp on the topology card would close that gap.

## Source

- Repo: [github.com/d-malhotra2020/traffic-optimization](https://github.com/d-malhotra2020/traffic-optimization)
- Live: [traffic-optimization-production.up.railway.app](https://traffic-optimization-production.up.railway.app/)
- Bench JSON: `data/bench_results.json` + `data/bench_sweep.json` (committed)
- Reproduce: `pip install -r requirements.txt && python -m src.bench.microsim`
