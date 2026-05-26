## The thing I had to delete five times

Across five of my hobby projects, the homepage card claimed a number that the code wasn't measuring. None of them were lies in the "intent to deceive" sense — they were inheritance. I'd cloned a project scaffold, kept the impressive-sounding metric, and never wired up the measurement that would have justified it. Then I shipped it to a portfolio site that was supposed to make me look credible.

The list, condensed:

```text
project                    fabricated claim                       what was actually there
─────────────────────────────────────────────────────────────────────────────────────────
video-analytics            "500+ camera streams"                 for i in range(125): mock
                           "4,600+ alerts processed"             hardcoded log line
                           "92% threat correlation accuracy"     if random.random() < 0.1: …

traffic-optimization       "Ensemble Random Forest + LSTM"       175-line rule-based heuristic
                           "94% prediction accuracy"             model_accuracy = 0.94  (literal)
                           "3,000+ intersections, 5 cities"      for city in [...]: range(600)

donation-platform          "1.5M users · +25% retention"         scaffold of an idea
                                                                  (no backtest, no users at all)

financial-analysis         "94% prediction accuracy"             no backtest harness existed
                                                                  the number had no provenance

smart-home-automation      "30% energy savings"                  no power telemetry collected,
                                                                  no broker round-trip wired
```

I shipped a fix for each of these in a single playbook. The same five steps every time. Writing the playbook down is the point of this post.

## The playbook

**Step 1: list every quantitative claim.** Open the README, the homepage card, the dashboard, the deep-dive. Anything with a number — accuracy, throughput, count, latency, percentage — goes in a list. Don't pre-judge whether each is real. Just collect them.

**Step 2: trace each to a measurement.** For each claim, find the line of code that emits the number. If the chain is `value → calculation → measurement → real data`, the claim survives. If it's `value → hardcoded constant`, `value → random.uniform()`, or `value → "I copied this from the project scaffold"`, the claim dies.

**Step 3: pick a smallest honest measurement.** Don't try to defend the original claim by retroactively wiring up a measurement that supports it. Instead, ask: "What's the smallest experiment I can run that actually measures something true about this system, and what number does it produce?" That number is your new headline.

For video-analytics, the smallest honest measurement was: "Run YOLOv8n on a stratified sample of COCO val2017, match predictions to ground truth, report precision/recall." Two hours of code. Real numbers. The reported person F1 came out to 0.688 — much less impressive than "92% threat correlation accuracy" — but it survives the question "what does this number actually mean?"

**Step 4: commit the result.** The output of step 3 — JSON, plots, whatever — gets committed to the repo. Not regenerated in CI, not derived at runtime from sources that might disappear. Committed. So the claim and the evidence stay together as long as the code does.

**Step 5: replace the claim everywhere, in one sweep.** README, dashboard, portfolio card, deep-dive. The new number doesn't live in five different formulations across five surfaces, each slightly different — that's how the original fabrications survived for so long. One canonical claim, repeated verbatim.

## What dies in step 2 that's easy to miss

Most of the fabrications were obvious at this point. `random.random()` in a "threat detector" is hard to defend with a straight face. A `model_accuracy = 0.94` literal is its own confession.

But there's a more subtle class that's worth flagging because I missed it on my first pass:

**Numbers that *should* be measurable but aren't measured.** "30% energy savings" on a home-automation system is the kind of claim a real product would make based on aggregating power-meter readings over months. My version had no power telemetry collected at all. The claim wasn't lying about the measurement; the measurement didn't exist. That's worse, in a way — the claim is *plausible* enough that a reader might not question it.

The test for these is: if I had to defend this number to a hiring manager who said "show me the calculation," could I? If the answer is "well, I'd have to add the measurement layer, then run the experiment, then aggregate, then..." — the claim isn't yours yet. It's an aspirational number wearing the costume of a measured one.

## What happens to the project once you do this

The first surprise: the new numbers are nearly always less impressive than the originals. "99% catalog coverage" beats "1.5M users" only if you understand catalog coverage. "+18.2% throughput vs fixed-time at moderate-to-heavy load" requires a paragraph of context where "94% accuracy" required none.

The second surprise: that's fine. Hiring managers (and engineers reviewing your work) read past the headline. They look for whether the number has provenance, whether the measurement is reproducible, whether you can explain the failure modes. A 0.688 F1 that comes with a density-sweep table showing where it degrades is more compelling than a 0.94 that comes with nothing.

The third surprise: the *project itself* gets better. Once you commit to measuring, you discover failure modes the original "94%" was happily hiding. The video-analytics density sweep showed person-class F1 dropping from 0.798 (sparse scenes) to 0.651 (dense scenes) — a 19% relative drop in crowds. The traffic optimizer turned out to *hurt* throughput at light load. Both findings are honest enough that I'd rather tell them than the fabricated version, because they're the kind of thing an engineer reading the page would find interesting.

## What I'd do differently next time

I built five projects whose initial scaffolding shipped before the measurement layer did. Going forward, I'd flip the order: the measurement harness lands in the first commit, and every feature that follows has to feed into it. No metric in a README until there's a `make bench` that produces it.

The other change is rhetorical, not technical. I now write headlines like "0.688 person F1 on COCO val2017, drops to 0.651 in dense scenes" instead of "97% accuracy." The first form is uglier. It also can't be challenged by a careful reader, because every word in it points at something that ships in the repo. That's the property I want.

## The point of all this

There's a class of project that lives forever in "scaffold + impressive number" form because nobody ever asks what the number means. The bar for hobby work is supposed to be loose enough to allow it. I think that's wrong — partly because the bar is what shapes the work, but mostly because the bar is what shapes me. I write code differently when the number has to come from a measurement than when it can come from a literal. Better, slower, and with a much clearer eye for what the system actually does.

Drew

If you want to talk about how to instrument hobby projects so the numbers are real, or if you've spotted a fabricated claim on something I shipped that I missed — [drop me a note](mailto:dhruvmalhotra2026@gmail.com) or ask the agent on the [home page](/). I read everything.
