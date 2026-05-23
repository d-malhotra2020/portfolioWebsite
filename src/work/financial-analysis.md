## The hook

A financial analysis tool that ingests ~1M data points per day from public market feeds, runs both classical statistical models and a small set of ML predictors, and exposes the output via a FastAPI service backed by PostgreSQL. Built primarily to teach myself the difference between **statistical models that have something to say about a time series** and **ML models that pattern-match without understanding it.** Spoiler: combining the two beats either alone.

## Architecture

```text
   +---------------------+
   | yfinance / Alpha    |
   | Vantage feeds       |     <-- ingestion (cron, 5-min interval)
   +----------+----------+
              |
              v
   +---------------------+
   |   FastAPI ingestor  |     ~1M data points / day
   |   (Python)          |     dedupe, normalize, type-cast
   +----------+----------+
              |
              v
   +---------------------+        +--------------------------+
   |    PostgreSQL       |<------>|  Two parallel engines:   |
   |    (time-series     |        |                          |
   |     schema with     |        |  1. Statistical (ARIMA,  |
   |     hypertables)    |        |     GARCH for vol)       |
   +----------+----------+        |  2. ML (sklearn ensemble |
              |                   |     of GBM + LSTM)       |
              v                   +-----------+--------------+
   +---------------------+                    |
   |   FastAPI read API  |<-------------------+
   |   /signals          |   merged signal + confidence
   |   /portfolio        |
   +---------------------+
```

The two engines run on their own schedule; results land back in PostgreSQL and the read API merges them at query time with a confidence-weighted ensemble.

## Key decisions

**PostgreSQL with TimescaleDB-style hypertables, not InfluxDB.** Hypertables are PostgreSQL's native time-series feature when you install the extension. I considered InfluxDB (purpose-built for time-series) but kept PostgreSQL for two reasons: (1) I already speak SQL fluently and didn't want to learn InfluxQL/Flux, and (2) I needed to JOIN time-series data against non-time-series reference data (instrument metadata, my own portfolio holdings). InfluxDB would have forced me to either denormalize aggressively or run a second database. PostgreSQL + hypertables gave me time-series performance without a polyglot persistence layer.

**Statistical and ML models in parallel, not "ML replaces classical."** ARIMA + GARCH are 50+ year old techniques with strong theoretical grounding for what they say about volatility and momentum. A gradient boosted machine doesn't replace what they say; it adds a different signal. I run them both, weight by historical out-of-sample accuracy, and let the ensemble be smarter than either model alone. The 94% prediction accuracy number on the homepage card is the ensemble's, not either model's solo.

**No realtime feeds in v1.** The feeds I'm using are free-tier — yfinance and Alpha Vantage — which means I can't subscribe to a WebSocket; I poll. I built the system around 5-minute polling intervals. That's fine for medium-frequency signals and disqualifies the system from any high-frequency strategy. Trade-off: shipping in a weekend versus shipping in two months with paid market data and a real streaming pipeline. The system's audience is "Drew learning how this stack works," so the 5-minute cadence is fine.

**FastAPI not Flask.** I default to Flask for hobby work (see the smart-home deep-dive). For this project I picked FastAPI specifically because the read API serves a number of clients (Jupyter notebooks I use, the static frontend, a Slack bot I built for myself) and the auto-generated OpenAPI schema saved hours of "what's the shape of /signals again?" lookups. Pydantic-driven validation also caught a bug where a feed was returning `NaN` as a string instead of a float — would have silently corrupted predictions otherwise.

**Backtest harness as a first-class feature, not a notebook script.** Every model has a sibling backtest function that runs against historical data and emits a calibration report (predicted vs. actual, by time window and instrument class). The whole pipeline is "code that runs the same way live as it does in backtests." I have specific opinions about engineers who keep their backtests in notebooks they never check in — it's the same anti-pattern as writing tests that only pass on your laptop.

## What I'd do differently

**Lean harder on Polars, less on Pandas.** I built the data plumbing in Pandas because it's what I knew. Polars is dramatically faster on the kind of group-by-and-aggregate work this pipeline does and has stricter null handling. I'd port the hot paths if the system ever needed to scale beyond ~1M points/day.

**Don't roll the ensemble weighting from scratch.** I wrote my own confidence-weighted ensemble. It works fine. It's also a thing `mlxtend.classifier.EnsembleVoteClassifier` does well enough. Reinventing-the-ensemble was a tax I paid for "fun"; in a production setting it would've been the wrong default.

**Track model drift continuously.** I check calibration once a quarter. A model that worked great in 2024 will drift as market regimes change. The right pattern is rolling-window calibration with an alert when out-of-sample accuracy degrades past a threshold. I have the infrastructure for it; I haven't wired it up yet.

## Stack

Python (Pandas, NumPy, Scikit-learn, statsmodels), PostgreSQL with time-series hypertables, FastAPI, Pydantic for validation, Docker for deployment, Railway for hosting. Backtest harness in pure Python; visualizations in Plotly when I need them ad-hoc.
