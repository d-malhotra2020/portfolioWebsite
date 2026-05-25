import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CommitFeed from './CommitFeed'

const services = [
  { id: 'brivo', name: 'Brivo · SDET layer', kind: 'employment', url: null, note: '24 envs · 99.9% delivery' },
  { id: 'portfolio', name: 'drewmalhotra.com', kind: 'self', url: 'https://drewmalhotra.com', note: 'this site' },
  { id: 'video', name: 'video-analytics', kind: 'self', url: 'https://video-analytics-production.up.railway.app', note: 'cloud · ai' },
  { id: 'traffic', name: 'traffic-optimization', kind: 'self', url: 'https://traffic-optimization-production.up.railway.app', note: 'osm topology · microsim' },
  { id: 'finance', name: 'financial-analysis-tool', kind: 'self', url: 'https://financial-analysis-tool-production.up.railway.app', note: 'data · ml' },
  { id: 'home', name: 'smart-home-automation', kind: 'self', url: 'https://smart-home-automation-production.up.railway.app', note: 'iot · edge' }
]

const STATUS = {
  CHECKING: 'checking',
  OK: 'ok',
  DOWN: 'down',
  PROXY: 'proxy'   // browser-blocked CORS but reachable (employment claims w/ no live signal)
}

const ping = async (url, timeoutMs = 6000) => {
  if (!url) return STATUS.PROXY
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    await fetch(url, { mode: 'no-cors', signal: controller.signal, cache: 'no-store' })
    clearTimeout(timer)
    return STATUS.OK
  } catch {
    clearTimeout(timer)
    return STATUS.DOWN
  }
}

const formatHHMM = (d) => {
  const opts = { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false }
  return new Intl.DateTimeFormat('en-US', opts).format(d)
}

const StatusBoard = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statuses, setStatuses] = useState(
    Object.fromEntries(services.map((s) => [s.id, s.kind === 'employment' ? STATUS.PROXY : STATUS.CHECKING]))
  )
  const [lastChecked, setLastChecked] = useState(null)

  const checkAll = async () => {
    const results = await Promise.all(
      services.map(async (s) => [s.id, s.kind === 'employment' ? STATUS.PROXY : await ping(s.url)])
    )
    setStatuses(Object.fromEntries(results))
    setLastChecked(new Date())
  }

  useEffect(() => {
    if (!inView) return
    checkAll()
    const t = setInterval(checkAll, 120_000)
    return () => clearInterval(t)
  }, [inView])

  const totalLive = services.filter((s) => s.kind === 'self').length
  const okCount = services.filter((s) => s.kind === 'self' && statuses[s.id] === STATUS.OK).length
  const stillChecking = services.some((s) => s.kind === 'self' && statuses[s.id] === STATUS.CHECKING)

  return (
    <section className="section status-section" ref={ref} id="status">
      <div className="shell">
        <div className="section-marker">
          <span className="tag">
            <span className="dot" /> // live · system_health.poll()
          </span>
          <h2>
            Every project I&apos;ve shipped, <span className="em">pinged in real time.</span>
          </h2>
        </div>

        <motion.div
          className="status-board"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 1] }}
        >
          <div className="status-head">
            <div className="status-head-l">
              <span className="status-head-title">production board</span>
              <span className="status-head-sub">
                {stillChecking ? 'polling…' : `${okCount}/${totalLive} live deployments healthy`}
              </span>
            </div>
            <div className="status-head-r">
              <button className="status-refresh" onClick={checkAll} aria-label="re-poll">
                <span className={`pip ${stillChecking ? 'spin' : ''}`} />
                re-poll
              </button>
              {lastChecked && (
                <span className="status-time">last check · {formatHHMM(lastChecked)} CT</span>
              )}
            </div>
          </div>

          <div className="status-rows">
            {services.map((s) => {
              const st = statuses[s.id]
              return (
                <div key={s.id} className={`status-row st-${st}`}>
                  <span className={`status-pip st-${st}`} />
                  <span className="status-name">{s.name}</span>
                  <span className="status-note">{s.note}</span>
                  <span className="status-url">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.url.replace(/^https?:\/\//, '')} ↗
                      </a>
                    ) : (
                      <span className="status-employment">proprietary · brivo internal</span>
                    )}
                  </span>
                  <span className="status-state">
                    {st === STATUS.CHECKING && 'checking…'}
                    {st === STATUS.OK && 'ok'}
                    {st === STATUS.DOWN && 'down'}
                    {st === STATUS.PROXY && '—'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="status-foot">
            <span>
              browser-side checks · CORS-safe ping · auto-refresh every 2m
            </span>
            <span>polled from {typeof window !== 'undefined' ? 'your_browser' : 'static_render'}</span>
          </div>
        </motion.div>

        <CommitFeed />
      </div>
    </section>
  )
}

export default StatusBoard
