import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Download, ExternalLink, Github, Linkedin } from 'lucide-react'
import TypeWriter from './TypeWriter'

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    // Magnetic effect - stronger pull when closer
    const maxDistance = 100
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    
    if (distance < maxDistance) {
      x.set(distanceX * 0.2)
      y.set(distanceY * 0.2)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Magnetic Link Component
const MagneticLink = ({ children, className, ...props }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })
  const rotateX = useTransform(y, [-10, 10], [5, -5])
  const rotateY = useTransform(x, [-10, 10], [-5, 5])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    x.set(distanceX * 0.15)
    y.set(distanceY * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ 
        x: springX, 
        y: springY,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.a>
  )
}

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section id="home" className="hero-section section">
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-profile">
          <motion.div 
            className="profile-image-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.img 
              src="/ImageFiles/profilePhoto.jpeg" 
              alt="Dhruv (Drew) Malhotra" 
              className="profile-image" 
              whileHover={{
                boxShadow: "0 20px 60px rgba(189, 147, 249, 0.5)"
              }}
            />
          </motion.div>
          
          <div className="hero-text">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="code-keyword">const</span> developer = <span className="code-string">"Dhruv (Drew) Malhotra"</span> 👨‍💻
            </motion.h1>
            
            <motion.div 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="code-comment">// </span>
              <TypeWriter 
                phrases={[
                  'specializes in full-stack development',
                  'builds scalable web applications',
                  'optimizes system performance',
                  'implements AI/ML solutions',
                  'architects cloud infrastructure',
                  'automates testing pipelines',
                  'debugs complex problems',
                  'codes in Python & JavaScript'
                ]}
              />
              <span className="typing-cursor">|</span>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="hero-links"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <MagneticLink
            href="https://www.linkedin.com/in/drewmalhotra/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Linkedin size={20} />
            </motion.div>
            LinkedIn
          </MagneticLink>
          <MagneticLink
            href="https://github.com/d-malhotra2020" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Github size={20} />
            </motion.div>
            GitHub
          </MagneticLink>
          <MagneticLink
            href="/Dhruv_malhotra_resume.pdf"
            download="Dhruv_malhotra_resume.pdf" 
            className="social-link"
          >
            <motion.div
              whileHover={{ y: [0, -2, 2, -1, 1, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Download size={20} />
            </motion.div>
            Resume
          </MagneticLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <MagneticButton 
            className="cta-button"
            onClick={scrollToProjects}
          >
            <span>View My Work</span>
            <motion.div
              whileHover={{ 
                x: [0, 3, -3, 2, -2, 0],
                rotate: [0, 5, -5, 3, -3, 0] 
              }}
              transition={{ duration: 0.6 }}
            >
              <ExternalLink size={20} />
            </motion.div>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero