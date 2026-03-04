import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink } from 'lucide-react'

const Projects = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const [activeFilter, setActiveFilter] = useState('all')

  const projects = [
    {
      title: "Portfolio Website",
      type: "Full Stack",
      category: "web",
      description: "A modern, responsive portfolio website showcasing my software engineering journey and projects. Features include multiple theme support, interactive animations, and seamless user experience.",
      highlights: [
        { label: "Framework", value: "React + Vite" },
        { label: "Styling", value: "CSS3 + Framer Motion" },
        { label: "Features", value: "5 Themes, Animations" },
        { label: "Deployment", value: "GitHub Pages" }
      ],
      techStack: ["React", "JavaScript", "CSS3", "Framer Motion", "Vite"],
      links: {
        github: "https://github.com/d-malhotra2020/portfolioWebsite",
        live: "https://d-malhotra2020.github.io/portfolioWebsite/"
      }
    },
    {
      title: "Smart Home Automation System",
      type: "IoT Project",
      category: "iot",
      description: "An intelligent home automation system that integrates various IoT devices and sensors to create a seamless smart home experience. Features include automated lighting, climate control, and security monitoring.",
      highlights: [
        { label: "Devices", value: "15+ IoT Sensors" },
        { label: "Control", value: "Mobile + Voice" },
        { label: "Energy", value: "30% Savings" },
        { label: "Response", value: "<500ms Latency" }
      ],
      techStack: ["Python", "Raspberry Pi", "MQTT", "Flask", "SQLite"],
      links: {
        github: "https://github.com/d-malhotra2020/smart-home-automation",
        live: "https://smart-home-automation-production.up.railway.app"
      }
    },
    {
      title: "Financial Data Analysis Tool",
      type: "Data Science",
      category: "data",
      description: "A comprehensive financial analysis platform that processes market data, performs risk analysis, and generates investment insights using machine learning algorithms and real-time data feeds.",
      highlights: [
        { label: "Data Points", value: "1M+ Daily" },
        { label: "Models", value: "ML + Statistical" },
        { label: "Accuracy", value: "94% Prediction" },
        { label: "Processing", value: "Real-time" }
      ],
      techStack: ["Python", "Pandas", "Scikit-learn", "PostgreSQL", "FastAPI"],
      links: {
        github: "https://github.com/d-malhotra2020/financial-analysis-tool",
        live: "https://financial-analysis-tool-production.up.railway.app"
      }
    },
    {
      title: "Traffic Flow Optimization Engine",
      type: "AI/ML System",
      category: "ai",
      description: "Advanced traffic management system using AI to optimize traffic flow in urban environments. Implements predictive analytics and real-time adaptive signal control for improved city mobility.",
      highlights: [
        { label: "Intersections", value: "3000+ Managed" },
        { label: "Efficiency", value: "15% Improvement" },
        { label: "Technology", value: "TensorFlow + AWS" },
        { label: "Scale", value: "Multi-city Deploy" }
      ],
      techStack: ["Python", "TensorFlow", "AWS", "Docker", "Kubernetes"],
      links: {
        github: "https://github.com/d-malhotra2020/traffic-optimization",
        live: "https://traffic-optimization-production.up.railway.app"
      }
    },
    {
      title: "Video Surveillance Analytics Platform",
      type: "Cloud Application",
      category: "cloud",
      description: "Cloud-based video analytics platform for enterprise security solutions. Features AI-powered threat detection, real-time alerts, and scalable video processing infrastructure.",
      highlights: [
        { label: "Cameras", value: "500+ Streams" },
        { label: "Detection", value: "AI-Powered" },
        { label: "Alerts", value: "4600+ Processed" },
        { label: "Accuracy", value: "92% Correlation" }
      ],
      techStack: ["Python", "aiohttp", "Docker", "PostgreSQL", "Computer Vision"],
      links: {
        github: "https://github.com/d-malhotra2020/video-analytics",
        live: "https://video-analytics-production.up.railway.app"
      }
    },
    {
      title: "Donation Platform Enhancement",
      type: "Mobile Application",
      category: "mobile",
      description: "Enhanced mobile giving platform with AI-powered recommendation engine, improved search capabilities, and optimized donation workflows serving millions of users.",
      highlights: [
        { label: "Users", value: "1.5M+ Active" },
        { label: "Organizations", value: "70K+ Served" },
        { label: "Retention", value: "25% Increase" },
        { label: "Performance", value: "35% Faster" }
      ],
      techStack: ["Python", "PyTorch", "React", "Mobile Development"],
      links: {
        github: "https://github.com/d-malhotra2020/donation-platform",
        live: "https://donation-platform-production.up.railway.app"
      }
    }
  ]

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Dev' },
    { key: 'ai', label: 'AI/ML' },
    { key: 'data', label: 'Data Science' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'iot', label: 'IoT' },
    { key: 'mobile', label: 'Mobile' }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  }

  const techStackColors = {
    React: '#3B82F6',
    JavaScript: '#F59E0B',
    Python: '#10B981',
    TypeScript: '#3B82F6',
    Node: '#059669',
    Docker: '#0EA5E9',
    AWS: '#F97316',
    TensorFlow: '#EF4444',
    PostgreSQL: '#8B5CF6',
    MongoDB: '#10B981'
  }

  const getTechColor = (tech) => techStackColors[tech] || '#6B7280'

  return (
    <section id="projects" style={{
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
            marginBottom: '64px'
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
            Featured Projects
          </h2>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '64px',
            justifyContent: 'center'
          }}
        >
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              style={{
                padding: '12px 24px',
                borderRadius: '24px',
                border: activeFilter === filter.key 
                  ? 'none' 
                  : '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: activeFilter === filter.key 
                  ? '#3B82F6' 
                  : 'rgba(255, 255, 255, 0.03)',
                color: activeFilter === filter.key ? '#ffffff' : '#E4E4E7',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '32px'
          }}
          variants={containerVariants}
          layout
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={`${activeFilter}-${index}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '24px',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#F4F4F5',
                    margin: '0 0 8px 0',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    {project.title}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#93C5FD',
                    fontSize: '12px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {project.type}
                  </div>
                </div>
                
                <p style={{
                  color: '#A1A1AA',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  margin: '0 0 24px 0',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  {project.description}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '24px'
                }}>
                  {project.highlights.map((highlight, i) => (
                    <div 
                      key={i} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.04)'
                      }}
                    >
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#71717A',
                        minWidth: 'fit-content'
                      }}>
                        {highlight.label}:
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#E4E4E7'
                      }}>
                        {highlight.value}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '24px'
                }}>
                  {project.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      style={{
                        padding: '6px 12px',
                        backgroundColor: `${getTechColor(tech)}20`,
                        color: getTechColor(tech),
                        fontSize: '12px',
                        borderRadius: '16px',
                        fontWeight: '500',
                        border: `1px solid ${getTechColor(tech)}30`
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  {project.links.github && (
                    <a 
                      href={project.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#E4E4E7',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                  {project.links.live && (
                    <a 
                      href={project.links.live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: '#3B82F6',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2563EB'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#3B82F6'
                      }}
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Projects