import React from 'react'

// Lightweight markdown renderer for longform posts. Not a full parser —
// handles: # / ## / ### headings, paragraphs, fenced code blocks (```),
// blockquotes (>), unordered lists (-, *), inline bold (**), italics (_),
// inline code (`), and links ([text](url)).

const renderInline = (s, keyPrefix = '') => {
  const tokens = []
  let i = 0
  let buffer = ''

  const flush = () => {
    if (buffer) {
      tokens.push(buffer)
      buffer = ''
    }
  }

  while (i < s.length) {
    // Bold **text**
    if (s.slice(i, i + 2) === '**') {
      const end = s.indexOf('**', i + 2)
      if (end !== -1) {
        flush()
        tokens.push(
          <strong key={`${keyPrefix}-b-${i}`}>{s.slice(i + 2, end)}</strong>
        )
        i = end + 2
        continue
      }
    }
    // Inline code `code`
    if (s[i] === '`') {
      const end = s.indexOf('`', i + 1)
      if (end !== -1) {
        flush()
        tokens.push(
          <code key={`${keyPrefix}-c-${i}`}>{s.slice(i + 1, end)}</code>
        )
        i = end + 1
        continue
      }
    }
    // Italic _text_ (only when at word boundary to avoid matching snake_case)
    if (s[i] === '_' && (i === 0 || /\s/.test(s[i - 1]))) {
      const end = s.indexOf('_', i + 1)
      if (end !== -1 && /\s|$|[.,!?;:]/.test(s[end + 1] || ' ')) {
        flush()
        tokens.push(
          <em key={`${keyPrefix}-i-${i}`}>{s.slice(i + 1, end)}</em>
        )
        i = end + 1
        continue
      }
    }
    // Link [text](url)
    if (s[i] === '[') {
      const closeBracket = s.indexOf(']', i + 1)
      if (closeBracket !== -1 && s[closeBracket + 1] === '(') {
        const closeParen = s.indexOf(')', closeBracket + 2)
        if (closeParen !== -1) {
          const text = s.slice(i + 1, closeBracket)
          const href = s.slice(closeBracket + 2, closeParen)
          flush()
          tokens.push(
            <a
              key={`${keyPrefix}-l-${i}`}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              {text}
            </a>
          )
          i = closeParen + 1
          continue
        }
      }
    }
    buffer += s[i]
    i++
  }
  flush()
  return tokens
}

export const Markdown = ({ source }) => {
  if (!source) return null
  const lines = source.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Fenced code block
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing fence

      // Build-time highlighted block: the vite-plugin-shiki has already
      // run Shiki on the body and rewritten the language tag as
      // `shiki-<lang>`. The codeLines join is raw HTML; render as-is.
      if (lang.startsWith('shiki-')) {
        const realLang = lang.slice(6)
        blocks.push(
          <div
            key={blocks.length}
            className="md-code md-code-shiki"
            data-lang={realLang}
            tabIndex={0}
            aria-label={`code block (${realLang})`}
            dangerouslySetInnerHTML={{ __html: codeLines.join('\n') }}
          />
        )
        continue
      }

      // Unhighlighted fallback (e.g. no language tag, or build ran without shiki).
      blocks.push(
        <pre
          key={blocks.length}
          className="md-code"
          data-lang={lang || 'text'}
          tabIndex={0}
          aria-label={`code block (${lang || 'text'})`}
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Heading
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h3 key={blocks.length}>{renderInline(trimmed.slice(4), `h3-${i}`)}</h3>
      )
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h2 key={blocks.length}>{renderInline(trimmed.slice(3), `h2-${i}`)}</h2>
      )
      i++
      continue
    }
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h1 key={blocks.length}>{renderInline(trimmed.slice(2), `h1-${i}`)}</h1>
      )
      i++
      continue
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      blocks.push(<hr key={blocks.length} />)
      i++
      continue
    }

    // Blockquote (one or more contiguous > lines)
    if (trimmed.startsWith('> ')) {
      const quoted = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoted.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push(
        <blockquote key={blocks.length}>
          {renderInline(quoted.join(' '), `q-${i}`)}
        </blockquote>
      )
      continue
    }

    // Unordered list (one or more contiguous - / * lines)
    if (/^[-*]\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={blocks.length}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li-${i}-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Empty line — skip
    if (trimmed === '') {
      i++
      continue
    }

    // Paragraph (one or more contiguous non-empty, non-special lines)
    const paragraphLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('> ') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      lines[i].trim() !== '---'
    ) {
      paragraphLines.push(lines[i])
      i++
    }
    blocks.push(
      <p key={blocks.length}>{renderInline(paragraphLines.join(' '), `p-${i}`)}</p>
    )
  }

  return <>{blocks}</>
}

// Estimate reading time at 200 words per minute. Strips fences / headings.
export const readingTimeMinutes = (source) => {
  if (!source) return 1
  const text = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>`*_\-[\]()]/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
