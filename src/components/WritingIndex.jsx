import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { posts } from '../writing/registry'
import { navigateTo } from '../lib/router'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const WritingIndex = () => {
  return (
    <main className="writing-shell">
      <div className="shell">
        <button className="back-link" onClick={() => navigateTo('/')}>
          ← back to drewmalhotra.com
        </button>

        <header className="writing-head">
          <span className="tag"><span className="dot" /> // writing.index()</span>
          <h1 className="writing-h1">Writing</h1>
          <p className="writing-sub">
            Case studies on the engineering work I find most interesting — reliability,
            adversarial testing, and the failure modes that surface only when you go
            looking for them.
          </p>
        </header>

        <ul className="writing-list">
          {posts.map((p) => (
            <motion.li
              key={p.slug}
              className="writing-row"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.65, 0.3, 1] }}
            >
              <button className="writing-row-link" onClick={() => navigateTo(`/writing/${p.slug}`)}>
                <div className="writing-row-meta">
                  <span>{formatDate(p.date)}</span>
                  <span>·</span>
                  <span>{p.readingTime} min read</span>
                  {p.tags?.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{p.tags.join(' · ')}</span>
                    </>
                  )}
                </div>
                <div className="writing-row-title">{p.title}</div>
                <div className="writing-row-dek">{p.dek}</div>
                <div className="writing-row-cta">
                  read <ArrowUpRight size={14} />
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default WritingIndex
