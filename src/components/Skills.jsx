import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Palette, Cog, Cloud, Brain, Wrench, Smartphone } from 'lucide-react'

const Skills = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Palette size={24} />,
      size: "large",
      skills: ["React", "JavaScript", "HTML/CSS", "TypeScript", "Vue.js", "Framer Motion"]
    },
    {
      title: "Backend Development", 
      icon: <Cog size={24} />,
      size: "large",
      skills: ["Python", "Node.js", "FastAPI", "Django", "Flask", "REST APIs"]
    },
    {
      title: "Database & Cloud",
      icon: <Cloud size={20} />,
      size: "small",
      skills: ["PostgreSQL", "AWS", "Docker", "Kubernetes", "Redis", "MongoDB"]
    },
    {
      title: "AI/ML & Data Science",
      icon: <Brain size={20} />,
      size: "small",
      skills: ["TensorFlow", "PyTorch", "Pandas", "Scikit-learn", "NumPy", "Data Analysis"]
    },
    {
      title: "DevOps & Testing",
      icon: <Wrench size={20} />,
      size: "small",
      skills: ["Git", "CI/CD", "Pytest", "Jest", "Linux", "Performance Testing"]
    },
    {
      title: "Mobile & IoT",
      icon: <Smartphone size={20} />,
      size: "small",
      skills: ["React Native", "Raspberry Pi", "MQTT", "Mobile Development", "IoT Systems", "Sensor Integration"]
    }
  ]

  const coreCompetencies = [
    {
      title: "Full-Stack Development",
      description: "End-to-end web application development with modern frameworks and best practices"
    },
    {
      title: "Performance Optimization",
      description: "System optimization, load testing, and scalable architecture design"
    },
    {
      title: "AI/ML Integration",
      description: "Machine learning model development and integration into production systems"
    },
    {
      title: "Cloud Architecture",
      description: "AWS cloud infrastructure, containerization, and DevOps practices"
    }
  ]

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

  const skillsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '4rem'
  }

  const skillCardBaseStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '1rem',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  }

  const skillCardLargeStyle = {
    ...skillCardBaseStyle,
    gridRow: 'span 2'
  }

  const skillCardSmallStyle = {
    ...skillCardBaseStyle,
    gridRow: 'span 1'
  }

  const skillHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  }

  const skillIconStyle = {
    color: '#3b82f6'
  }

  const skillTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f4f4f5',
    margin: 0
  }

  const skillTagsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  }

  const skillTagStyle = {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    padding: '0.5rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  }

  const competenciesSectionStyle = {
    marginTop: '3rem'
  }

  const competenciesTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const competenciesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  }

  const competencyCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '1rem',
    padding: '2rem'
  }

  const competencyTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '0.75rem'
  }

  const competencyDescStyle = {
    color: '#a1a1aa',
    lineHeight: '1.6'
  }

  return (
    <section id="skills" style={sectionStyle}>
      <motion.div 
        style={containerStyle}
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} style={headingStyle}>
          <div style={accentBarStyle}></div>
          Skills & Technologies
        </motion.div>
        
        <motion.div style={skillsGridStyle} variants={containerVariants}>
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index}
              style={category.size === 'large' ? skillCardLargeStyle : skillCardSmallStyle}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div style={skillHeaderStyle}>
                <div style={skillIconStyle}>{category.icon}</div>
                <h3 style={skillTitleStyle}>{category.title}</h3>
              </div>
              
              <div style={skillTagsStyle}>
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    style={skillTagStyle}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: skillIndex * 0.05,
                      ease: 'easeOut'
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          style={competenciesSectionStyle}
          variants={itemVariants}
        >
          <h3 style={competenciesTitleStyle}>
            Core Competencies
          </h3>
          <motion.div style={competenciesGridStyle} variants={containerVariants}>
            {coreCompetencies.map((competency, index) => (
              <motion.div 
                key={index}
                style={competencyCardStyle}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <h4 style={competencyTitleStyle}>{competency.title}</h4>
                <p style={competencyDescStyle}>{competency.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Skills