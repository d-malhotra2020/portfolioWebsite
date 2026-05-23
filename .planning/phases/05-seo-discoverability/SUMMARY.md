# Phase 5 — Summary

**Phase:** SEO + Discoverability
**Shipped:** 2026-05-23
**Commit:** f16651f

## Shipped

- `public/robots.txt` — allow all, points at sitemap. Live at
  `https://drewmalhotra.com/robots.txt`.
- `public/sitemap.xml` — one entry (homepage), weekly changefreq.
  Live at `https://drewmalhotra.com/sitemap.xml`.
- Expanded homepage JSON-LD from one `Person` entity to a 6-entity
  `@graph`:
  - `WebSite` with description + publisher reference
  - `Person` with worksFor (Brivo), alumniOf ([UTD, ACC]), full
    knowsAbout keyword inventory matching the résumé, hasOccupation,
    sameAs (LinkedIn + GitHub)
  - `ProfilePage` linking the WebSite + Person
  - 3× `SoftwareApplication` entities for Smart Home, Financial
    Analysis, Donation Platform — each with codeRepository + creator
    reference back to Person
- `<meta name="description">` rewritten — concrete, role + location +
  experience + key platforms + veteran status. Drops the generic
  "Software Developer & Problem Solver" line.
- `<meta name="keywords">` updated — surfaces actual technical stack
  (Python SDET, AWS, pytest, AI/ML, LLM-augmented QA) + the employer
  names recruiters search for (Brivo, Eagle Eye Networks, Yunex
  Traffic, Givelify).
- OG / Twitter cards updated: title, description, image-alt, locale,
  profile type.
- `<meta name="robots">` extended with `max-snippet:-1` and
  `max-image-preview:large` so search results can render full
  snippets and large image previews.

## Success criteria

1. ✅ `robots.txt` and `sitemap.xml` exist and reachable at the live
   domain
2. ✅ Per-route `<meta>` tags present and accurate on the homepage
3. ✅ JSON-LD expanded beyond `Person` to include `WebSite`,
   `ProfilePage`, and per-side-project `SoftwareApplication`
4. 🟡 Google Search Console verifies ownership + reports sitemap as
   crawled — **Drew action**. See below.
5. 🟡 LinkedIn / Slack preview renders on-brand — homepage OG image
   remains `profilePhoto.jpeg` (the existing image). Per-post / per-work
   OG image is a deferred item from Phase 1.

## Drew action — submit sitemap to Google Search Console

1. Go to https://search.google.com/search-console
2. Add property `drewmalhotra.com` (Domain or URL prefix — Domain is
   stronger, verifies via DNS TXT record on Squarespace / wherever the
   DNS lives)
3. Once verified, navigate to Sitemaps in the sidebar
4. Add new sitemap, URL: `sitemap.xml`
5. GSC will crawl + report indexing status over the next few days

A second useful step: paste `https://drewmalhotra.com/` into
https://search.google.com/test/rich-results to verify the JSON-LD
parses and surfaces the `Person` + `SoftwareApplication` entities for
rich previews.

## Detour worth recording

The originally drafted plan promised "per-route metadata" — implying
crawlers would see different titles/descriptions per route. Researching
during execute-phase confirmed: hash routes (`/#/writing/<slug>`) are
treated as fragments of `/` by Google. Crawlers don't fetch them
separately. So per-route metadata investment goes into the homepage's
`<head>`, which is what gets indexed.

Real fix for per-route SEO/OG would require either prerendering
(migration to Next.js or Astro) or a Cloudflare Worker that injects
SEO meta tags into the response based on URL path. Both out of scope
for Phase 5; tracked as deferred.

## Deferred to follow-up

- **Prerendering / per-route OG images.** Real fix for hash-route
  invisibility to social scrapers. Cost: framework migration or
  runtime OG generation worker.
- **GSC submission.** Drew action.
- **`og:image` upgrade.** The current image is `profilePhoto.jpeg` — a
  posed portrait. A custom OG card (dark, monospace title, key
  identifiers) would convert better. Defer until per-page OG is
  solved; doing it for just the homepage isn't worth the design time.

## Metrics

- Lines of code added/changed: ~190 (mostly index.html JSON-LD)
- Bundle delta: index.html 5 KB → 10 KB (+5 KB raw, +1 KB gzipped).
  JS/CSS unchanged.
- New files: robots.txt, sitemap.xml
- Plans completed: 3 of 3
- Wall-clock time: ~20 min

## Next phase

Phase 7 — Refresh Side-Project Deployments. Audit each of the 6
deployed Railway projects to confirm they actually work. Anything
broken either gets fixed or removed from the homepage.
