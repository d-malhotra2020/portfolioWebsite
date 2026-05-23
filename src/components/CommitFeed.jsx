import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GitCommit } from 'lucide-react'

const USER = 'd-malhotra2020'
const MAX_EVENTS = 6
const FALLBACK_REPOS = [
  'portfolioWebsite',
  'video-analytics',
  'traffic-optimization',
  'donation-platform',
  'financial-analysis-tool',
  'smart-home-automation'
]

const timeAgo = (iso) => {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}

const fetchEvents = async () => {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    if (!res.ok) return []
    const data = await res.json()
    const commits = []
    for (const ev of data) {
      if (ev.type !== 'PushEvent') continue
      const repo = ev.repo?.name?.split('/')?.[1] || ev.repo?.name
      for (const c of ev.payload?.commits || []) {
        commits.push({
          sha: c.sha?.slice(0, 7),
          message: c.message.split('\n')[0].slice(0, 100),
          repo,
          when: ev.created_at,
          url: `https://github.com/${ev.repo.name}/commit/${c.sha}`
        })
        if (commits.length >= MAX_EVENTS) return commits
      }
    }
    return commits
  } catch {
    return []
  }
}

const fetchPerRepoLatest = async () => {
  // Fan out across the canonical repos in parallel; take the most recent commit from each.
  const results = await Promise.all(
    FALLBACK_REPOS.map(async (repo) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${USER}/${repo}/commits?per_page=1`,
          { headers: { Accept: 'application/vnd.github+json' } }
        )
        if (!res.ok) return null
        const data = await res.json()
        const c = data[0]
        if (!c) return null
        return {
          sha: c.sha?.slice(0, 7),
          message: (c.commit?.message || '').split('\n')[0].slice(0, 100),
          repo,
          when: c.commit?.author?.date || c.commit?.committer?.date,
          url: c.html_url
        }
      } catch {
        return null
      }
    })
  )
  return results
    .filter(Boolean)
    .sort((a, b) => new Date(b.when) - new Date(a.when))
    .slice(0, MAX_EVENTS)
}

const fetchAll = async () => {
  const events = await fetchEvents()
  if (events.length > 0) return events
  return fetchPerRepoLatest()
}

const CommitFeed = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [commits, setCommits] = useState(null)

  useEffect(() => {
    if (!inView) return
    let alive = true
    fetchAll().then((c) => {
      if (alive) setCommits(c)
    })
    return () => {
      alive = false
    }
  }, [inView])

  return (
    <motion.div
      ref={ref}
      className="commit-feed"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 1] }}
    >
      <div className="commit-head">
        <span className="commit-head-l">
          <GitCommit size={13} />
          <span>recent commits · github.com/{USER}</span>
        </span>
        <a
          className="commit-head-r"
          href={`https://github.com/${USER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          view all ↗
        </a>
      </div>

      {commits === null && (
        <div className="commit-empty">
          <span className="commit-loader" /> polling github events…
        </div>
      )}
      {commits !== null && commits.length === 0 && (
        <div className="commit-empty">
          no recent public push events found · github rate-limit may apply
        </div>
      )}
      {commits !== null && commits.length > 0 && (
        <ul className="commit-list">
          {commits.map((c, i) => (
            <li key={i} className="commit-row">
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="commit-row-link">
                <span className="commit-sha">{c.sha}</span>
                <span className="commit-msg" title={c.message}>{c.message}</span>
                <span className="commit-repo">{c.repo}</span>
                <span className="commit-when">{timeAgo(c.when)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

export default CommitFeed
