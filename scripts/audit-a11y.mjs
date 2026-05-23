// One-off audit script. Run with: `node scripts/audit-a11y.mjs <url>...`
// Defaults to the live production URLs. Prints a compact violation report.

import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const urls = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'https://drewmalhotra.com/',
      'https://drewmalhotra.com/#/writing',
      'https://drewmalhotra.com/#/writing/patch-vulnerability',
      'https://drewmalhotra.com/#/work/smart-home'
    ]

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 }
})

let totalViolations = 0

for (const url of urls) {
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000) // let any reveal animations settle

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()

  const violations = results.violations
  totalViolations += violations.length

  console.log(`\n==== ${url}`)
  console.log(`violations: ${violations.length}`)
  for (const v of violations) {
    console.log(`  [${v.impact || '?'}] ${v.id}  (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`)
    console.log(`    ${v.help}`)
    for (const n of v.nodes.slice(0, 2)) {
      const target = Array.isArray(n.target) ? n.target.join(' ') : String(n.target)
      console.log(`    target: ${target}`)
      if (n.failureSummary) {
        const summary = n.failureSummary.split('\n').slice(0, 2).join(' | ')
        console.log(`    why:    ${summary}`)
      }
    }
  }
  await page.close()
}

console.log(`\n==== TOTAL VIOLATIONS: ${totalViolations}`)
await browser.close()
