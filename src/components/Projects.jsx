import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, Code, Globe } from 'lucide-react'

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
        github: "https://github.com/d-malhotra2020/portfolioWebsite/tree/main/projects/smart-home-automation",
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
        github: "https://github.com/d-malhotra2020/portfolioWebsite/tree/main/projects/financial-analysis-tool",
        live: "https://financial-analysis-production.up.railway.app"
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
        github: "https://github.com/d-malhotra2020/portfolioWebsite/tree/main/projects/traffic-optimization",
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
        github: "https://github.com/d-malhotra2020/portfolioWebsite/tree/main/projects/video-analytics",
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
        github: "https://github.com/d-malhotra2020/portfolioWebsite/tree/main/projects/donation-platform",
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
        staggerChildren: 0.1
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
    <section id="projects" className="section">
      <motion.div 
        className="content-container"
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 variants={itemVariants}>Featured Projects</motion.h2>

        {/* Project Filters */}
        <motion.div className="project-filters" variants={itemVariants}>
          {filters.map(filter => (
            <button
              key={filter.key}
              className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div className="projects-grid" variants={containerVariants}>
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={index}
              className="project-card"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              layout
            >
              <div className="project-header">
                <h3>{project.title}</h3>
                <div className="project-type">{project.type}</div>
              </div>
              
              <p>{project.description}</p>
              
              <div className="project-highlights">
                {project.highlights.map((highlight, i) => (
                  <div key={i} className="highlight-item">
                    <span className="highlight-label">{highlight.label}:</span>
                    <span>{highlight.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="tech-stack">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <div className="project-links">
                {project.links.github && (
                  <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project-link"
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
                    className="project-link"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Projects