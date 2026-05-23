import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, ArrowUpRight } from 'lucide-react'
import { findWork } from '../work/registry'
import { Markdown, readingTimeMinutes } from '../lib/markdown'
import { navigateTo } from '../lib/router'

const WorkPost = ({ slug }) => {
  const work = findWork(slug)

  useEffect(() => {
    if (work) {
      document.title = `${work.title} — Drew Malhotra`
    }
    return () => {
      document.title = 'Dhruv Malhotra — Software Engineer · SDET · Austin, TX'
    }
  }, [work])

  if (!work) {
    return (
      <main className="writing-shell">
        <div className="shell">
          <button className="back-link" onClick={() => navigateTo('/')}>
            ← back to home
          </button>
          <header className="writing-head">
            <h1 className="writing-h1">Not found</h1>
            <p className="writing-sub">That project doesn't have a deep-dive (yet).</p>
          </header>
        </div>
      </main>
    )
  }

  const readMins = readingTimeMinutes(work.body)

  return (
    <main className="writing-shell">
      <div className="shell">
        <button className="back-link" onClick={() => navigateTo('/')}>
          ← back to selected work
        </button>

        <motion.article
          className="writing-article"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
        >
          <header className="writing-post-head">
            <div className="writing-post-meta">
              <span>{work.year}</span>
              <span>·</span>
              <span>{work.category}</span>
              <span>·</span>
              <span>{readMins} min read</span>
            </div>
            <h1 className="writing-post-title">{work.title}</h1>
          </header>

          <div className="writing-post-body">
            <Markdown source={work.body} />
          </div>

          <div className="work-post-stack">
            {work.stack.map((s, i) => (
              <span key={i} className="pill">{s}</span>
            ))}
          </div>

          <footer className="writing-post-foot">
            <div className="work-post-links">
              {work.github && (
                <a href={work.github} target="_blank" rel="noopener noreferrer">
                  <Github size={14} /> source
                </a>
              )}
              {work.live && (
                <a href={work.live} target="_blank" rel="noopener noreferrer" className="live">
                  live <ArrowUpRight size={14} />
                </a>
              )}
            </div>
            <button className="back-link" onClick={() => navigateTo('/')}>
              ← more work
            </button>
          </footer>
        </motion.article>
      </div>
    </main>
  )
}

export default WorkPost
