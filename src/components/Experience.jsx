import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown } from 'lucide-react'

const experiences = [
  {
    date: '2024.10 — present',
    title: 'Software Engineer in Test',
    company: 'Brivo',
    sub: 'fmr. Eagle Eye Networks',
    location: 'Austin, TX',
    current: true,
    lede: 'Owning the validation layer of the world\'s #1 cloud video surveillance platform — proving 24 production environments deliver notifications reliably for thousands of enterprise customers.',
    skills: ['Python', 'Flask', 'aiohttp', 'pytest-django', 'Docker', 'Postman'],
    details: {
      projects: [
        'Synthetic Monitoring Platform: Multi-cluster Python/Flask system validating notification pipeline integrity across 24 production environments in 6 global regions; 39+ API routes with real-time health dashboards',
        'LLM-Augmented QA Workflow: Automated API test generation and data analysis, reducing manual testing cycles from days to ~15 minutes',
        'Gmail Ingestion Pipeline: Fault-tolerant batch processor for 200+ emails/day with 5× throughput improvement via concurrency, caching, and backoff logic',
        'API Load Testing Tool: High-concurrency Python/aiohttp framework with session auth, dynamic CLI filtering, pagination handling, and Docker CI/CD integration'
      ],
      impact: [
        'Reverse-engineered undocumented throttling behavior by analyzing 3,100+ alerts and 10,100+ notifications — influenced platform architecture decisions',
        'Authored 1,000+ pytest-django tests and 300+ Postman API tests, achieving 100% coverage across core services',
        'Uncovered critical PATCH vulnerability in rules endpoint allowing removal of required fields in production — led immediate remediation',
        'Validated platform migration impacting 10,000+ users with 99.9%+ delivery reliability post-migration'
      ]
    }
  },
  {
    date: '2023.07 — 2024.10',
    title: 'Software Engineer',
    company: 'Yunex Traffic',
    location: 'Austin, TX',
    lede: 'Built Python systems for the global leader in Intelligent Transportation Systems — testing AI-enabled traffic management at city scale, in pursuit of Vision Zero.',
    skills: ['Python', 'TensorFlow', 'AWS', 'Docker', 'Kubernetes'],
    details: {
      projects: [
        'Real-time Traffic Software: Python management system with complex scheduling algorithms and database-backed state handling',
        'AI/ML Integration: TensorFlow models for predictive traffic analysis using time-series forecasting and anomaly detection',
        'Load Testing Framework: Simulated 3,000+ intersections with concurrency modeling and data-driven scenarios',
        'NTCIP Protocol Compliance: Validated 200+ traffic controllers in collaboration with embedded systems team',
        'AWS Migration: Modernized legacy systems for cloud-native deployment via Docker + Kubernetes'
      ],
      impact: [
        '15% improvement in urban traffic flow efficiency across multiple city networks',
        '20% reduction in peak-hour congestion through predictive analytics',
        '30% decrease in operational costs via system optimization',
        '30% reduction in field deployment failures via NTCIP compliance validation'
      ]
    }
  },
  {
    date: '2020.05 — 2023.07',
    title: 'Software Engineer',
    company: 'Givelify',
    location: 'Austin, TX',
    lede: 'Three+ years shipping the recommendation engine, search, and donation workflow for the nation\'s leading mobile giving platform — 1.5M users, 70K organizations, 4.9-star app.',
    skills: ['Python', 'PyTorch', 'React', 'Google API', 'Jenkins', 'Docker', 'pytest'],
    details: {
      projects: [
        'Recommendation Engine: Built and deployed Python/PyTorch system through cross-functional collaboration',
        'Search Enhancement: Refined search using Python and React — benefited 10k+ daily users, +15% efficiency',
        'Location Services: Google API + LocationIQ geocoding for 5,000+ daily users — reduced failed lookups by 40%',
        'CI/CD Pipelines: Jenkins + Docker pipelines cutting deployment time by 70%',
        'Microservices Migration: Led migration of monolithic payment service to microservices — +45% throughput, −25% latency'
      ],
      impact: [
        '+25% user retention and +20% engagement via intelligent recommendations',
        '−40% failed location lookups, −18% transaction latency',
        'Architected pytest suite with 85%+ coverage across donation processing, payments, and auth',
        'Supported platform growth to 1.5M+ users across 70,000+ organizations'
      ]
    }
  },
  {
    date: '2019.10 — 2020.05',
    title: 'Junior Software QA Developer',
    company: 'Nourtek',
    location: 'Dallas, TX',
    lede: 'Piloted regression testing protocols and built a Java/JUnit automation framework that cut the manual QA cycle from 3 days to 4 hours.',
    skills: ['Java', 'JUnit', 'Jira', 'QA Testing'],
    details: {
      projects: [
        'Executed 500+ automated JUnit test cases across 3 major releases — reduced production defects by 20%',
        'Piloted regression testing protocols using Jira, cementing software stability across 25+ releases',
        'Built regression test framework in Java/JUnit — manual QA cycle reduced from 3 days to 4 hours'
      ],
      impact: [
        'Managed 500+ individual software test cases',
        'Maintained quality standards across 25+ releases',
        'Reduced production defects by 20% through automated coverage'
      ]
    }
  },
  {
    date: '2018.08 — 2021.12',
    title: 'B.S. Computer Science',
    company: 'University of Texas at Dallas',
    location: 'Dallas, TX',
    lede: 'Algorithms, data structures, software engineering principles, database systems.',
    skills: ['Algorithms', 'Data Structures', 'Software Engineering', 'Databases']
  },
  {
    date: '2011.07 — 2016.07',
    title: 'Navy Corpsman',
    company: 'United States Navy',
    location: 'Okinawa, JP',
    lede: 'Medical care for 4,500+ servicemembers in high-stakes operational environments. Supported S-2 Intelligence managing security clearances for 3,000+ personnel. Where I learned that the calm voice in the chaos is the one that ships.',
    skills: ['Leadership', 'Operations', 'Security Clearance']
  }
]

