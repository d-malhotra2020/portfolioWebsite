import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Linkedin, Github, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

const Contact = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Replace with your actual Formspree endpoint
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
        
        // Reset after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'dhruvmalhotra2025@gmail.com',
      link: 'mailto:dhruvmalhotra2025@gmail.com'
    },
    {
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      value: '/in/drewmalhotra',
      link: 'https://www.linkedin.com/in/drewmalhotra/'
    },
    {
      icon: <Github size={20} />,
      label: 'GitHub',
      value: 'd-malhotra2020',
      link: 'https://github.com/d-malhotra2020'
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'Austin, TX'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="contact" className="section">
      <motion.div 
        className="content-container"
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 variants={itemVariants}>Get In Touch</motion.h2>
        
        <motion.div className="contact-content" variants={itemVariants}>
          <p>
            I'm always interested in hearing about new opportunities, interesting projects, 
            or just connecting with fellow developers. Feel free to reach out!
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Contact Form */}
          <motion.div 
            className="contact-form-container"
            variants={itemVariants}
          >
            {!isSubmitted ? (
              <>
                <h3>📧 Send me a message</h3>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      placeholder="Tell me about your project, opportunity, or just say hello!"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div 
                className="form-success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle size={48} />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. I'll get back to you as soon as possible!</p>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="contact-info"
            variants={itemVariants}
          >
            <div className="contact-item">
              <h3>💬 Let's connect!</h3>
              <p className="response-info">
                I typically respond within 24 hours. Whether you're looking to collaborate, 
                have questions about my work, or just want to chat about technology, I'd love to hear from you.
              </p>
            </div>

            <div className="contact-item">
              <h3>📬 Contact Information</h3>
              <div className="contact-links">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith('mailto:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="contact-link-item"
                      >
                        <span className="contact-icon">{info.icon}</span>
                        <div>
                          <div className="contact-label">{info.label}</div>
                          <div className="contact-value">{info.value}</div>
                        </div>
                      </a>
                    ) : (
                      <div className="contact-link-item">
                        <span className="contact-icon">{info.icon}</span>
                        <div>
                          <div className="contact-label">{info.label}</div>
                          <div className="contact-value">{info.value}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="contact-item">
              <h3>🤝 Open to opportunities</h3>
              <p className="response-info">
                Currently open to full-time software engineering positions, freelance projects, 
                and consulting opportunities. Particularly interested in:
              </p>
              <ul className="opportunity-list">
                <li>Full-stack development roles</li>
                <li>AI/ML engineering positions</li>
                <li>Cloud architecture projects</li>
                <li>Performance optimization challenges</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Contact