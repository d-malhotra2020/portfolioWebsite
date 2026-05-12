import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Linkedin, Github, MapPin } from 'lucide-react'

const Contact = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'dhruvmalhotra2026@gmail.com',
      link: 'mailto:dhruvmalhotra2026@gmail.com'
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

  return (
    <section id="contact" style={{
      padding: '120px 0',
      backgroundColor: '#09090b',
      minHeight: '100vh'
    }}>
      <motion.div
        style={{
          maxWidth: '800px',
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
              href="mailto:dhruvmalhotra2026@gmail.com"
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
            © 2026 Dhruv Malhotra. Built with React and lots of coffee.
          </p>
        </motion.footer>
      </motion.div>
    </section>
  )
}

export default Contact
