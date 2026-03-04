import React from 'react'
import { motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail } from 'lucide-react'
import TypeWriter from './TypeWriter'

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section id="home" className="section">
      <motion.div 
        style={{
          width: '100%',
          textAlign: 'left',
          maxWidth: '800px'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <motion.div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.img 
              src="/ImageFiles/profilePhoto.jpeg" 
              alt="Dhruv (Drew) Malhotra" 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '1rem',
                objectFit: 'cover',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(24, 24, 27, 0.8)'
              }}
              whileHover={{
                scale: 1.05
              }}
              transition={{ duration: 0.3 }}
            />
            
            <div>
              <motion.h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: '800',
                  color: '#f4f4f5',
                  marginBottom: '0.5rem',
                  lineHeight: '1.1'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Hi, I'm Dhruv (Drew)
              </motion.h1>
              
              <motion.div 
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  color: '#a1a1aa',
                  minHeight: '2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <TypeWriter 
                  phrases={[
                    'Full-Stack Developer',
                    'AI/ML Engineer',
                    'Cloud Architect',
                    'System Optimizer',
                    'Problem Solver'
                  ]}
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.button
              style={{
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: '#2563eb'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToContact}
            >
              <Mail size={18} />
              Get in Touch
            </motion.button>

            <motion.a
              href="/Dhruv_malhotra_resume.pdf"
              download="Dhruv_malhotra_resume.pdf"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#f4f4f5',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={18} />
              Resume
            </motion.a>
          </motion.div>

          <motion.div 
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.a
              href="https://github.com/d-malhotra2020" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#a1a1aa',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              whileHover={{
                color: '#f4f4f5',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/drewmalhotra/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#a1a1aa',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              whileHover={{
                color: '#f4f4f5',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={20} />
            </motion.a>

            <motion.a
              href="mailto:drewmalhotra@outlook.com"
              style={{
                color: '#a1a1aa',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              whileHover={{
                color: '#f4f4f5',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={20} />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero