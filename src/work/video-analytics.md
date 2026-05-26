## The hook

A video object-detection benchmark with **measured** results, not aspirational ones. Off-the-shelf YOLOv8n (the smallest model in the Ultralytics family — 6.2 MB) run over a stratified sample of [COCO val2017](https://cocodataset.org/), greedy-IoU-matched at 0.5, reporting per-class precision/recall/F1 plus a density sweep. Live operator console at [video-analytics-production.up.railway.app](https://video-analytics-production.up.railway.app), reproducible in ~3 minutes via `make bench`.

The headline numbers, copied straight from the dashboard:

```text
Model:    yolov8n  (6.2 MB, ~80 ms per CPU inference)
Dataset:  COCO val2017 sample, 210 images, 1512 GT boxes
Matching: greedy IoU @ 0.5, confidence 0.25

                  precision  recall   f1
  person           0.752    0.634   0.688
  vehicle          0.731    0.508   0.600

DENSITY SWEEP (person F1)
  sparse  (0–2)   0.798
  medium  (3–8)   0.758
  dense   (9+)    0.651       ← honest degradation in crowds
```

## Why this exists

This repo was the most flagrantly fabricated of my hobby-projects. The previous README claimed:

> *"Processes 500+ camera streams simultaneously. AI-powered threat detection. 4,600+ alerts processed. 92% threat correlation accuracy."*

Every one of those numbers was made up. The code behind the *threat detection* was literally:

```python
import random
if random.random() < 0.1:
    threats.append({"type": random.choice(["intrusion", "weapon", ...]), ...})
```

The "92% accuracy" was a hardcoded log line printed at startup. The "500+ streams" was a `for i in range(125)` over 4 hard-coded locations producing mock `Camera` objects that never touched a video frame.

I deleted all of it. The current repo is a transparent benchmark of an off-the-shelf detector. The point is to show what the work *actually does* when there's a real measurement layer instead of fabricated numbers — same playbook I ran on smart-home, traffic-optimization, financial-analysis-tool, and donation-platform.

## Architecture

```text
   +-------------------+
   | scripts/fetch_data.py  | one-shot, deterministic
   |   - downloads COCO val2017 annotations (20 MB)
   |   - stratifies images by GT person-count
   |   - fetches ~210 images (sparse + medium + dense)
   |   - fetches OpenCV's vtest.avi demo clip
   +---------+---------+
             |
             v
   +-------------------+        +------------------------+
   | scripts/run_benchmark.py  | scripts/run_demo.py    |
   |   - YOLOv8n inference     |   - samples 12 frames  |
   |   - greedy IoU matching   |   - draws annotated    |
   |     at 0.5, conf 0.25     |     boxes, JPEGs out   |
   |   - per-class P/R/F1      |   - per-frame counts   |
   |   - density sweep         |                        |
   +---------+---------+        +-----------+------------+
             |                              |
             v                              v
   +-------------------+        +------------------------+
   | data/bench_results.json   | data/demo_results.json |
   |                            | data/demo_frames/*.jpg |
   +---------+---------+--------+-----------+------------+
                                |
                                v
                    +--------------------------+
                    | src/main.py (aiohttp)    |
                    |   - renders dashboard.html
                    |   - serves static frames |
                    |   - no inference at      |
                    |     request time         |
                    +--------------------------+
```

The split is intentional. The bench env carries `ultralytics + torch + opencv` (~3 GB installed); the Railway runtime carries `aiohttp + jinja2 + nothing else` (~110 MB image). Inference happens once, locally, on a developer machine. Results are committed to the repo. Production just serves the JSON and the JPEGs.

## Key decisions

**No claim about novel models.** The dashboard says "off-the-shelf YOLOv8n" in the topbar. There's no fine-tuning, no custom training, no proprietary detector. The honest framing is *"here's what a publicly-available detector actually achieves on a publicly-available benchmark, measured by code you can run yourself."* That's a much smaller claim than "we built an AI threat detection platform," and it's the only claim I'm willing to defend.

**Density sweep, not just an overall number.** A single F1 score hides the most interesting finding: detection quality degrades in crowds. Person F1 drops from 0.798 (sparse: 0–2 people in frame) to 0.651 (dense: 9+ people in frame). That's the kind of thing a hiring manager looking at this card cares about — not the headline number but the shape of failure. If I'd just reported "F1 = 0.688" I'd have hidden the most useful information in the data.

**Vehicle precision > recall, by a lot.** P=0.731 vs R=0.508 means the detector is conservative: when it says "vehicle" it's usually right (only 47 false positives out of 175 vehicle predictions), but it misses about half the vehicles in the GT set. That makes sense — YOLOv8n is the *nano* variant, designed for edge devices, and COCO has a wide vehicle-class distribution (bicycles, motorcycles, trucks, buses) that a 6 MB model can't all model well. A real-world deployment would either use YOLOv8m/l or fine-tune on the target domain.

**Greedy matching, not Hungarian.** The matcher iterates predictions in confidence-descending order and lets each one greedy-claim the best-IoU unmatched GT box. This is the standard COCO-eval approach and produces deterministic results without a solver dependency. I do have a `tests/test_iou_matching.py` with 15 pytest cases covering the IoU arithmetic, the greedy assignment, and the metrics formulas — because a silent off-by-one in IoU would skew every number on the page in ways that aren't visible at a glance.

**Runtime tier intentionally trivial.** The aiohttp app is ~70 lines. It loads two JSON files at startup, has one Jinja2 template, serves the demo frames as static files. Deliberately boring. The interesting code is in `scripts/run_benchmark.py` and the Jinja template; the web layer is just a vehicle to render them.

## What this is not

- **Not a real-time multi-stream system.** No RTSP, no GStreamer, no Kafka. The dashboard renders a *static* benchmark; the "demo clip" is 12 sampled frames from an 80-second OpenCV example video, batch-processed offline.
- **Not a "threat detection" platform.** Person and vehicle classes only. No anomaly model, no behavior classifier, no semantic-event layer. Object detection is one primitive *inside* a real surveillance pipeline; calling it "threat detection" would be sleight-of-hand.
- **Not deployable as-is for surveillance.** The model is the COCO-pretrained `yolov8n`, which is great as a baseline and terrible for, say, weapon detection (not in COCO classes), small object detection at distance (model capacity), or low-light scenes (training distribution). A real deployment needs domain-specific data + fine-tuning.

## What I'd do differently

**Larger sample for the headline.** 210 images is enough to get a stable F1 to two decimal places, not three. The full COCO val2017 is 5000 images — a couple-hour bench run on a laptop would tighten the error bars. I capped at 210 because the harness is a side project and bench reproduction time matters more than the third decimal place.

**Add a real CCTV-domain clip.** vtest.avi (parking lot, ~6 people max) is the easy case. To show what fails interestingly I'd want a busier scene — MOT17 or AICity benchmark sequences are the canonical choices. Both are gated behind registration walls; OpenCV's sample shipped under Apache 2 and is one curl away. Pragmatic call.

**Tracking, not just detection.** What surveillance actually wants is *the same person across consecutive frames*, not *here are the people in this still*. ByteTrack on top of YOLOv8 is the obvious next step, and the demo-tier code already has a per-frame loop where IDs could be assigned. Out of scope for this round.

**A live "/predict" endpoint.** Right now everything is offline + committed. A small endpoint that runs YOLO on a user-uploaded image would prove the pipeline at request time — but pulling torch + ultralytics into the Railway image takes it from ~110 MB to ~3 GB. Tradeoff I chose to defer.

## Source

- Repo: [github.com/d-malhotra2020/video-analytics](https://github.com/d-malhotra2020/video-analytics)
- Live: [video-analytics-production.up.railway.app](https://video-analytics-production.up.railway.app)
- Bench JSON: `data/bench_results.json` (committed)
- Reproduce: `make install && make fetch && make bench && make demo && make serve`
