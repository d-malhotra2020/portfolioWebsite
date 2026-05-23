import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { findPost } from '../writing/registry'
import { Markdown, readingTimeMinutes } from '../lib/markdown'
import { navigateTo } from '../lib/router'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const WritingPost = ({ slug }) => {
  const post = findPost(slug)

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Drew Malhotra`
      const meta = document.querySelector('meta[name="description"]')
      if (meta && post.dek) meta.setAttribute('content', post.dek)
    }
    return () => {
      document.title = 'Dhruv Malhotra — Software Engineer · SDET · Austin, TX'
    }
  }, [post])

  if (!post) {
    return (
      <main className="writing-shell">
        <div className="shell">
          <button className="back-link" onClick={() => navigateTo('/writing')}>
            ← back to writing
          </button>
          <header className="writing-head">
            <h1 className="writing-h1">Not found</h1>
            <p className="writing-sub">That post doesn't exist (yet).</p>
          </header>
        </div>
      </main>
    )
  }

  const readMins = post.readingTime || readingTimeMinutes(post.body)

  return (
    <main className="writing-shell">
      <div className="shell">
        <button className="back-link" onClick={() => navigateTo('/writing')}>
          ← back to writing
        </button>

        <motion.article
          className="writing-article"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
        >
          <header className="writing-post-head">
            <div className="writing-post-meta">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{readMins} min read</span>
              {post.tags?.length > 0 && (
                <>
                  <span>·</span>
                  <span>{post.tags.join(' · ')}</span>
                </>
              )}
            </div>
            <h1 className="writing-post-title">{post.title}</h1>
            {post.dek && <p className="writing-post-dek">{post.dek}</p>}
          </header>

          <div className="writing-post-body">
            <Markdown source={post.body} />
          </div>

          <footer className="writing-post-foot">
            <button className="back-link" onClick={() => navigateTo('/writing')}>
              ← more writing
            </button>
            <span className="writing-byline">
              Drew Malhotra ·{' '}
              <a href="mailto:dhruvmalhotra2026@gmail.com">dhruvmalhotra2026@gmail.com</a>
            </span>
          </footer>
        </motion.article>
      </div>
    </main>
  )
}

export default WritingPost
