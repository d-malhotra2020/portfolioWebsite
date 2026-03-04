import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle } from 'lucide-react'

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
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    color: '#F4F4F5',
    fontSize: '16px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    outline: 'none',
    transition: 'all 0.2s ease'
  }

  const inputFocusStyle = {
    border: '1px solid #3B82F6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  }

  return (
    <section id="contact" style={{
      padding: '120px 0',
      backgroundColor: '#09090b',
      minHeight: '100vh'
    }}>
      <motion.div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div 
          variants={itemVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <div style={{
            width: '4px',
            height: '32px',
            backgroundColor: '#3B82F6',
            borderRadius: '2px'
          }} />
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#F4F4F5',
            margin: 0,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Get In Touch
          </h2>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          style={{ marginBottom: '64px' }}
        >
          <p style={{
            fontSize: '20px',
            color: '#A1A1AA',
            lineHeight: '1.6',
            margin: 0,
            textAlign: 'center',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            I'm always interested in hearing about new opportunities, interesting projects, 
            or just connecting with fellow developers. Feel free to reach out!
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
            gap: '48px'
          }
        }}>
          <motion.div 
            variants={itemVariants}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '24px',
              padding: '32px'
            }}
          >
            {!isSubmitted ? (
              <>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#F4F4F5',
                  margin: '0 0 24px 0',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Send me a message
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label htmlFor="name" style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#E4E4E7',
                      marginBottom: '8px',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      style={{
                        ...inputStyle,
                        '::placeholder': { color: '#71717A' }
                      }}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#E4E4E7',
                      marginBottom: '8px',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      style={{
                        ...inputStyle,
                        '::placeholder': { color: '#71717A' }
                      }}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#E4E4E7',
                      marginBottom: '8px',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      placeholder="Tell me about your project, opportunity, or just say hello!"
                      style={{
                        ...inputStyle,
                        minHeight: '120px',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '16px 24px',
                      backgroundColor: '#3B82F6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{ width: '18px', height: '18px' }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid #ffffff',
                            borderRadius: '50%'
                          }} />
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
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  padding: '40px 0'
                }}
              >
                <CheckCircle size={64} style={{ color: '#10B981', marginBottom: '16px' }} />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#F4F4F5',
                  margin: '0 0 12px 0',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Message Sent Successfully!
                </h3>
                <p style={{
                  color: '#A1A1AA',
                  fontSize: '16px',
                  margin: 0,
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Thank you for reaching out. I'll get back to you as soon as possible!
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#F4F4F5',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                Let's connect!
              </h3>
              <p style={{
                color: '#A1A1AA',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: 0,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                I typically respond within 24 hours. Whether you're looking to collaborate, 
                have questions about my work, or just want to chat about technology, I'd love to hear from you.
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#F4F4F5',
                margin: '0 0 16px 0',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                Contact Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith('mailto:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          color: '#3B82F6'
                        }}>
                          {info.icon}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#71717A',
                            marginBottom: '2px'
                          }}>
                            {info.label}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#E4E4E7'
                          }}>
                            {info.value}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          color: '#3B82F6'
                        }}>
                          {info.icon}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#71717A',
                            marginBottom: '2px'
                          }}>
                            {info.label}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#E4E4E7'
                          }}>
                            {info.value}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#10B981',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                Open to opportunities
              </h3>
              <p style={{
                color: '#A1A1AA',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                Currently open to full-time software engineering positions, freelance projects, 
                and consulting opportunities. Particularly interested in:
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#A1A1AA',
                fontSize: '14px'
              }}>
                <li style={{ marginBottom: '6px' }}>Full-stack development roles</li>
                <li style={{ marginBottom: '6px' }}>AI/ML engineering positions</li>
                <li style={{ marginBottom: '6px' }}>Cloud architecture projects</li>
                <li>Performance optimization challenges</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.footer 
          variants={itemVariants}
          style={{
            marginTop: '120px',
            paddingTop: '48px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <a
              href="https://github.com/d-malhotra2020"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                color: '#A1A1AA',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.color = '#F4F4F5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.color = '#A1A1AA'
              }}
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/drewmalhotra/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                color: '#A1A1AA',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.color = '#F4F4F5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.color = '#A1A1AA'
              }}
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:dhruvmalhotra2025@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                color: '#A1A1AA',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.color = '#F4F4F5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.color = '#A1A1AA'
              }}
            >
              <Mail size={20} />
            </a>
          </div>
          <p style={{
            color: '#71717A',
            fontSize: '14px',
            margin: 0,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            © 2025 Dhruv Malhotra. Built with React and lots of coffee.
          </p>
        </motion.footer>
      </motion.div>
    </section>
  )
}

export default Contact