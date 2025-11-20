import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navbar = ({ theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
  ]

  const themes = [
    { value: 'dracula', label: '🧛 Dracula' },
    { value: 'monokai', label: '🌙 Monokai' },
    { value: 'github', label: '☀️ GitHub' },
    { value: 'vscode', label: '💙 VS Code' },
    { value: 'sublime', label: '🌊 Sublime' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.substring(1))
      const scrollPos = window.scrollY + 100

      for (const section of sections) {
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
  }, [navLinks])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="nav-container">
        {navLinks.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            className={`nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, link.href)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            {link.label}
          </motion.a>
        ))}
        
        <div className="theme-controls">
          <select
            className="theme-selector"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map(themeOption => (
              <option key={themeOption.value} value={themeOption.value}>
                {themeOption.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar