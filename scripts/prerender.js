#!/usr/bin/env node
// Build-time prerender for per-page OG metadata.
//
// The site is a hash-router SPA on GitHub Pages — every URL fetch returns
// `dist/index.html`, so social-media crawlers (Twitter / LinkedIn / Slack /
// Facebook), which don't execute JS, see the same generic OG meta for every
// shared link. This script copies the built index.html into per-route
// subdirectories with route-specific meta tags swapped in:
//
//   dist/work/<slug>/index.html        OG title/desc/image for that work post
//   dist/writing/<slug>/index.html     OG title/desc/image for that writing post
//
// Each stub also includes a tiny `<script>` BEFORE the SPA bundle that sets
// `window.location.hash` to the matching route — so the SPA boots straight
// into the deep-dive view rather than the home page. No redirect, no flicker.
//
// Keep ROUTES in sync with src/work/registry.js + src/writing/registry.js.
// 7 entries today; if this list grows past ~15 it's worth a JSON source of
// truth that both the runtime registry and this script read from.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const dist = resolve(repoRoot, 'dist')
const indexPath = resolve(dist, 'index.html')

const SITE = 'https://drewmalhotra.com'
const DEFAULT_OG = `${SITE}/og/default.png`

const WORK_ROUTES = [
  {
    slug: 'video-analytics',
    title: 'Video Analytics — YOLOv8 Honest Benchmark',
    description:
      "Off-the-shelf YOLOv8n measured on a 210-image stratified COCO val2017 sample. Person F1 = 0.688 (0.798 sparse → 0.651 dense). Reproducible via `make bench`.",
  },
  {
    slug: 'traffic-optimization',
    title: 'Traffic Flow Optimization',
    description:
      'Rule-based adaptive signal optimizer measured on a Poisson-arrival microsim, draped over 664 real OSM signalized intersections in downtown SF. +18.2% throughput vs fixed-time at peak load — but honest losses at light load.',
  },
  {
    slug: 'donation-platform',
    title: 'Donation Platform Recommender',
    description:
      'Two-tower PyTorch recommender benchmarked against 5 baselines on 3K real ProPublica nonprofits. NDCG@10 = 5.7× random, 99% catalog coverage. `make bench` reproducible.',
  },
  {
    slug: 'financial-analysis',
    title: 'Financial Analysis Engine',
    description:
      'Time-series ingestion + statistical + ML ensemble over public market feeds. 49.5% honest next-day-direction accuracy on 1,990 predictions across 10 large caps — replacing an earlier unbacktested "94%" claim with measured numbers.',
  },
  {
    slug: 'smart-home',
    title: 'Smart Home Automation',
    description:
      'Flask command center + real paho-mqtt Mosquitto broker round-trip + graceful sim-mode degradation. Operator-terminal UI on a Raspberry Pi. `// system reality` footer keeps the dashboard honest about what is real vs simulated.',
  },
  {
    slug: 'this-portfolio',
    title: 'This Portfolio',
    description:
      'Operator-console aesthetic. React + Vite, custom CSS design system, Framer Motion choreography. LLM-augmented build, with my voice on top. Deployed via GitHub Pages.',
  },
]

const WRITING_ROUTES = [
  {
    slug: 'patch-vulnerability',
    title: 'The PATCH that nullified prod — Drew Malhotra',
    description:
      'How an API input-validation audit at Brivo surfaced a vulnerability that let production records have their required fields removed — and what it taught me about adversarial testing.',
  },
  {
    slug: 'honesty-playbook',
    title: 'The honesty playbook — Drew Malhotra',
    description:
      "Five of my hobby projects shipped homepage claims the code wasn't measuring. I scrubbed them in a single week. This is the five-step playbook I used, and what it taught me about the difference between claims and measurements.",
  },
  {
    slug: 'real-video-analytics',
    title: 'What a real video-analytics platform would need — Drew Malhotra',
    description:
      'My YOLOv8 benchmark is object detection on still images with a thin visualization tier. Here is the roadmap that turns it into something a hiring manager would call a platform — tracking, streaming, asymmetric error budgets, shadow-mode deployment.',
  },
]

const STANDALONE_ROUTES = [
  {
    slug: 'resume',
    title: 'Drew Malhotra — Résumé',
    description:
      'Software Engineer · SDET in Austin, TX. 6+ years across enterprise test automation, API validation, AI/ML systems. Currently SDET at Brivo. Open to senior engineering roles.',
    ogImage: DEFAULT_OG,
    urlPath: '/resume',
  },
]

