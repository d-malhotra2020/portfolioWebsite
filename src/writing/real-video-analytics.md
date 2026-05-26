## The thing my YOLOv8 benchmark isn't

Last week I rebuilt [video-analytics](/work/video-analytics) into an honest benchmark. The headline numbers are real, the measurements are reproducible, and the README no longer claims I'm processing 500 streams I never wrote. But the benchmark is COCO val2017 — still images, sampled, annotated to a fault. The OpenCV `vtest.avi` demo clip is 10 fps in a parking lot.

Neither of those is video analytics. They're object detection on individual frames, with a thin visualization tier draped over the top.

If a hiring manager asked me what a *real* video-analytics platform would actually look like — the kind you'd run at Brivo's scale, or a city CCTV deployment, or a retail loss-prevention setup — I'd want to be able to answer it. So I'm writing the answer down, partly as a thought-experiment for me, partly as a roadmap for what the project becomes if I keep shipping on it.

## The four gaps

**Gap 1: detection over time, not detection per frame.** YOLOv8 doesn't know that the person in frame 41 is the same person as the one in frame 42. That's tracking, and it's the layer that turns "object detection" into "video analytics." Without it, you can't answer any question a real operator cares about: how long was someone in the lobby, did the same car drive past three times, when did this person leave. The benchmark I shipped has none of this. The next milestone is ByteTrack on top of YOLOv8 — same model, IDs assigned across frames via Kalman + IoU matching. ~1 hour of code; the metric becomes "ID-switch rate per minute" instead of "F1 per frame."

**Gap 2: streams arrive concurrently and asynchronously.** A real platform doesn't sit there with a `for frame in video.read():` loop. It has N camera streams pushing RTSP / WebRTC into a message bus, K workers pulling decoded frames out, an autoscaler that spawns more workers when the bus backlog exceeds threshold, and a backpressure story for when a single camera's stream rate exceeds the model's per-frame throughput. The pieces I'd reach for: GStreamer for ingestion, Kafka or NATS for the bus, Triton inference server (or one of its competitors) for the model. None of that is "AI" — it's distributed-systems plumbing in front of an AI primitive.

**Gap 3: false positives are not symmetric to false negatives.** My COCO benchmark reports precision and recall as a pair, which is correct for a benchmark. Production systems care way more about one direction than the other, and which direction varies by deployment. Retail loss prevention wants high precision — a wrong "shoplifter detected" alert sent to a store manager is operationally expensive, while missing one is recoverable. Security perimeter detection wants high recall — missing an intruder is the failure mode you can't undo. The same YOLOv8n weights serve both, but the *system around the model* is wildly different: different confidence thresholds, different escalation chains, different review workflows. None of that is captured by a single F1.

**Gap 4: the model isn't the thing. The pipeline around the model is.** YOLOv8n's headline F1 of 0.688 is roughly the *floor* of what a real deployment achieves, because real deployments do four things the benchmark doesn't:

```text
benchmark               real deployment
─────────────────────────────────────────────────────────────
1 model pass            multi-pass: detection → re-detection on low-confidence
                                    crops → ensemble vote on high-stakes alerts
naive top-K boxes       NMS + tracking + temporal smoothing
                       (a noisy 1-frame box doesn't fire an alert)
single confidence       per-class confidence (a "weapon" alert needs 0.95;
threshold              a "person" tracking ID needs 0.4)
model upgrades         shadow-mode deployment: run new model alongside old,
in production           compare alerts, gate the cutover on disagreement rate
```

Every one of those is operational engineering. None is novel ML. But together they're the difference between "the model achieves 0.688 F1 on COCO" and "the platform achieves 99.5% alert reliability at <1% false-alarm rate, measured in production."

## What I'd build, in order

If I committed another four sessions to video-analytics, here's the order I'd pick:

**Session 1: ByteTrack on top of YOLOv8.** Per-track IDs across frames. Update the demo to render trajectory lines through the clip. Metric: ID-switch rate per minute on MOT17-04 (a benchmark sequence that has ground-truth tracks). Maybe ~hr of code, half a day if I have to bring in a tracking-aware GT format.

**Session 2: real CCTV-style clip + density curve.** Replace `vtest.avi` with one of the MOT17 sequences (or a public dashcam clip from BDD100K — both are gated behind permissive licenses I can attribute properly). Show how the detector's F1 changes as scene complexity grows. The current density sweep is *per-image* over COCO; this would be *per-second* over a continuous stream, which is the failure mode that matters for surveillance.

**Session 3: a "/predict" endpoint that's actually live.** Right now everything runs offline; the Railway image is ~110 MB because torch isn't in it. A small "/predict" endpoint that accepts an uploaded image and returns YOLO detections would prove the pipeline at request time. Tradeoff is the image grows to ~3 GB — I'd want to use a separate, cold-started service so the static dashboard stays snappy. Maybe Lambda or Cloud Run, since Railway free tier won't carry the model weight.

**Session 4: streaming demo.** RTSP ingest, frame-decoder worker, YOLO inference, a websocket out to the dashboard. Even just one camera. The point isn't multi-stream scale (Brivo has that handled); the point is showing the end-to-end loop where frames arrive and detections push back to the operator in something like real time. Half-day if I limit it to one stream and a single model worker.

None of those is hard, individually. The hard part is that each session has to land with measured numbers — the playbook from the previous post applies. "Streaming demo at 30 fps" is a claim I'd have to back with a recorded run. "ID-switch rate of X per minute" is one I'd have to compute against benchmark GT. The model isn't novel; the discipline is.

## What this would and wouldn't prove

A platform with all four of those sessions still wouldn't be the thing Brivo runs in production. Brivo's surveillance platform handles tens of thousands of cameras, federated identity across reseller hierarchies, regional data-residency requirements, multi-tenancy at the hardware level, and a feedback loop where customer-flagged false positives retrain the model weekly. None of that is in my hobby project's scope, and pretending it is would be the same fabrication problem the previous post is about.

What the platform would prove is something more specific: that I can take a research-grade detector and build the operational layer around it that turns it from "model with a number" into "system with a story." That's the gap most ML hobby projects don't cross, and it's the gap I'm interested in because it's the gap that comes up in real engineering work.

I rebuilt video-analytics last week as a benchmark. The next moves turn it into a platform — small one, honest scope, measured at each step.

Drew

If you want to talk about video pipelines, tracking algorithms, or what real-time inference engineering actually looks like — [drop me a note](mailto:dhruvmalhotra2026@gmail.com) or ask the agent on the [home page](/). I read everything.
