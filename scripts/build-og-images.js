#!/usr/bin/env node
// Build-time OG image generator.
//
// For each registered work/writing route + the home default, render a
// 1200x630 PNG via Satori (JSX → SVG) + @resvg/resvg-js (SVG → PNG).
// Operator-terminal aesthetic: black background, monospace category badge,
// Geist Sans bold title, JetBrains Mono URL + accent line. No logos, no
// stock photos — typography on a dark grid, same vibe as the site.
//
// Output:
//   dist/og/work/<slug>.png
//   dist/og/writing/<slug>.png
//   dist/og/default.png            (fallback referenced by index.html)
//
// Run via npm script: `vite build` → this script → `prerender.js`.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const dist = resolve(repoRoot, 'dist')
const ogDir = resolve(dist, 'og')
const fontsDir = resolve(__dirname, 'fonts')

const SIZE = { width: 1200, height: 630 }

// Color palette — operator-terminal, matches the site.
const COLOR = {
  bg: '#0a0a0c',
  fg: '#e8e8e8',
  fgDim: '#9aa0a6',
  accent: '#7cf26b',
  border: '#2a2a30',
}

// Same metadata as prerender.js. Future: extract to a shared metadata.json.
const WORK_ROUTES = [
  { slug: 'video-analytics',     category: 'CV · BENCHMARK',  title: 'Video Analytics — YOLOv8 Honest Benchmark', tag: 'person F1 = 0.688 · 210 imgs · make bench' },
  { slug: 'traffic-optimization', category: 'AI/ML · INFRA',  title: 'Traffic Flow Optimization', tag: '664 OSM intersections · +18.2% throughput' },
  { slug: 'donation-platform',    category: 'MOBILE · ML',    title: 'Donation Platform Recommender', tag: 'NDCG@10 5.7× random · 99% catalog coverage' },
  { slug: 'financial-analysis',   category: 'DATA · ML',      title: 'Financial Analysis Engine', tag: '49.5% real next-day accuracy · 1,990 predictions' },
  { slug: 'smart-home',           category: 'IOT · EDGE',     title: 'Smart Home Automation', tag: 'paho-mqtt · Mosquitto · sim-mode fallback' },
  { slug: 'this-portfolio',       category: 'WEB · DESIGN',   title: 'This Portfolio', tag: 'React · Vite · Framer · LLM-augmented' },
]

const WRITING_ROUTES = [
  { slug: 'patch-vulnerability',  category: 'SECURITY · CASE STUDY', title: 'The PATCH that nullified prod',                  tag: 'API input validation · adversarial testing' },
  { slug: 'honesty-playbook',     category: 'PROCESS · CRAFT',       title: 'The honesty playbook',                            tag: '5 fabricated claims · scrubbed in one week' },
  { slug: 'real-video-analytics', category: 'ML · ROADMAP',          title: 'What a real video-analytics platform would need', tag: 'tracking · streaming · asymmetric errors' },
]

const DEFAULT_OG = {
  category: 'PORTFOLIO',
  title: 'Dhruv (Drew) Malhotra',
  tag: 'Software Engineer · SDET · Austin, TX',
  cta: '// drewmalhotra.com',
}

async function loadFonts() {
  return {
    monoRegular:  await readFile(resolve(fontsDir, 'JetBrainsMono-Regular.ttf')),
    monoBold:     await readFile(resolve(fontsDir, 'JetBrainsMono-Bold.ttf')),
  }
}

/** Build the Satori virtual-DOM tree for one OG image. */
function template({ category, title, tag, footer = 'drewmalhotra.com', cta = '// READ THE DEEP-DIVE' }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        background: COLOR.bg,
        color: COLOR.fg,
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 72px',
        fontFamily: 'JetBrains Mono',
        position: 'relative',
      },
      children: [
        // Top bar: brand-mark dot + URL on the left, category badge on the right.
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              color: COLOR.fgDim,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: 12 },
                  children: [
                    { type: 'span', props: { style: { color: COLOR.accent, fontWeight: 700 }, children: '//' } },
                    { type: 'span', props: { children: footer } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    color: COLOR.accent,
                    border: `1px solid ${COLOR.accent}`,
                    padding: '6px 14px',
                    borderRadius: 4,
                    fontSize: 18,
                    letterSpacing: 1.5,
                  },
                  children: category,
                },
              },
            ],
          },
        },

        // Spacer + title block.
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              gap: 28,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 58,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: -1,
                    color: COLOR.fg,
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'JetBrains Mono',
                    fontSize: 24,
                    color: COLOR.fgDim,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  },
                  children: [
                    { type: 'span', props: { style: { color: COLOR.accent }, children: '▸' } },
                    { type: 'span', props: { children: tag } },
                  ],
                },
              },
            ],
          },
        },

        // Bottom accent line + footer hint.
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 16 },
            children: [
              {
                type: 'div',
                props: {
                  style: { height: 1, background: COLOR.border, width: '100%' },
                  children: '',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'JetBrains Mono',
                    fontSize: 18,
                    color: COLOR.fgDim,
                    letterSpacing: 1,
                  },
                  children: [
                    { type: 'span', props: { children: cta } },
                    { type: 'span', props: { children: '// 2026' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

async function render(meta, fonts) {
  const svg = await satori(template(meta), {
    width: SIZE.width,
    height: SIZE.height,
    fonts: [
      { name: 'JetBrains Mono', data: fonts.monoRegular,  weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: fonts.monoBold,     weight: 700, style: 'normal' },
    ],
  })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: SIZE.width } })
  return resvg.render().asPng()
}

async function emit(meta, outPath, fonts) {
  await mkdir(dirname(outPath), { recursive: true })
  const png = await render(meta, fonts)
  await writeFile(outPath, png)
  console.log(`  ${outPath.replace(repoRoot + '/', '')} (${(png.length / 1024).toFixed(0)} KB)`)
}

async function main() {
  if (!existsSync(dist)) {
    console.error(`[error] ${dist} not found. Run \`vite build\` first.`)
    process.exit(1)
  }

  const fonts = await loadFonts()

  console.log('[og] rendering 1200×630 PNGs:')

  await emit(DEFAULT_OG, resolve(ogDir, 'default.png'), fonts)
  for (const r of WORK_ROUTES) {
    await emit(r, resolve(ogDir, 'work', `${r.slug}.png`), fonts)
  }
  for (const r of WRITING_ROUTES) {
    await emit(r, resolve(ogDir, 'writing', `${r.slug}.png`), fonts)
  }

  console.log(
    `[done] ${1 + WORK_ROUTES.length + WRITING_ROUTES.length} OG images written.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
