import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, ChevronUp } from 'lucide-react'

const Experience = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const experiences = [
    {
      date: "Oct 2024 - Present",
      title: "Software Engineer in Test",
      company: "Eagle Eye Networks, Austin TX",
      description: "Eagle Eye Networks is the #1 cloud video surveillance company worldwide, providing AI-powered cloud-based video management systems. Founded in 2012, the company serves businesses from small enterprises to large corporations with advanced security solutions that eliminate the need for on-premise servers while delivering intelligent analytics and seamless scalability.",
      details: {
        projects: [
          "Gmail Integration Pipeline: Designed fault-tolerant system with 5x throughput improvement using concurrency, caching, and backoff logic",
          "API Performance Testing: Built high-concurrency testing framework with dynamic CLI filtering and pagination support",
          "Legacy API Migration: Led notification parity testing between v1 and v3 APIs, delivered deprecation roadmap adopted by Customer Success",
          "Database Optimization: Replaced PostgreSQL with SQLite for automated tests, reducing runtime by 40%",
          "Virtual Testing Environment: Simulated 500+ camera streams for realistic large-scale REST API stress testing"
        ],
        impact: [
          "Analyzed 4,600+ alerts across 10+ endpoints with 92% correlation accuracy",
          "Achieved 100% test coverage across core services",
          "Uncovered 25% performance gains through automated monitoring comparison",
          "Benchmarked P95/P99 latency and throughput metrics for core APIs"
        ]
      },
      skills: ["Python", "aiohttp", "Docker", "PostgreSQL", "pytest"],
      current: true
    },
    {
      date: "Jul 2023 - Oct 2024",
      title: "Software Engineer",
      company: "Yunex Traffic, Austin TX",
      description: "Yunex Traffic is a global leader in Intelligent Transportation Systems (ITS), developing innovative mobility solutions for smart cities and highway authorities. Formerly Siemens ITS, the company became independent in 2021 and now serves over 40 countries with 3,100 employees, creating AI-enabled traffic management systems that optimize urban mobility while pursuing Vision Zero: eliminating traffic fatalities.",
      details: {
        projects: [
          "Real-time Traffic Software: Built Python-based management system with complex scheduling algorithms and database-backed state handling",
          "AI/ML Integration: Applied TensorFlow for predictive traffic analysis using time-series forecasting and anomaly detection",
          "Load Testing Framework: Simulated 3,000+ intersections with concurrency modeling for large-scale system validation",
          "AWS Migration: Modernized legacy traffic systems for cloud-native deployment with improved scalability",
          "Container Orchestration: Leveraged Docker + Kubernetes clusters for reliable infrastructure management"
        ],
        impact: [
          "15% improvement in urban traffic flow efficiency across multiple city networks",
          "20% reduction in peak-hour congestion through predictive analytics",
          "30% decrease in operational costs via system optimization",
          "98% bug resolution success rate through Pytest testing protocols"
        ]
      },
      skills: ["Python", "TensorFlow", "AWS", "Docker", "Kubernetes"]
    },
    {
      date: "May 2020 - Jul 2023",
      title: "Software Engineer",
      company: "Givelify, Austin TX",
      description: "Givelify is the nation's leading mobile giving platform, connecting causes to people through the highest-rated donation app. Trusted by over 1.5 million users and 70,000+ organizations, Givelify makes charitable giving joyful and accessible with a 4.9-star rating and military-grade security, processing donations to churches and nonprofits with next-day deposits and zero setup fees.",
      details: {
        projects: [
          "Recommendation Engine Development: Collaborated cross-functionally with agile engineering, product, and quality teams to develop and deploy a recommendation engine using Python and PyTorch",
          "Search Enhancement: Refined search capabilities using Python and React, benefiting 10k+ daily users by boosting efficiency by 15%",
          "Performance Improvement: Enhanced application performance using optimized data structures in Python, improving speeds by 35%",
          "Location Services: Implemented Geocoding services using Google API and LocationIQ, enhancing location-based search for 5k+ daily users",
          "Donation Workflow Optimization: Improved donation workflows by building new API endpoints and streamlining payment integrations"
        ],
        impact: [
          "Elevated user retention by 25% and engagement by 20% through intelligent recommendations",
          "Reduced transaction latency by 18% and enhanced reliability of high-volume transactions",
          "Supported platform growth to serve 1.5M+ users across 70,000+ organizations"
        ]
      },
      skills: ["Python", "PyTorch", "React", "Google API"]
    },
    {
      date: "Aug 2018 - Dec 2021",
      title: "Bachelor of Science in Computer Science",
      company: "University of Texas at Dallas",
      description: "Completed comprehensive computer science education covering algorithms, data structures, software engineering principles, and database management systems.",
      skills: ["Algorithms", "Data Structures", "Software Engineering", "Database Systems"]
    },
    {
      date: "Oct 2019 - May 2020",
      title: "Junior Software QA Developer",
      company: "Nourtek, Dallas TX",
      description: "Nourtek Solutions is a Dallas-area IT consulting and software development company founded in 2005, providing comprehensive technology solutions including custom software development, QA testing services, and managed IT support. The company specializes in offshore development, application testing, and has since evolved into Injala®, focusing on innovative risk management solutions for the insurance technology sector.",
      details: {
        projects: [
          "Comprehensive Testing Leadership: Led 500+ software tests using JUnit, enhancing software reliability by 20%",
          "Regression Testing Implementation: Piloted regression testing protocols using Jira, cementing software stability across 25+ releases",
          "Quality Improvement: Established testing standards and procedures that significantly improved product reliability"
        ],
        impact: [
          "Successfully managed and executed 500+ individual software test cases",
          "Maintained quality standards across 25+ software releases",
          "Achieved 20% improvement in overall software reliability metrics"
        ]
      },
      skills: ["JUnit", "Jira", "QA Testing", "Regression Testing"]
    },
    {
      date: "Jul 2011 - Jul 2016",
      title: "Navy Corpsman",
      company: "United States Navy, Okinawa JP",
      description: "Managed medical care for 4,500 servicemembers including checkups, immunizations, and preventative care. Attached to S-2 Security and Intelligence Division ensuring security clearances for 3,000 servicemembers.",
      skills: ["Healthcare", "Security Clearance", "Leadership", "Operations"]
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
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const sectionStyle = {
    minHeight: '100vh',
    paddingTop: '6rem',
    paddingBottom: '6rem',
    backgroundColor: '#09090b'
  }

  const containerStyle = {
    maxWidth: '64rem',
    margin: '0 auto',
    padding: '0 2rem'
  }

  const headingStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#f4f4f5',
    marginBottom: '3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }

  const accentBarStyle = {
    width: '3px',
    height: '2rem',
    backgroundColor: '#3b82f6',
    borderRadius: '2px'
  }

  const timelineStyle = {
    position: 'relative',
    paddingLeft: '2rem'
  }

  const timelineLineStyle = {
    position: 'absolute',
    left: '1rem',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#27272a',
    borderRadius: '1px'
  }

  const timelineItemStyle = {
    position: 'relative',
    marginBottom: '3rem',
    paddingLeft: '3rem'
  }

  const timelineDotStyle = {
    position: 'absolute',
    left: '-2.75rem',
    top: '0.5rem',
    width: '12px',
    height: '12px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    border: '2px solid #09090b'
  }

  const timelineCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '1rem',
    padding: '2rem'
  }

  const timelineHeaderStyle = {
    marginBottom: '1.5rem'
  }

  const dateStyle = {
    color: '#71717a',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  }

  const companyStyle = {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#60a5fa',
    marginBottom: '1rem'
  }

  const currentBadgeStyle = {
    background: '#065f46',
    color: '#10b981',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid #059669'
  }

  const descriptionStyle = {
    color: '#a1a1aa',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  }

  const skillsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  }

  const skillTagStyle = {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  }

  const expandButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease'
  }

  const detailsSectionStyle = {
    marginTop: '1.5rem',
    padding: '1.5rem',
    background: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(59, 130, 246, 0.1)'
  }

  const detailsTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '1rem'
  }

  const detailsListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  }

  const detailsItemStyle = {
    color: '#a1a1aa',
    marginBottom: '0.5rem',
    lineHeight: '1.5',
    paddingLeft: '1rem',
    position: 'relative'
  }

  const bulletStyle = {
    position: 'absolute',
    left: '0',
    top: '0.5rem',
    width: '4px',
    height: '4px',
    backgroundColor: '#60a5fa',
    borderRadius: '50%'
  }

  return (
    <section id="experience" style={sectionStyle}>
      <motion.div 
        style={containerStyle}
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} style={headingStyle}>
          <div style={accentBarStyle}></div>
          Experience & Education
        </motion.div>
        
        <motion.div style={timelineStyle} variants={containerVariants}>
          <div style={timelineLineStyle}></div>
          
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              style={timelineItemStyle}
              variants={itemVariants}
            >
              <div style={timelineDotStyle}></div>
              <motion.div 
                style={timelineCardStyle}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <div style={timelineHeaderStyle}>
                  <div style={dateStyle}>{exp.date}</div>
                  <h3 style={titleStyle}>
                    {exp.title}
                    {exp.current && (
                      <span style={currentBadgeStyle}>Current</span>
                    )}
                  </h3>
                  <h4 style={companyStyle}>{exp.company}</h4>
                </div>
                
                <p style={descriptionStyle}>{exp.description}</p>
                
                <div style={skillsStyle}>
                  {exp.skills.map((skill, i) => (
                    <span key={i} style={skillTagStyle}>{skill}</span>
                  ))}
                </div>
                
                {exp.details && (
                  <>
                    <button 
                      style={expandButtonStyle}
                      onClick={() => toggleExpanded(index)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span>
                        {expandedItems[index] ? 'Hide Details' : 'View Details'}
                      </span>
                      {expandedItems[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    <AnimatePresence>
                      {expandedItems[index] && (
                        <motion.div
                          style={detailsSectionStyle}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          layout
                        >
                          <div>
                            <h5 style={detailsTitleStyle}>Key Projects & Achievements:</h5>
                            <ul style={detailsListStyle}>
                              {exp.details.projects?.map((project, i) => (
                                <li key={i} style={detailsItemStyle}>
                                  <div style={bulletStyle}></div>
                                  <strong style={{ color: '#e4e4e7' }}>
                                    {project.split(':')[0]}:
                                  </strong> {project.split(':')[1]}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {exp.details.impact && (
                            <div style={{ marginTop: '1.5rem' }}>
                              <h5 style={detailsTitleStyle}>Impact & Metrics:</h5>
                              <ul style={detailsListStyle}>
                                {exp.details.impact.map((impact, i) => (
                                  <li key={i} style={detailsItemStyle}>
                                    <div style={bulletStyle}></div>
                                    {impact}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Experience