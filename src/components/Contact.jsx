import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight } from 'lucide-react'

const channels = [
  {
    label: 'email',
    value: 'dhruvmalhotra2026@gmail.com',
    href: 'mailto:dhruvmalhotra2026@gmail.com'
  },
  {
    label: 'linkedin',
    value: '/in/drewmalhotra',
    href: 'https://www.linkedin.com/in/drewmalhotra/'
  },
  {
    label: 'github',
    value: '@d-malhotra2020',
    href: 'https://github.com/d-malhotra2020'
  },
  {
    label: 'location',
    value: 'Austin, TX — open to relocate'
  }
]

const Contact = () => {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      const res = await fetch('https://formspree.io/f/xwprrpkv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus("Sent. I'll reply within 24 hours.")
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('Send failed. Email me directly?')
      }
    } catch {
      setStatus('Send failed. Email me directly?')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section" style={{ paddingBottom: '3rem' }}>
      <div className="shell">
        <div className="section-marker">
          <span className="tag"><span className="dot" /> // 05 · ./connect</span>
          <h2>Let's <span className="em">build something.</span></h2>
        </div>

        <motion.div
          ref={ref}
          className="contact-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 1] }}
        >
          <div>
            <h3 className="contact-headline">
              Currently <span className="grad">open</span> to new engineering roles.
            </h3>
            <p className="contact-blurb">
              Full-time SDE / SDET, AI/ML, or cloud architecture. Particularly interested in
              teams shipping high-throughput infrastructure where correctness matters. I reply
              within 24 hours.
            </p>

            <div className="channels">
              {channels.map((c, i) =>
                c.href ? (
                  <a
                    key={i}
                    className="channel"
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    <span className="lbl">{c.label}</span>
                    <span className="val">{c.value}</span>
                    <span className="arrow"><ArrowUpRight size={14} /></span>
                  </a>
                ) : (
                  <div key={i} className="channel">
                    <span className="lbl">{c.label}</span>
                    <span className="val">{c.value}</span>
                    <span />
                  </div>
                )
              )}
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-head">
              <span>~ /contact/new_message.sh</span>
              <span className="ok">ready</span>
            </div>

            <label className="field">
              <span className="field-label">
                name <span className="req">*</span>
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={onChange}
                placeholder="your full name"
              />
            </label>

            <label className="field">
              <span className="field-label">
                email <span className="req">*</span>
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="you@company.com"
              />
            </label>

            <label className="field">
              <span className="field-label">
                message <span className="req">*</span>
              </span>
              <textarea
                name="message"
                required
                value={form.message}
                onChange={onChange}
                placeholder="What are you working on?"
                rows={4}
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
              <span>{sending ? 'sending…' : 'send message'}</span>
              {!sending && <ArrowUpRight size={14} className="arrow" />}
            </button>

            {status && (
              <div className="form-status" role="status" aria-live="polite">
                → {status}
              </div>
            )}
          </form>
        </motion.div>

        <footer className="foot">
          <div>© 2026 · Dhruv (Drew) Malhotra</div>
          <div className="build">
            <span className="ok">build · ok</span> · v3.0.0 · set in Geist &amp; JetBrains Mono
          </div>
          <div>austin · tx</div>
        </footer>
      </div>
    </section>
  )
}

export default Contact
