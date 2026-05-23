import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowUp } from 'lucide-react'

const ENDPOINT = import.meta.env.VITE_AGENT_ENDPOINT

const SUGGESTIONS = [
  'What are you working on at Brivo right now?',
  'Walk me through that PATCH vulnerability you found.',
  'How do you approach load testing at scale?',
  'Are you open to relocation?'
]

const GREETING =
  "Hey — I'm Drew, or rather, an agent trained on my resume and projects. Ask me anything about my work, my stack, or how to hire me. I'll keep it concrete."

// Lightweight inline renderer: handles **bold**, `code`, and bullet lines.
// Conservative on purpose — full markdown parser is overkill for chat bubbles.
const renderMarkdown = (text) => {
  const lines = text.split('\n')
  const out = []
  let listBuffer = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    out.push(
      <ul key={`ul-${out.length}`} className="bubble-list">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  lines.forEach((raw, i) => {
    const trimmed = raw.trim()
    const bulletMatch = trimmed.match(/^(?:[-*]|\d+\.)\s+(.*)$/)
    if (bulletMatch) {
      listBuffer.push(bulletMatch[1])
      return
    }
    flushList()
    if (trimmed === '') {
      out.push(<br key={`br-${i}`} />)
      return
    }
    out.push(
      <span key={i} className="bubble-line">
        {renderInline(trimmed)}
      </span>
    )
  })
  flushList()
  return out
}

const renderInline = (s) => {
  // Tokenize **bold** and `code` in one pass.
  const parts = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push(s.slice(last, m.index))
    const tok = m[1]
    if (tok.startsWith('**')) {
      parts.push(<strong key={`b-${m.index}`}>{tok.slice(2, -2)}</strong>)
    } else {
      parts.push(<code key={`c-${m.index}`}>{tok.slice(1, -1)}</code>)
    }
    last = re.lastIndex
  }
  if (last < s.length) parts.push(s.slice(last))
  return parts
}

// Parse Anthropic Messages API SSE stream
async function* streamAnthropic(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const ev = JSON.parse(payload)
        if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
          yield ev.delta.text
        }
      } catch {
        // ignore
      }
    }
  }
}

const AgentDock = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETING }
  ])
  const [showSuggest, setShowSuggest] = useState(true)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, busy])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (text) => {
    const userMsg = text.trim()
    if (!userMsg || busy) return
    setShowSuggest(false)
    setInput('')

    const next = [...messages, { role: 'user', content: userMsg }]
    setMessages(next)
    setBusy(true)

    if (!ENDPOINT) {
      // Friendly fallback so the UI is still useful before the worker is deployed
      setMessages([
        ...next,
        {
          role: 'error',
          content:
            "Agent endpoint isn't configured yet. Once Drew deploys the Cloudflare Worker (see workers/agent/README.md) and sets VITE_AGENT_ENDPOINT, this dock will start streaming live answers. In the meantime, you can reach Drew directly at dhruvmalhotra2026@gmail.com."
        }
      ])
      setBusy(false)
      return
    }

    try {
      const apiMessages = next
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      if (!res.ok) {
        let detail = ''
        try {
          const j = await res.json()
          detail = j.error || JSON.stringify(j)
        } catch {
          detail = await res.text()
        }
        setMessages([
          ...next,
          {
            role: 'error',
            content: `Agent error (${res.status}): ${detail.slice(0, 240)}`
          }
        ])
        return
      }

      // Add empty assistant turn we'll stream into
      setMessages([...next, { role: 'assistant', content: '' }])

      let acc = ''
      for await (const chunk of streamAnthropic(res)) {
        acc += chunk
        setMessages((curr) => {
          const copy = curr.slice()
          copy[copy.length - 1] = { role: 'assistant', content: acc }
          return copy
        })
      }
    } catch (err) {
      setMessages((curr) => [
        ...curr,
        {
          role: 'error',
          content: `Couldn't reach the agent: ${err.message}. Try the contact form below, or email dhruvmalhotra2026@gmail.com.`
        }
      ])
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            className="agent-fab"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 1] }}
            aria-label="Open chat with Drew's agent"
          >
            <span className="avatar">D</span>
            <span className="label">
              <span className="label-1">Ask my agent</span>
              <span className="label-2">trained on my resume</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="agent-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 1] }}
          >
            <header className="agent-head">
              <span className="avatar">D</span>
              <span className="meta">
                <span className="t1">drew · agent</span>
                <span className="t2"><span className="pip" /> live · trained on resume + projects</span>
              </span>
              <button className="close" onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={14} />
              </button>
            </header>

            <div className="agent-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={`bubble ${m.role}`}>
                  {m.role === 'assistant' ? renderMarkdown(m.content) : m.content}
                </div>
              ))}

              {busy && (
                <div className="bubble typing" aria-label="thinking">
                  <span /><span /><span />
                </div>
              )}

              {showSuggest && !busy && messages.length === 1 && (
                <div className="suggest-chips">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className="suggest-chip"
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form className="agent-input-bar" onSubmit={onSubmit}>
              <input
                ref={inputRef}
                className="agent-input"
                placeholder="ask anything about my work…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
                maxLength={1000}
              />
              <button
                type="submit"
                className="agent-send"
                disabled={busy || !input.trim()}
                aria-label="Send"
              >
                <ArrowUp size={16} />
              </button>
            </form>

            <div className="agent-disclaimer">
              answers generated by claude · may occasionally err — confirm key details with drew directly
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AgentDock
