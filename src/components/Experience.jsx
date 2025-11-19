import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
      side: "left"
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
      skills: ["Python", "TensorFlow", "AWS", "Docker", "Kubernetes"],
      side: "right"
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
      skills: ["Python", "PyTorch", "React", "Google API"],
      side: "left"
    },
    {
      date: "Aug 2018 - Dec 2021",
      title: "Bachelor of Science in Computer Science",
      company: "University of Texas at Dallas",
      description: "Completed comprehensive computer science education covering algorithms, data structures, software engineering principles, and database management systems.",
      skills: ["Algorithms", "Data Structures", "Software Engineering", "Database Systems"],
      side: "right"
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
      skills: ["JUnit", "Jira", "QA Testing", "Regression Testing"],
      side: "left"
    },
    {
      date: "Jul 2011 - Jul 2016",
      title: "Navy Corpsman",
      company: "United States Navy, Okinawa JP",
      description: "Managed medical care for 4,500 servicemembers including checkups, immunizations, and preventative care. Attached to S-2 Security and Intelligence Division ensuring security clearances for 3,000 servicemembers.",
      skills: ["Healthcare", "Security Clearance", "Leadership", "Operations"],
      side: "right"
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  return (
    <section id="experience" className="section">
      <motion.div 
        className="content-container"
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 variants={itemVariants}>Experience & Education</motion.h2>
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              className={`timeline-item ${exp.side === 'right' ? 'timeline-item-right' : 'timeline-item-left'}`}
              variants={itemVariants}
            >
              <div className="timeline-date">{exp.date}</div>
              <div className="timeline-content">
                <h3>{exp.title}</h3>
                <h4>{exp.company}</h4>
                <p>{exp.description}</p>
                
                {exp.details && (
                  <div className={`timeline-details ${expandedItems[index] ? 'expanded' : ''}`} style={{display: expandedItems[index] ? 'block' : 'none'}}>
                    <div className="detail-section">
                      <h5>🔧 Key Projects & Achievements:</h5>
                      <ul>
                        {exp.details.projects?.map((project, i) => (
                          <li key={i}><strong>{project.split(':')[0]}:</strong> {project.split(':')[1]}</li>
                        ))}
                      </ul>
                    </div>
                    {exp.details.impact && (
                      <div className="detail-section">
                        <h5>📊 Impact & Metrics:</h5>
                        <ul>
                          {exp.details.impact.map((impact, i) => (
                            <li key={i}>{impact}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="timeline-skills">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="timeline-tag">{skill}</span>
                  ))}
                </div>
                
                {exp.details && (
                  <button 
                    className={`timeline-expand-btn ${expandedItems[index] ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(index)}
                  >
                    <span className="expand-text">
                      {expandedItems[index] ? 'Hide Details' : 'View Details'}
                    </span>
                    <span className="expand-icon">
                      {expandedItems[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Experience