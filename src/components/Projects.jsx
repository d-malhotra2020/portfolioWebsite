import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ArrowUpRight } from 'lucide-react'
import { navigateTo } from '../lib/router'

const projects = [
  {
    id: '#001',
    year: '2024',
    category: 'CV · BENCHMARK',
    title: 'Video Analytics — YOLOv8 Honest Benchmark',
    summary: 'Off-the-shelf YOLOv8n measured on a 210-image stratified sample of COCO val2017, then visualized end-to-end on OpenCV\'s pedestrian clip. Person F1 = 0.688 (drops 0.798 → 0.651 from sparse to dense scenes). `make bench` reproducible locally.',
    stats: [
      { lbl: 'Person F1', val: '0.688' },
      { lbl: 'Vehicle F1', val: '0.600' },
      { lbl: 'Sample', val: '210 imgs' },
      { lbl: 'Repro', val: 'make bench' }
    ],
    proof: 'make bench on a stratified COCO val2017 sample — results committed to the repo',
    stack: ['Python', 'YOLOv8', 'aiohttp', 'PyTorch', 'OpenCV'],
    github: 'https://github.com/d-malhotra2020/video-analytics',
    live: 'https://video-analytics-production.up.railway.app',
    deepDive: 'video-analytics'
  },
  {
    id: '#002',
    year: '2024',
    category: 'AI/ML · INFRA',
    title: 'Traffic Flow Optimization',
    summary: 'Operator console + rule-based adaptive signal control over 664 real OSM signalized intersections in downtown SF. Microsim-measured +18% throughput vs fixed-time baseline at peak load.',
    stats: [
      { lbl: 'Intersections', val: '664' },
      { lbl: 'Throughput Δ', val: '+18%' },
      { lbl: 'Source', val: 'OSM · DT SF' },
      { lbl: 'Stack', val: 'FastAPI' }
    ],
    proof: 'seeded microsim, 40 trials × 30 min vs fixed-time baseline — results committed to the repo',
    stack: ['Python', 'FastAPI', 'OpenStreetMap', 'Docker', 'Railway'],
    github: 'https://github.com/d-malhotra2020/traffic-optimization',
    live: 'https://traffic-optimization-production.up.railway.app',
    deepDive: 'traffic-optimization'
  },
  {
    id: '#003',
    year: '2023',
    category: 'MOBILE · ML',
    title: 'Donation Platform Recommender',
    summary: 'Two-tower PyTorch recommender benchmarked against 4 baselines on 3K real US nonprofits (ProPublica) + synthetic giving patterns. 5.7× random / 1.9× popularity on NDCG@10; `make bench` reproducible locally.',
    stats: [
      { lbl: 'Orgs', val: '3K real' },
      { lbl: 'NDCG@10', val: '5.7× rand' },
      { lbl: 'Models', val: '6 compared' },
      { lbl: 'Repro', val: 'make bench' }
    ],
    proof: 'make bench vs 5 baselines — reproducible locally in ~1.5 min',
    stack: ['Python', 'PyTorch', 'FAISS', 'pandas'],
    github: 'https://github.com/d-malhotra2020/donation-platform',
    live: 'https://donation-platform-production-c8e0.up.railway.app',
    deepDive: 'donation-platform'
  },
  {
    id: '#004',
    year: '2024',
    category: 'DATA · ML',
    title: 'Financial Analysis Engine',
    summary: 'Market direction-prediction engine built on one rule: the code that runs live is the same code that runs in backtest — no notebook-only models, no marketing-only accuracy. A first-class backtest harness reports 49.5% next-day direction (985/1990 predictions, 10 large-caps, 1-year window, no lookahead) and serves a live calibration report at `/api/v1/calibration/latest`.',
    stats: [
      { lbl: 'Next-day dir', val: '49.5%' },
      { lbl: 'Eval', val: 'Backtested' },
      { lbl: 'Predictions', val: '1,990' },
      { lbl: 'Data', val: 'yfinance' }
    ],
    proof: 'backtest harness, no lookahead — live calibration report at /api/v1/calibration/latest',
    stack: ['Python', 'FastAPI', 'Next.js', 'yfinance', 'pandas'],
    github: 'https://github.com/d-malhotra2020/financial-analysis-tool',
    live: 'https://financial-analysis-tool-production.up.railway.app',
    deepDive: 'financial-analysis'
  },
  {
    id: '#005',
    year: '2024',
    category: 'IOT · SIM',
    title: 'Smart Home Automation',
    summary: 'Operator-console dashboard for a simulated home-automation system with an honest real MQTT broker round-trip: every device mutation publishes to the broker and an external client can drive devices back through topic commands. Flask + Flask-SocketIO + paho-mqtt over SQLite state — the broker pip degrades transparently to `offline · sim` instead of faking a connection.',
    stats: [
      { lbl: 'Devices', val: 'Simulated' },
      { lbl: 'Transport', val: 'MQTT' },
      { lbl: 'Round-trip', val: 'Real broker' },
      { lbl: 'Realtime', val: 'WebSocket' }
    ],
    proofLabel: 'how verified',
    proof: 'drive a device from any external MQTT client — the broker pip degrades to offline · sim, never fakes',
    stack: ['Python', 'Flask', 'MQTT', 'SQLite', 'Mosquitto'],
    github: 'https://github.com/d-malhotra2020/smart-home-automation',
    live: 'https://smart-home-automation-production.up.railway.app',
    deepDive: 'smart-home'
  },
  {
    id: '#006',
    year: '2025',
    category: 'WEB · DESIGN',
    title: 'This Portfolio',
    summary: 'Operator-console aesthetic. React + Vite, custom CSS design system, Framer Motion choreography. Deployed via GitHub Pages.',
    stats: [
      { lbl: 'Framework', val: 'React' },
      { lbl: 'Build', val: 'Vite' },
      { lbl: 'Motion', val: 'Framer' },
      { lbl: 'Type', val: 'Geist + Mono' }
    ],
    stack: ['React', 'Vite', 'Framer Motion'],
    github: 'https://github.com/d-malhotra2020/portfolioWebsite',
    live: 'https://drewmalhotra.com',
    deepDive: 'this-portfolio'
  },
  {
    id: '#007',
    year: '2026',
    category: 'LLM · EDGE',
    title: 'Interview Agent · this chatbot',
    summary: 'The chat dock on this site — a Cloudflare Worker proxying the Anthropic Messages API with SSE streaming, sliding-window rate limit (20 req/min/IP via KV), and a daily-cost circuit breaker that short-circuits at $0.333/day before the dashboard cap fires. Resume + project profile baked in as the system prompt.',
    stats: [
      { lbl: 'Model', val: 'Haiku 4.5' },
      { lbl: 'Stream', val: 'SSE' },
      { lbl: 'Cost cap', val: '$10/mo' },
      { lbl: 'Edge', val: 'Cloudflare' }
    ],
    proofLabel: 'how verified',
    proof: 'worker source is public — rate limit, cost breaker, and system prompt all in this repo',
    stack: ['Cloudflare Workers', 'Anthropic API', 'KV', 'SSE'],
    github: 'https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent',
    live: 'https://drewmalhotra.com',
    deepDive: 'interview-agent'
  }
]

