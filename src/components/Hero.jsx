import React from 'react'
import { motion } from 'framer-motion'
import { Download, ExternalLink, Github, Linkedin } from 'lucide-react'
import TypeWriter from './TypeWriter'

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
          >
            <img 
              src="/ImageFiles/profilePhoto.jpeg" 
              alt="Dhruv (Drew) Malhotra" 
              className="profile-image" 
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
          <a 
            href="https://www.linkedin.com/in/drewmalhotra/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <Linkedin size={20} />
            LinkedIn
          </a>
          <a 
            href="https://github.com/d-malhotra2020" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <Github size={20} />
            GitHub
          </a>
          <a 
            href="/Dhruv_malhotra_resume.pdf" 
            download="Dhruv_malhotra_resume.pdf" 
            className="social-link"
          >
            <Download size={20} />
            Resume
          </a>
        </motion.div>

        <motion.button 
          className="cta-button"
          onClick={scrollToProjects}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View My Work</span>
          <ExternalLink size={20} />
        </motion.button>
      </motion.div>
    </section>
  )
}

export default Hero