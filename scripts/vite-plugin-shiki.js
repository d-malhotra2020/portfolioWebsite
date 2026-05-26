// Vite plugin: pre-highlights code blocks in .md files at build time.
//
// Triggered by importing a markdown file with the `?shiki` query suffix:
//   import body from './donation-platform.md?shiki'
//
// The plugin reads the .md, walks each ``` fenced block, runs Shiki on its
// contents, and rewrites the block in-place so the language tag becomes
// `shiki-<lang>` and the body is pre-tokenized HTML.
//
// The runtime markdown renderer (src/lib/markdown.jsx) detects `shiki-` and
// emits the highlighted HTML via dangerouslySetInnerHTML — no Shiki at all
// in the browser bundle.

import { readFile } from 'node:fs/promises'
import { dirname, resolve as resolvePath } from 'node:path'
import { createHighlighter } from 'shiki'

// Lazy-init one highlighter for the whole build. Loading grammars is
// the expensive part; reusing the instance across files keeps build fast.
let _highlighter = null
async function getHighlighter() {
  if (_highlighter) return _highlighter
  _highlighter = await createHighlighter({
    // Theme — picked for the operator-terminal aesthetic. `vesper` is dark
    // with muted palette; `min-dark` is also a candidate. Switch in one
    // place if the theme should change.
    themes: ['vesper'],
    langs: [
      'python',
      'javascript',
      'typescript',
      'jsx',
      'tsx',
      'json',
      'bash',
      'shell',
      'yaml',
      'sql',
      'html',
      'css',
      'markdown',
      'docker',
      'dockerfile',
      'plaintext',
      'text',
    ],
  })
  return _highlighter
}

const FENCE_RE = /^([ \t]*)```([\w-]*)\s*\n([\s\S]*?)\n[ \t]*```/gm

/** Rewrite ``` blocks in markdown source so the body is already-highlighted HTML. */
async function preprocess(md) {
  const highlighter = await getHighlighter()
  const supportedLangs = new Set(highlighter.getLoadedLanguages())

  // Async-replace each fenced block. String.replace doesn't accept async
  // functions, so we do two passes: collect matches, then splice.
  const matches = []
  let m
  // Reset regex state explicitly.
  FENCE_RE.lastIndex = 0
  while ((m = FENCE_RE.exec(md)) !== null) {
    matches.push({
      start: m.index,
      end: m.index + m[0].length,
      indent: m[1],
      lang: m[2] || 'text',
      body: m[3],
    })
  }

  if (matches.length === 0) return md

  let out = ''
  let cursor = 0
  for (const match of matches) {
    out += md.slice(cursor, match.start)

    // Map common aliases / fallbacks.
    const langAlias = { text: 'plaintext', sh: 'bash', shell: 'bash', dockerfile: 'docker' }
    const langInput = langAlias[match.lang] || match.lang
    const lang = supportedLangs.has(langInput) ? langInput : 'plaintext'

    let html
    try {
      html = highlighter.codeToHtml(match.body, {
        lang,
        theme: 'vesper',
      })
    } catch (e) {
      // Highlighting failed — fall back to plaintext so the build doesn't blow up.
      console.warn(`[shiki] failed to highlight \`${match.lang}\` block: ${e.message}`)
      html = highlighter.codeToHtml(match.body, { lang: 'plaintext', theme: 'vesper' })
    }

    // Re-emit as a ``` fence so the existing markdown renderer picks it up,
    // but with the `shiki-` prefix that signals the body is HTML.
    out += `${match.indent}\`\`\`shiki-${lang}\n${html}\n${match.indent}\`\`\``
    cursor = match.end
  }
  out += md.slice(cursor)

  return out
}

export default function vitePluginShiki() {
  return {
    name: 'vite-plugin-shiki',
    enforce: 'pre',
    async resolveId(id, importer) {
      if (!id.endsWith('.md?shiki')) return null
      // Resolve relative imports against the importer directory so we get an
      // absolute file path. Vite hands us the importer for any non-absolute id.
      const stripped = id.slice(0, -'?shiki'.length)
      const absolute = importer && !stripped.startsWith('/') && !stripped.match(/^[A-Z]:/)
        ? resolvePath(dirname(importer), stripped)
        : stripped
      // Return an id we recognize in load() and that Vite treats as unique.
      return absolute + '?shiki'
    },
    async load(id) {
      if (!id.endsWith('.md?shiki')) return null
      const filePath = id.slice(0, -'?shiki'.length)
      const raw = await readFile(filePath, 'utf8')
      const processed = await preprocess(raw)
      // Mirror the shape of Vite's built-in `?raw`: default-export a string.
      return `export default ${JSON.stringify(processed)};`
    },
  }
}