const Projects = () => {
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="projects" className="section">
      <div className="shell">
        <div className="section-marker">
          <span className="tag"><span className="dot" /> // 03 · projects.list()</span>
          <h2>Selected <span className="em">work</span>, 2023 – 2025.</h2>
        </div>

        <motion.div
          ref={ref}
          className="work-grid"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {projects.map((p, i) => {
            const clickable = !!p.deepDive
            const deepHref = clickable ? `/work/${p.deepDive}` : null
            const onDeepClick = clickable
              ? (e) => {
                  // Anchor href is the path-form URL so right-click → copy gives
                  // a per-page-OG-friendly link. Click handler uses pushState so
                  // we don't trigger a full page load.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
                  e.preventDefault()
                  navigateTo(deepHref)
                }
              : null

            return (
              <motion.article
                key={i}
                className={`work-card${clickable ? ' work-card-clickable' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.65, 0.3, 1] } }
                }}
              >
                <div className="work-row1">
                  <span className="id">{p.id}</span>
                  <span className="meta">
                    <span>{p.year}</span>
                    <span style={{ color: 'var(--ink-faint)' }}>·</span>
                    <span>{p.category}</span>
                  </span>
                </div>

                <h3>
                  {clickable ? (
                    <a className="work-card-stretch" href={deepHref} onClick={onDeepClick}>
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="work-summary">{p.summary}</p>

                <div className="work-stats">
                  {p.stats.map((s, j) => (
                    <div className="s" key={j}>
                      <div className="lbl">{s.lbl}</div>
                      <div className="val">{s.val}</div>
                    </div>
                  ))}
                </div>

                {p.proof && (
                  <div className="work-proof">
                    <span className="work-proof-lbl">{p.proofLabel || 'how measured'}</span>
                    {p.proof}
                  </div>
                )}

                <div className="work-stack">
                  {p.stack.map((s, j) => (
                    <span className="pill" key={j}>{s}</span>
                  ))}
                </div>

                <div className="work-links">
                  {clickable && (
                    <span className="work-deepdive-hint">
                      read the deep-dive <ArrowUpRight size={14} />
                    </span>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-link-above"
                    >
                      <Github size={14} /> source
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="live work-link-above"
                    >
                      live <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
