#!/usr/bin/env node
// Build-time generator for the /whoami route.
//
// Reads canonical profile data from src/data/whoami.js and writes three
// projections into public/:
//   - public/whoami/index.html  (HTML with embedded <pre> + inline typewriter script)
//   - public/whoami.json        (structured JSON, ASCII header omitted)
//   - public/whoami.txt         (pure plain text, ASCII header omitted)
//
// Vite copies public/ verbatim into dist/, so on deploy GitHub Pages serves:
//   - drewmalhotra.com/whoami       -> dist/whoami/index.html
//   - drewmalhotra.com/whoami.json  -> dist/whoami.json
//   - drewmalhotra.com/whoami.txt   -> dist/whoami.txt

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { whoami as source } from '../src/data/whoami.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

// --- ASCII monogram (HTML only; .txt and .json strip it) ---
const ASCII_HEADER = [
  '    ____      ',
  '   |  _ \\    ',
  '   | | | |   ',
  '   | |_| |   ',
  '   |____/    ',
  '             '
].join('\n')

// --- helpers ---

// Wrap a comma-separated list at ~width characters, two-space indent on wraps.
function wrapList(items, width = 68, indent = '  ') {
  const lines = []
  let current = indent
  items.forEach((item, i) => {
    const sep = i < items.length - 1 ? ', ' : ''
    const piece = item + sep
    if (current.length + piece.length > width && current.trim().length > 0) {
      lines.push(current.trimEnd())
      current = indent + piece
    } else {
      current += piece
    }
  })
  if (current.trim().length > 0) lines.push(current.trimEnd())
  return lines.join('\n')
}

// Build the plain-text profile body (shared by HTML <pre> and .txt projection).
// `includeHeader` toggles the ASCII monogram (HTML yes, .txt no).
function buildProfileText(data, { includeHeader }) {
  const out = []
  if (includeHeader) {
    out.push(ASCII_HEADER)
  }

  out.push('# whoami')
  out.push('')
  out.push(`  name      ${data.name}`)
  out.push(`  role      ${data.role}`)
  out.push(`  employer  ${data.employer}`)
  out.push(`  location  ${data.location}`)
  out.push('')

  out.push('# active focus')
  out.push('')
  out.push('  ' + data.focus)
  out.push('')

  out.push('# stack')
  out.push('')
  out.push(wrapList(data.stack))
  out.push('')

  out.push('# selected work')
  out.push('')
  data.projects.forEach((p) => {
    out.push(`  ${p.title} — ${p.oneliner}`)
    out.push(`    ${p.url}`)
    out.push('')
  })

  out.push('# links')
  out.push('')
  out.push(`  github    ${data.links.github}`)
  out.push(`  linkedin  ${data.links.linkedin}`)
  out.push(`  email     ${data.links.email}`)
  out.push(`  resume    https://drewmalhotra.com${data.links.resume}`)
  out.push('')

  out.push('# footer')
  out.push('')
  out.push('  https://drewmalhotra.com')
  out.push('  generated from src/data/whoami.js + résumé.')
  out.push(`  generated_at: ${data.generated_at}`)
  out.push('  tip: in a browser, press `?` to see keyboard shortcuts.')
  out.push('')

  return out.join('\n')
}

