import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ArrowUpRight } from 'lucide-react'
import { navigateTo } from '../lib/router'

const projects = [
  {
    id: '#001',
    year: '2024',
    category: 'CLOUD · AI',
    title: 'Video Surveillance Analytics',
    summary: 'Cloud-based video analytics platform for enterprise security. AI-powered threat detection, real-time alerts, scalable processing of 500+ concurrent streams.',
    stats: [
      { lbl: 'Streams', val: '500+' },
      { lbl: 'Alerts', val: '4,600+' },
      { lbl: 'Accuracy', val: '92%' },
      { lbl: 'Detection', val: 'AI' }
    ],
    stack: ['Python', 'aiohttp', 'Docker', 'PostgreSQL', 'CV'],
    github: 'https://github.com/d-malhotra2020/video-analytics',
    live: 'https://video-analytics-production.up.railway.app'
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
    stack: ['Python', 'FastAPI', 'OpenStreetMap', 'Docker', 'Railway'],
    github: 'https://github.com/d-malhotra2020/traffic-optimization',
    live: 'https://traffic-optimization-production.up.railway.app'
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
    summary: 'Processes 1M+ daily data points. Combines statistical models with ML for risk analysis and real-time market signals — 94% prediction accuracy.',
    stats: [
      { lbl: 'Data points', val: '1M+/day' },
      { lbl: 'Accuracy', val: '94%' },
      { lbl: 'Latency', val: 'Real-time' },
      { lbl: 'Models', val: 'ML + Stat' }
    ],
    stack: ['Python', 'Pandas', 'sklearn', 'Postgres', 'FastAPI'],
    github: 'https://github.com/d-malhotra2020/financial-analysis-tool',
    live: 'https://financial-analysis-tool-production.up.railway.app',
    deepDive: 'financial-analysis'
  },
  {
    id: '#005',
    year: '2024',
    category: 'IOT · EDGE',
    title: 'Smart Home Automation',
    summary: 'Self-built home automation integrating 15+ IoT sensors via MQTT with Flask command center on Raspberry Pi. Mobile + voice control, 30% energy savings.',
    stats: [
      { lbl: 'Sensors', val: '15+' },
      { lbl: 'Latency', val: '<500ms' },
      { lbl: 'Energy', val: '−30%' },
      { lbl: 'Control', val: 'Voice + UI' }
    ],
    stack: ['Python', 'Raspberry Pi', 'MQTT', 'Flask'],
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
            const deepHref = clickable ? `#/work/${p.deepDive}` : null

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
                    <a className="work-card-stretch" href={deepHref}>
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