/** Escape attribute value safely for HTML. */
const attr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/**
 * Swap the meta tags in the existing built index.html for route-specific ones,
 * and prepend a hash-redirect script so the SPA boots at the right route.
 */
function rewriteForRoute(html, { kind, slug, title, description, ogImage: customOg, urlPath }) {
  const url = urlPath ? `${SITE}${urlPath}` : `${SITE}/${kind}/${slug}`
  const ogImage = customOg || `${SITE}/og/${kind}/${slug}.png`
  const ogType = 'article'

  // 1. Title — surgical replacement of the existing <title>...</title>.
  let out = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${attr(title)}</title>`
  )

  // 2. Per-page description (overrides the site-default name=description).
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${attr(description)}" />`
  )

  // 3. Canonical points to the prerendered path (not the hash route — crawlers
  //    can't see hashes anyway, and search engines prefer canonical paths).
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${attr(url)}" />`
  )

  // 4. og:* — rewrite type / url / title / description / image / alt.
  out = out.replace(
    /<meta property="og:type" content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${ogType}" />`
  )
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${attr(url)}" />`
  )
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${attr(title)}" />`
  )
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${attr(description)}" />`
  )
  out = out.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${attr(ogImage)}" />`
  )
  out = out.replace(
    /<meta property="og:image:alt" content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${attr(title)}" />`
  )

  // 5. twitter:* mirror.
  out = out.replace(
    /<meta property="twitter:url" content="[^"]*"\s*\/>/,
    `<meta property="twitter:url" content="${attr(url)}" />`
  )
  out = out.replace(
    /<meta property="twitter:title" content="[^"]*"\s*\/>/,
    `<meta property="twitter:title" content="${attr(title)}" />`
  )
  out = out.replace(
    /<meta property="twitter:description" content="[^"]*"\s*\/>/,
    `<meta property="twitter:description" content="${attr(description)}" />`
  )
  out = out.replace(
    /<meta property="twitter:image" content="[^"]*"\s*\/>/,
    `<meta property="twitter:image" content="${attr(ogImage)}" />`
  )
  out = out.replace(
    /<meta property="twitter:image:alt" content="[^"]*"\s*\/>/,
    `<meta property="twitter:image:alt" content="${attr(title)}" />`
  )

  // No client-side shim needed — the router (src/lib/router.js) reads from
  // window.location.pathname as a fallback when there's no hash, so a refresh
  // on /work/<slug> renders the deep-dive natively. Crawlers get the static
  // OG meta above; humans get the SPA at the right route. The URL bar stays
  // clean (`/work/<slug>`, no hash).

  return out
}

/** A simple OG default that exists at /og/default.png — for now, fall back
 *  to the existing profile photo if the OG generator hasn't run yet. */
function fallbackOGImage(html) {
  // If /og/default.png doesn't exist yet, keep the original site OG image
  // (the profile photo). The route-specific stubs reference /og/<kind>/<slug>.png
  // which the build-og-images.js script will populate.
  return html
}

async function emit(html, { kind, slug }) {
  const dir = resolve(dist, kind, slug)
  await mkdir(dir, { recursive: true })
  await writeFile(resolve(dir, 'index.html'), html, 'utf8')
  console.log(`  /${kind}/${slug}/`)
}

async function main() {
  if (!existsSync(indexPath)) {
    console.error(`[error] ${indexPath} not found. Run \`vite build\` first.`)
    process.exit(1)
  }

  const indexHtml = await readFile(indexPath, 'utf8')

  console.log('[prerender] emitting per-route stubs:')
  for (const r of WORK_ROUTES) {
    const html = rewriteForRoute(indexHtml, { kind: 'work', ...r })
    await emit(fallbackOGImage(html), { kind: 'work', slug: r.slug })
  }
  for (const r of WRITING_ROUTES) {
    const html = rewriteForRoute(indexHtml, { kind: 'writing', ...r })
    await emit(fallbackOGImage(html), { kind: 'writing', slug: r.slug })
  }
  for (const r of STANDALONE_ROUTES) {
    const html = rewriteForRoute(indexHtml, { kind: r.slug, ...r })
    // Standalone routes live at /<slug>/ (e.g., /resume/), so we emit
    // dist/<slug>/index.html — no kind/ subdirectory.
    const dir = resolve(dist, r.slug)
    await mkdir(dir, { recursive: true })
    await writeFile(resolve(dir, 'index.html'), html, 'utf8')
    console.log(`  /${r.slug}/`)
  }
  console.log(
    `[done] ${WORK_ROUTES.length + WRITING_ROUTES.length + STANDALONE_ROUTES.length} stubs written.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
