import React from 'react'
import { Download, ArrowUpRight } from 'lucide-react'

const stats = [
  { num: '1.5', tail: 'M+', label: 'Users served\nat Givelify scale' },
  { num: '99.9', tail: '%', label: 'Delivery reliability\npost-migration' },
  { num: '3,000', tail: '+', label: 'Intersections simulated\nfor Yunex load tests' },
  { num: '1,800', tail: '+', label: 'Tests authored\nacross prod stacks' }
]

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' })
  }

  return (
    <section id="home" className="hero">
      <div className="shell">
        <div className="hero-card">
          {/* LEFT */}
          <div className="hero-l">
            <span className="hero-badge fade-up" style={{ animationDelay: '0.05s' }}>
              <span className="pip" /> Open to new roles · 2026
            </span>

            <h1 className="hero-title line-rise">
              <span className="line">
                <span style={{ animationDelay: '0.1s' }}>Engineer</span>
              </span>
              <span className="line">
                <span style={{ animationDelay: '0.25s' }} className="grad">
                  shipping cloud-scale
                </span>
              </span>
              <span className="line">
                <span style={{ animationDelay: '0.4s' }}>
                  systems<span className="caret" />
                </span>
              </span>
            </h1>

            <div className="hero-avail fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="roles">SDE · SDET · AI Engineer · QA · SWE</div>
              <div className="loc">
                Austin, TX · open to <span className="accent">Bay Area</span> relocation · remote-friendly
              </div>
            </div>

            <p className="hero-lede fade-up" style={{ animationDelay: '0.6s' }}>
              I'm <strong>Dhruv (Drew) Malhotra</strong> — Software Engineer in Test at
              Brivo (fmr. Eagle Eye Networks), running synthetic monitoring across
              <span className="accent"> 26 production environments</span> in 6 global regions.
              Before that I shipped a PyTorch recommender to <strong>1.5M users</strong> at
              Givelify, and ran load tests across <strong>3,000+ intersections</strong> for
              Yunex Traffic. <strong>Security clearance eligible veteran.</strong>
            </p>

            <div className="hero-ctas fade-up" style={{ animationDelay: '0.75s' }}>
              <button className="btn btn-primary" onClick={() => scrollTo('contact')}>
                Get in touch
                <ArrowUpRight size={14} className="arrow" />
              </button>
              <a
                className="btn"
                href="/Dhruv_malhotra_resume.pdf"
                download="Dhruv_malhotra_resume.pdf"
              >
                <Download size={14} />
                Download résumé
              </a>
            </div>

            <div className="hero-quicklinks fade-up" style={{ animationDelay: '0.9s' }}>
              <a
                href="https://github.com/d-malhotra2020"
                target="_blank"
                rel="noopener noreferrer"
              >
                github ↗
              </a>
              <a
                href="https://www.linkedin.com/in/drewmalhotra/"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin ↗
              </a>
              <a href="mailto:dhruvmalhotra2026@gmail.com">mail ↗</a>
            </div>
          </div>

          {/* RIGHT — Terminal panel */}
          <div className="hero-r fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="term-bar">
              <div className="dots">
                <span /><span /><span />
              </div>
              <span>~ /drew/whoami.sh</span>
              <span>zsh</span>
            </div>
            <div className="term-body">
              <div className="term-line">
                <span className="term-prompt">$</span>
                <span className="term-cmd">cat profile.json</span>
              </div>
              <div className="term-line"><span className="term-key">{'{'}</span></div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"name":</span>
                <span className="term-string">"Dhruv (Drew) Malhotra"</span>,
              </div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"role":</span>
                <span className="term-string">"Software Engineer in Test"</span>,
              </div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"company":</span>
                <span className="term-string">"Brivo (fmr. Eagle Eye Networks)"</span>,
              </div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"location":</span>
                <span className="term-string">"Austin, TX"</span>,
              </div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"stack":</span>
                <span className="term-val">[python, flask, aiohttp, aws, k8s, react]</span>,
              </div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"focus":</span>
                <span className="term-string">"distributed test infra · synthetic monitoring · AI/ML"</span>,
              </div>
              <div className="term-line" style={{ paddingLeft: '1.25rem' }}>
                <span className="term-key">"available":</span>
                <span className="term-val" style={{ color: 'var(--ok)' }}>true</span>
              </div>
              <div className="term-line"><span className="term-key">{'}'}</span></div>
              <div className="term-divider" />
              <div className="term-line">
                <span className="term-prompt">$</span>
                <span className="term-cmd term-cursor">ready_for_interview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stats-strip">
          {stats.map((s, i) => (
            <div
              className="stat fade-up"
              key={i}
              style={{ animationDelay: `${0.8 + i * 0.08}s` }}
            >
              <div className="stat-num">
                {s.num}<em>{s.tail}</em>
              </div>
              <div className="stat-label" style={{ whiteSpace: 'pre-line' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
