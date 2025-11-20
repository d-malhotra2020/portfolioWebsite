import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Skills = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: "🎨",
      skills: [
        { name: "React", level: 90 },
        { name: "JavaScript", level: 95 },
        { name: "HTML/CSS", level: 92 },
        { name: "TypeScript", level: 85 },
        { name: "Vue.js", level: 78 },
        { name: "Framer Motion", level: 88 }
      ]
    },
    {
      title: "Backend Development", 
      icon: "⚙️",
      skills: [
        { name: "Python", level: 95 },
        { name: "Node.js", level: 85 },
        { name: "FastAPI", level: 88 },
        { name: "Django", level: 82 },
        { name: "Flask", level: 85 },
        { name: "REST APIs", level: 92 }
      ]
    },
    {
      title: "Database & Cloud",
      icon: "☁️",
      skills: [
        { name: "PostgreSQL", level: 88 },
        { name: "AWS", level: 85 },
        { name: "Docker", level: 90 },
        { name: "Kubernetes", level: 78 },
        { name: "Redis", level: 80 },
        { name: "MongoDB", level: 75 }
      ]
    },
    {
      title: "AI/ML & Data Science",
      icon: "🤖",
      skills: [
        { name: "TensorFlow", level: 85 },
        { name: "PyTorch", level: 82 },
        { name: "Pandas", level: 90 },
        { name: "Scikit-learn", level: 88 },
        { name: "NumPy", level: 92 },
        { name: "Data Analysis", level: 90 }
      ]
    },
    {
      title: "DevOps & Testing",
      icon: "🔧",
      skills: [
        { name: "Git", level: 95 },
        { name: "CI/CD", level: 85 },
        { name: "Pytest", level: 90 },
        { name: "Jest", level: 82 },
        { name: "Linux", level: 88 },
        { name: "Performance Testing", level: 85 }
      ]
    },
    {
      title: "Mobile & IoT",
      icon: "📱",
      skills: [
        { name: "React Native", level: 78 },
        { name: "Raspberry Pi", level: 85 },
        { name: "MQTT", level: 80 },
        { name: "Mobile Development", level: 75 },
        { name: "IoT Systems", level: 82 },
        { name: "Sensor Integration", level: 85 }
      ]
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

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const skillBarVariants = {
    hidden: { width: 0 },
    visible: (level) => ({
      width: `${level}%`,
      transition: {
        duration: 1.5,
        delay: 0.2,
        ease: "easeOut"
      }
    })
  }

  return (
    <section id="skills" className="section">
      <motion.div 
        className="content-container"
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 variants={categoryVariants}>Skills & Technologies</motion.h2>
        
        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div 
              key={categoryIndex}
              className="skill-category"
              variants={categoryVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <h3>
                <span className="skill-icon">{category.icon}</span>
                {category.title}
              </h3>
              
              <div className="skill-bars">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-bar">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-progress">
                      <motion.div
                        className="skill-fill"
                        custom={skill.level}
                        variants={skillBarVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Summary */}
        <motion.div 
          className="skills-summary"
          variants={categoryVariants}
        >
          <h3>🎯 Core Competencies</h3>
          <div className="competencies-grid">
            <div className="competency-item">
              <h4>Full-Stack Development</h4>
              <p>End-to-end web application development with modern frameworks and best practices</p>
            </div>
            <div className="competency-item">
              <h4>Performance Optimization</h4>
              <p>System optimization, load testing, and scalable architecture design</p>
            </div>
            <div className="competency-item">
              <h4>AI/ML Integration</h4>
              <p>Machine learning model development and integration into production systems</p>
            </div>
            <div className="competency-item">
              <h4>Cloud Architecture</h4>
              <p>AWS cloud infrastructure, containerization, and DevOps practices</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Skills