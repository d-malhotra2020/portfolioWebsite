## The hook

A market-data and analysis tool built around a single principle: every model has a sibling backtest function, and the code that runs live is the same code that runs in backtest. No notebook-only models, no marketing-only accuracy claims. It ingests daily bars from yfinance, computes a stack of technical indicators, runs a direction-prediction model, and serves a calibration report the UI reads straight from the harness — so the number on the page is always the number the harness measured.

## Architecture

```text
   +---------------------+
   |   yfinance daily    |     <-- ingestion, cached under
   |   bars              |         data/backtest_cache/
   +----------+----------+
              |
              v
   +---------------------+        +--------------------------+
   |  Technical analysis |        |  Backtest harness        |
   |  RSI · SMA · MACD   |<------>|  walk-forward replay,    |
   |  Bollinger · vol ·  |        |  no lookahead            |
   |  momentum           |        |  python -m app.backtest  |
   +----------+----------+        +-----------+--------------+
              |                               |
              v                               v
   +---------------------+        +--------------------------+
   |  predict_direction()|        |  calibration report      |
   |  (shared service —  |        |  data/calibration/*.json |
   |   same code live &  |        +-----------+--------------+
   |   in backtest)      |                    |
   +----------+----------+                    |
              |                               v
              v                   +--------------------------+
   +---------------------+        |  GET /api/v1/calibration |
   |  FastAPI read API   |<-------|  {latest, history}       |
   |  + Next.js dashboard|        +--------------------------+
   +---------------------+
```

`predict_direction()` is a single shared function. The live API and the backtest harness both call it — there is no separate "research" model that quietly diverges from what ships.

## Real accuracy (trust the harness, not the homepage)

The first version of this project's README claimed "94% accuracy" with nothing behind it. That number was aspirational, and I scrubbed it. The honest number, measured by the harness in `app/backtest/`, is:

**49.5% next-day direction accuracy** — 985 / 1990 predictions, 10 large-cap symbols (SPY, AAPL, NVDA, MSFT, GOOGL, AMZN, TSLA, META, JPM, BRK-B), trailing 12 months, 1-day horizon, no lookahead.

That's essentially coin-flip. The simple trend-extrapolation model has no edge on next-day direction across this universe — and the page says so. If a future model pushes the number higher, the harness will report it and the UI will follow. The README is not a place to make promises the harness can't back.

## Key decisions

**Backtest harness as a first-class feature, not a notebook script.** Every model has a sibling backtest function that runs against historical data and emits a calibration report (predicted vs. actual). The whole pipeline is "code that runs the same way live as it does in backtests." I have specific opinions about engineers who keep their backtests in notebooks they never check in — it's the same anti-pattern as tests that only pass on your laptop.

**Report the honest result, even when it's coin-flip.** The interesting engineering decision here wasn't the model — it was building the calibration plumbing so the system *can't* overstate itself. The dashboard fetches `data/calibration/latest.json` directly; there's no hand-edited number anywhere in the path. A 49.5% that I trust is worth more than a 94% I can't reproduce.

**FastAPI + Next.js, one Docker image.** The backend is FastAPI (auto-generated OpenAPI docs, Pydantic validation that caught a feed returning `NaN` as a string instead of a float). The frontend is a Next.js static export. Both ship in a single Docker image — Next.js build plus Python runtime — so there's one thing to deploy and one thing to reason about.

**yfinance daily bars, not a paid streaming feed.** Free-tier daily data disqualifies the system from any high-frequency strategy, and that's fine: the audience is "Drew learning how this stack works." Daily bars, cached locally, reproducible with one CLI command.

## What I'd do differently

**Move past trend-extrapolation.** The current model is deliberately simple — it's the baseline I built the harness around. The honest 49.5% is the *starting* point; the harness exists precisely so that any future model gets measured the same way before its number goes anywhere near the UI.

**Rolling-window calibration with drift alerts.** Right now I run the harness on demand. The right pattern is continuous rolling-window calibration that fires an alert when out-of-sample accuracy degrades. The infrastructure is there; I haven't wired the scheduler.

## Stack

Python, FastAPI, yfinance, pandas. Next.js (static export) + TypeScript frontend. yfinance daily bars cached under `data/backtest_cache/`. Backtest harness in pure Python (walk-forward replay, no lookahead). Deployed as a single Docker image on Railway.
