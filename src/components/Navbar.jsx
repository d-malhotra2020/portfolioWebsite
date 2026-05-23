import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const links = [
  { href: '#about', label: 'about', id: 'about' },
  { href: '#experience', label: 'career', id: 'experience' },
  { href: '#projects', label: 'work', id: 'projects' },
  { href: '#skills', label: 'stack', id: 'skills' },
  { href: '#contact', label: 'contact', id: 'contact' }
]

const formatTime = (d) => {
  const opts = { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false }
  return new Intl.DateTimeFormat('en-US', opts).format(d) + ' CT'
}

const Navbar = () => {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(formatTime(new Date()))

  useEffect(() => {
    const t = setInterval(() => setNow(formatTime(new Date())), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + 160
      for (const link of [{ id: 'home' }, ...links]) {
        const el = document.getElementById(link.id)
        if (el) {
          const top = el.offsetTop
          const bottom = top + el.offsetHeight
          if (pos >= top && pos <= bottom) {
            setActive(link.id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const click = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const el = document.getElementById(href.substring(1))
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' })
  }

  return (
    <>
      <div className="statusbar">
        <div className="shell statusbar-inner">
          <div className="statusbar-group">
            <span className="status-pill">
              <span className="pip ok" />
              <span>system: <strong>online</strong></span>
            </span>
            <span className="status-pill hide-sm">env: <strong>portfolio.v3</strong></span>
            <span className="status-pill hide-sm">loc: <strong>austin · tx</strong></span>
          </div>
          <div className="statusbar-group">
            <span className="status-pill hide-sm">availability: <strong>open</strong></span>
            <span className="status-pill">{now}</span>
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="shell nav-inner">
          <a className="nav-lockup" href="#home" onClick={(e) => click(e, '#home')}>
            <span className="logo">D</span>
            <span className="nav-name">drew malhotra</span>
            <span className="nav-slash">/</span>
            <span className="nav-role">software engineer · sdet</span>
          </a>

          <div className="nav-links">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => click(e, l.href)}
                className={`nav-link ${active === l.id ? 'active' : ''}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            className="nav-cta"
            href="/Dhruv_malhotra_resume.pdf"
            download="Dhruv_malhotra_resume.pdf"
          >
            résumé <ArrowUpRight size={13} />
          </a>

          <button
            className="nav-hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => click(e, l.href)}>
                {l.label}
              </a>
            ))}
            <a href="/Dhruv_malhotra_resume.pdf" download="Dhruv_malhotra_resume.pdf">
              download résumé →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
