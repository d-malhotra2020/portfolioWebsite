# Phase 2 — Context

**Phase:** Per-Project Deep-Dive Pages
**Goal:** Each "selected work" card on the homepage opens to a richer page
(architecture, decisions, lessons). Skips NDA-adjacent projects.

---

## Decisions locked in discussion

### Scope — which projects get deep-dives

In-scope (4 deep-dives):

- **#003 — Donation Platform Recommender** — echoes Givelify but Givelify is older / lower NDA risk; side project may have meaningful divergence
- **#004 — Financial Analysis Engine** — likely original (not derived from a job); strong fit
- **#005 — Smart Home Automation** — genuinely original IoT project, real architectural decisions
- **#006 — This Portfolio** — meta but engaging; covers operator-console aesthetic, Cloudflare Worker agent architecture, hash-router decision, LLM-augmented workflow

Out of scope:

- **#001 — Video Surveillance Analytics** — too close to current Brivo work; NDA edge cases
- **#002 — Traffic Flow Optimization** — too close to Yunex work; same concern

The two skipped project cards remain on the homepage with source + live
links but no deep-dive route.

### Page focus

**Architecture + decisions, engineering audience.** Each deep-dive page leans
on the *why I chose X over Y* / *tradeoffs* / *what I'd do differently*
framing rather than outcome storytelling. Reads as senior engineering.

Per-page structure:

1. **Hook** (1 paragraph) — what the project does in one sentence + the
   single most interesting decision
2. **Architecture** — diagram or text-described component map; data flow
3. **Key decisions** — 2-4 specific decisions with tradeoffs (e.g.,
   "Raspberry Pi + MQTT over an off-the-shelf hub: why")
4. **What I'd do differently** — honest reflection
5. **Stack + links** — tech list, source + live (the same surfaced on the
   card)

Word target: ~600-900 per page (lighter than the Phase 1 case study,
which was a single-topic longform).

### Card UX

The whole project card on the homepage becomes a clickable link to its
deep-dive. The existing `source` and `live` buttons become small inline
anchors at the bottom of the card (or the row of pills converts to small
text links). When the project has no deep-dive (#001, #002), the card is
NOT clickable as a whole; source + live stay as buttons.

### Implementation choices (Claude's call)

- **Reuse the Phase 1 writing infrastructure.** The markdown renderer +
  hash router from `src/lib/` works as-is. Add a parallel `/work` route
  family for project deep-dives.
- **`/work` deep-dives are NOT in the `/writing` index.** They're a
  different content type. The homepage project cards are their index.
- **Routes:** `#/work/donation-platform`, `#/work/financial-analysis`,
  `#/work/smart-home`, `#/work/this-portfolio`. Slugs match the project
  source repos where they exist.
- **Architecture diagrams:** lean on ASCII art / mermaid-style text
  diagrams rendered as code blocks rather than image generation. Avoids
  the OG image problem and keeps content authorable in markdown.
- **Card change:** modify `Projects.jsx` to render an `<a>` wrapping the
  card when `project.deepDive` is true, else render as before. Source/live
  buttons become inline anchors when wrapped (to avoid nested-anchor
  invalid HTML).

---

## Deferred / out of scope for Phase 2

- Video / animated GIFs of project use. Static text and ASCII diagrams
  ship today; richer media in a follow-up if it's worth the work.
- Per-project OG images (same SPA-prerender constraint as Phase 1).
- Adding new projects. The 6 currently on the site are the universe;
  adding more is its own phase.

---

## Open questions for execute-phase

- Donation Platform Recommender's deep-dive: how to write honestly about
  a side-project that echoes Givelify work. Lean on the *technical* side
  (PyTorch ranking model details, the recommender architecture) and avoid
  any Givelify-specific business detail.
- Should the homepage card preview the deep-dive's hook paragraph? Or
  keep the current summary copy? Default: keep current; deep-dive is
  reachable in one click.

---

*Authored: 2026-05-23 during gsd-discuss-phase 2.*