const Experience = () => {
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })
  const [openIdx, setOpenIdx] = useState(0)

  const toggle = (i) => setOpenIdx(openIdx === i ? -1 : i)

  return (
    <section id="experience" className="section">
      <div className="shell">
        <div className="section-marker">
          <span className="tag"><span className="dot" /> // 02 · career.log</span>
          <h2>Where I've <span className="em">shipped.</span></h2>
        </div>

        <motion.div
          ref={ref}
          className="career"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {experiences.map((exp, i) => {
            const isOpen = openIdx === i
            return (
              <motion.article
                key={i}
                className={`career-card ${isOpen ? 'open' : ''} ${exp.current ? 'current' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <button className="career-head" onClick={() => toggle(i)}>
                  <span className="date">{exp.date}</span>
                  <span className="stack">
                    <span className="title">
                      {exp.title}
                      {exp.current && (
                        <span className="current-pill">
                          <span className="pip" /> CURRENT
                        </span>
                      )}
                    </span>
                    <span className="company">
                      {exp.company}
                      {exp.sub && <span className="loc"> · {exp.sub}</span>}
                      <span className="loc"> · {exp.location}</span>
                    </span>
                  </span>
                  <span className="toggle">
                    <ChevronDown size={16} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="career-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 1] }}
                    >
                      <p className="lede">{exp.lede}</p>

                      {exp.details && (
                        <div className="grid">
                          <div>
                            <h5>Projects</h5>
                            <ul>
                              {exp.details.projects.map((p, k) => {
                                const [head, ...rest] = p.split(':')
                                return (
                                  <li key={k}>
                                    <strong>{head}</strong>
                                    {rest.length > 0 ? ':' + rest.join(':') : ''}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                          <div>
                            <h5>Impact</h5>
                            <ul>
                              {exp.details.impact.map((p, k) => (
                                <li key={k}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="career-skills">
                        {exp.skills.map((s, j) => (
                          <span key={j} className="pill">{s}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Experience
