# Phase 5 — Context

**Phase:** SEO + Discoverability
**Goal:** When a recruiter searches "Drew Malhotra SDET Austin," this
site shows up on page 1 with a rich preview. Make every part of the
site indexable and presentable to crawlers + social-media scrapers.

---

## Decisions locked

### What ships in Phase 5

- **`public/robots.txt`** — allow all crawlers, point at sitemap.
- **`public/sitemap.xml`** — static, lists the homepage (the only
  separately-crawled URL on a SPA with hash routing).
- **Expanded schema.org JSON-LD on the homepage** — currently has just
  `Person`; add `WebSite`, per-side-project `SoftwareApplication`, and
  per-role `WorkExperience`.
- **Per-page `<title>`/`<meta description>` updates** continue to work
  for writing + work posts (already implemented in WritingPost.jsx and
  WorkPost.jsx via document.title side-effects).
- **Google Search Console submission** — documented as a Drew-action
  in the SUMMARY (Drew owns the GSC account).

### Important constraint — hash routes are SEO-invisible

Google treats `drewmalhotra.com/#/writing/patch-vulnerability` as a
fragment of `drewmalhotra.com/` — not a separate URL. The hash router
gets the user there, but a recruiter who lands on `drewmalhotra.com/`
gets the homepage's index.html with its meta tags + JSON-LD.

This means:
- The homepage's `<head>` is what crawlers index.
- Per-post titles in the document.title are still set client-side for
  visitor UX (visible in the browser tab), but social previews share
  the homepage OG image (already a deferred item from Phase 1).
- The right SEO investment is to make the homepage's `<head>` as rich
  as possible. The sitemap lists only the homepage.

### What's NOT in scope

- **Per-route prerendering** (Next.js / Astro migration) to get per-post
  meta + OG images crawled correctly. Real fix; out of scope for Phase 5;
  noted as a separate roadmap candidate.
- **Cloudflare Worker runtime OG generation** — would let us serve
  per-post OG images without prerendering. Also out of scope.
- **Domain-level performance work** (compression headers, asset
  preload) — that's perf territory, not SEO.

---

*Authored: 2026-05-23 during gsd-discuss-phase 5.*