// HTML projection: same text as the .txt body, but the ASCII header is wrapped
// in <span aria-hidden="true"> so screen readers skip the monogram.
function buildHtmlPreBody(data) {
  const headerSpan = `<span aria-hidden="true">${escapeHtml(ASCII_HEADER)}</span>\n`
  const bodyText = buildProfileText(data, { includeHeader: false })
  return headerSpan + escapeHtml(bodyText)
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// --- HTML template + inline animation script (kept as separate constants) ---

// Inline style kept on a single line so the <pre> opens within the first ~10
// lines of the document. Keeps `curl /whoami | head` readable.
const HTML_HEAD = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>drew malhotra · /whoami</title><style>body{margin:0;background:#0a0a0a;color:#d4d4d4;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:14px;line-height:1.55;padding:24px}pre{white-space:pre-wrap;margin:0}a{color:#7dd3fc;text-decoration:none}a:hover{text-decoration:underline}.cursor{display:inline-block;width:0.6em;background:#d4d4d4;animation:blink 1s steps(2) infinite;vertical-align:-2px}@keyframes blink{50%{background:transparent}}@media (prefers-reduced-motion:reduce){.cursor{animation:none}}footer{margin-top:24px;opacity:0.6;font-size:12px}kbd{font-family:inherit;background:#1a1a1a;padding:1px 6px;border-radius:3px;border:1px solid #2a2a2a}</style></head>`

// Inline script: <80 lines, no external deps. Honors prefers-reduced-motion.
// Reads the existing <pre> text content, wipes it, then types it back in.
const INLINE_SCRIPT = `<script>
(function(){
  var pre = document.getElementById('whoami');
  if (!pre) return;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduced = false; }
  if (reduced) return; // pre already contains the full profile
  // Use textContent so HTML entities (e.g. ascii art's pipes) render literally.
  var fullText = pre.textContent;
  pre.textContent = '';
  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = ' ';
  pre.appendChild(cursor);
  var i = 0;
  var len = fullText.length;
  // Skip the heavy character-by-character animation past a threshold so the
  // user isn't waiting 30 seconds. Type the first ~600 chars, then dump rest.
  var typeLimit = 600;
  var tick = function(){
    if (i >= len) {
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      return;
    }
    var step = i < typeLimit ? 1 : Math.max(4, Math.floor((len - typeLimit) / 80));
    var next = Math.min(i + step, len);
    var chunk = fullText.slice(i, next);
    cursor.insertAdjacentText('beforebegin', chunk);
    i = next;
    var delay = i < typeLimit ? 22 : 12;
    setTimeout(tick, delay);
  };
  setTimeout(tick, 80);
})();
</script>`

function buildHtml(data) {
  const preBody = buildHtmlPreBody(data)
  return `${HTML_HEAD}
<body>
<pre id="whoami" aria-label="drew malhotra profile">${preBody}</pre>
${INLINE_SCRIPT}
<footer>
<a href="/">← back to site</a> · <a href="/#/writing">writing</a> · press <kbd>?</kbd> for keyboard shortcuts
</footer>
</body>
</html>
`
}

// --- main ---

async function main() {
  // 1. Stamp generated_at (date only — keeps day-to-day diffs minimal).
  source.generated_at = new Date().toISOString().slice(0, 10)

  // 2. Build text projections.
  const htmlPath = resolve(repoRoot, 'public/whoami/index.html')
  const jsonPath = resolve(repoRoot, 'public/whoami.json')
  const txtPath = resolve(repoRoot, 'public/whoami.txt')

  await mkdir(dirname(htmlPath), { recursive: true })

  const htmlOut = buildHtml(source)
  const jsonOut = JSON.stringify(source, null, 2) + '\n'
  const txtOut = buildProfileText(source, { includeHeader: false })

  await writeFile(htmlPath, htmlOut, 'utf8')
  await writeFile(jsonPath, jsonOut, 'utf8')
  await writeFile(txtPath, txtOut, 'utf8')

  // 3. Log byte counts.
  console.log(
    `[build-whoami] wrote ` +
      `public/whoami/index.html (${Buffer.byteLength(htmlOut, 'utf8')} bytes), ` +
      `public/whoami.json (${Buffer.byteLength(jsonOut, 'utf8')} bytes), ` +
      `public/whoami.txt (${Buffer.byteLength(txtOut, 'utf8')} bytes)`
  )
}

main().catch((err) => {
  console.error('[build-whoami] FAILED:', err && err.stack ? err.stack : err)
  process.exit(1)
})
