import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' }
]

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const scrollPos = window.scrollY + 100

      for (const link of navLinks) {
        const section = link.href.substring(1)
        const element = document.getElementById(section)
        if (element) {
          const top = element.offsetTop
          const bottom = top + element.offsetHeight
          if (scrollPos >= top && scrollPos <= bottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const targetId = href.substring(1)
    setTimeout(() => {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        })
      }
    }, isMobileMenuOpen ? 300 : 0)
  }

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; gap: 0.25rem; }
        .nav-hamburger { display: none; }
        .nav-welcome { display: inline; }
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .nav-welcome { display: none; }
        }
      `}</style>
      <motion.nav
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: isScrolled ? 'rgba(9, 9, 11, 0.85)' : 'rgba(9, 9, 11, 0.6)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem'
        }}>
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#a1a1aa',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span style={{ color: '#3b82f6', fontWeight: '700' }}>Dhruv (Drew) Malhotra</span>
            <span className="nav-welcome" style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span className="nav-welcome" style={{ color: '#a1a1aa', fontWeight: '400', fontSize: '0.8rem' }}>Software Developer, SDET, AI Enthusiast</span>
          </motion.a>

          <div className="nav-desktop">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                style={{
                  color: activeSection === link.href.substring(1) ? '#f4f4f5' : '#a1a1aa',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
                whileHover={{ color: '#f4f4f5' }}
              >
                {link.label}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="navUnderline"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '2px',
                      background: '#3b82f6',
                      borderRadius: '1px'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="nav-hamburger"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f4f4f5',
              cursor: 'pointer',
              padding: '0.5rem',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                overflow: 'hidden',
                background: 'rgba(9, 9, 11, 0.95)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '0.5rem 2rem'
              }}
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: activeSection === link.href.substring(1) ? '#3b82f6' : '#f4f4f5',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '1rem',
                    padding: '0.875rem 0',
                    borderBottom: index < navLinks.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {activeSection === link.href.substring(1) && (
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#3b82f6'
                    }} />
                  )}
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
