import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Puzzle, Users, BookOpen, Github, ExternalLink } from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

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

  const highlights = [
    {
      icon: <Puzzle size={24} />,
      title: 'Problem Solver',
      description: 'I thrive on breaking down complex challenges into manageable solutions.'
    },
    {
      icon: <Users size={24} />,
      title: 'Team Player',
      description: 'Collaborative development and knowledge sharing drive better outcomes.'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Continuous Learner',
      description: 'Always exploring new technologies and best practices in development.'
    }
  ]

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

  const introStyle = {
    fontSize: '1.125rem',
    lineHeight: '1.75',
    color: '#e4e4e7',
    marginBottom: '3rem',
    maxWidth: '48rem'
  }

  const highlightsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  }

  const highlightCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '1rem',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }

  const highlightIconStyle = {
    color: '#3b82f6',
    marginBottom: '0.5rem'
  }

  const highlightTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '0.5rem'
  }

  const highlightDescStyle = {
    color: '#a1a1aa',
    lineHeight: '1.6'
  }

  const githubSectionStyle = {
    marginTop: '4rem'
  }

  const githubTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const githubSubtitleStyle = {
    color: '#a1a1aa',
    marginBottom: '2rem'
  }

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  }

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center'
  }

  const statCardTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: '1rem'
  }

  const githubImageStyle = {
    width: '100%',
    borderRadius: '0.5rem'
  }

  const githubLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.75rem 1.5rem',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    transition: 'all 0.2s ease'
  }

  return (
    <section id="about" style={sectionStyle}>
      <motion.div 
        style={containerStyle}
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} style={headingStyle}>
          <div style={accentBarStyle}></div>
          About Me
        </motion.div>

        <motion.div variants={itemVariants} style={introStyle}>
          <p style={{ marginBottom: '1.5rem' }}>
            Hello! I'm Dhruv (you can call me Drew if that's easier to pronounce), a passionate 
            software developer who loves creating innovative solutions and tackling complex problems. 
            I enjoy working with cutting-edge technologies and continuously learning new skills.
          </p>
          <p>
            Currently, I'm focused on building full-stack applications and exploring the latest trends 
            in software development. I believe in writing clean, efficient code and creating user 
            experiences that make a difference.
          </p>
        </motion.div>

        <motion.div 
          style={highlightsGridStyle}
          variants={containerVariants}
        >
          {highlights.map((highlight, index) => (
            <motion.div 
              key={index}
              style={highlightCardStyle}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div style={highlightIconStyle}>{highlight.icon}</div>
              <h3 style={highlightTitleStyle}>{highlight.title}</h3>
              <p style={highlightDescStyle}>{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          style={githubSectionStyle}
          variants={itemVariants}
        >
          <h3 style={githubTitleStyle}>
            Developer Activity
          </h3>
          <p style={githubSubtitleStyle}>
            Here's a snapshot of my recent coding activity and GitHub contributions:
          </p>
          
          <div style={statsGridStyle}>
            <motion.div 
              style={statCardStyle}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h4 style={statCardTitleStyle}>Contribution Heatmap</h4>
              <div>
                <img 
                  src="https://ghchart.rshah.org/216e39/d-malhotra2020" 
                  alt="GitHub Contribution Heatmap" 
                  style={githubImageStyle}
                  onError={(e) => {
                    e.target.parentElement.innerHTML = `
                      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.5rem; padding: 2rem;">
                        <div style="font-size: 2rem;">📊</div>
                        <div style="text-align: center;">
                          <h5 style="color: #f4f4f5; margin: 0 0 0.5rem 0;">GitHub Activity</h5>
                          <p style="color: #a1a1aa; margin: 0;">Visit my <a href="https://github.com/d-malhotra2020" target="_blank" style="color: #3b82f6;">GitHub profile</a> to see my contribution history</p>
                        </div>
                      </div>
                    `
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              style={statCardStyle}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h4 style={statCardTitleStyle}>Coding Streak</h4>
              <div>
                <img 
                  src="https://streak-stats.demolab.com/?user=d-malhotra2020&theme=dark&background=0d1117&stroke=4CAF50&ring=4CAF50&fire=4CAF50&currStreakLabel=ffffff&sideLabels=ffffff&currStreakNum=4CAF50&sideNums=4CAF50&dates=cccccc" 
                  alt="GitHub Streak" 
                  style={githubImageStyle}
                  onError={(e) => {
                    e.target.parentElement.innerHTML = `
                      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.5rem; padding: 2rem;">
                        <div style="font-size: 2rem;">🔥</div>
                        <div style="text-align: center;">
                          <h5 style="color: #f4f4f5; margin: 0 0 0.5rem 0;">Coding Consistency</h5>
                          <p style="color: #a1a1aa; margin: 0;">Regular contributor maintaining consistent development activity</p>
                        </div>
                      </div>
                    `
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              style={statCardStyle}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h4 style={statCardTitleStyle}>Most Used Languages</h4>
              <div>
                <img 
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=d-malhotra2020&layout=compact&theme=dark&hide_border=false&bg_color=0d1117&text_color=ffffff&title_color=4CAF50&border_color=4CAF50&cache_seconds=86400" 
                  alt="Most Used Languages" 
                  style={githubImageStyle}
                  onError={(e) => {
                    e.target.parentElement.innerHTML = `
                      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.5rem; padding: 2rem;">
                        <div style="font-size: 2rem;">💻</div>
                        <div style="text-align: center;">
                          <h5 style="color: #f4f4f5; margin: 0 0 1rem 0;">Programming Languages</h5>
                          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                            <span style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">Python</span>
                            <span style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">JavaScript</span>
                            <span style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">HTML/CSS</span>
                            <span style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">Java</span>
                          </div>
                        </div>
                      </div>
                    `
                  }}
                />
              </div>
            </motion.div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <motion.a 
              href="https://github.com/d-malhotra2020" 
              target="_blank" 
              rel="noopener noreferrer"
              style={githubLinkStyle}
              whileHover={{ y: -2, scale: 1.05 }}
            >
              <Github size={20} />
              View Full GitHub Profile
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default About