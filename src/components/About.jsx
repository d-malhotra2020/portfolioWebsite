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

  const highlights = [
    {
      icon: <Puzzle size={32} />,
      title: '🧩 Problem Solver',
      description: 'I thrive on breaking down complex challenges into manageable solutions.'
    },
    {
      icon: <Users size={32} />,
      title: '🤝 Team Player',
      description: 'Collaborative development and knowledge sharing drive better outcomes.'
    },
    {
      icon: <BookOpen size={32} />,
      title: '📚 Continuous Learner',
      description: 'Always exploring new technologies and best practices in development.'
    }
  ]

  return (
    <section id="about" className="section">
      <motion.div 
        className="content-container"
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="code-block-header">
          <div className="window-controls">
            <div className="control close"></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <span className="code-filename">about.js</span>
        </div>

        <motion.h2 variants={itemVariants}>
          <span className="code-keyword">function</span>{' '}
          <span className="code-function">getAboutMe</span>() {' '}
          <span className="code-bracket">{'{'}</span>
        </motion.h2>

        <div className="about-content">
          <motion.p variants={itemVariants}>
            Hello! I'm Dhruv (you can call me Drew if that's easier to pronounce), a passionate 
            software developer who loves creating innovative solutions and tackling complex problems. 
            I enjoy working with cutting-edge technologies and continuously learning new skills.
          </motion.p>

          <motion.p variants={itemVariants}>
            Currently, I'm focused on building full-stack applications and exploring the latest trends 
            in software development. I believe in writing clean, efficient code and creating user 
            experiences that make a difference.
          </motion.p>

          <motion.div 
            className="about-highlights"
            variants={containerVariants}
          >
            {highlights.map((highlight, index) => (
              <motion.div 
                key={index}
                className="highlight"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="highlight-icon">{highlight.icon}</div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Developer Activity Section */}
          <motion.div 
            className="developer-activity"
            variants={itemVariants}
          >
            <h3>📈 Developer Activity</h3>
            <p>Here's a snapshot of my recent coding activity and GitHub contributions:</p>
            
            <div className="github-stats-grid">
              {/* GitHub Contribution Heatmap */}
              <motion.div 
                className="github-stat-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <h4>📅 Contribution Heatmap</h4>
                <div className="heatmap-container">
                  <img 
                    src="https://ghchart.rshah.org/216e39/d-malhotra2020" 
                    alt="GitHub Contribution Heatmap" 
                    className="github-heatmap"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = `
                        <div class="github-fallback">
                          <div class="fallback-icon">📊</div>
                          <div class="fallback-text">
                            <h5>GitHub Activity</h5>
                            <p>Visit my <a href="https://github.com/d-malhotra2020" target="_blank">GitHub profile</a> to see my contribution history</p>
                          </div>
                        </div>
                      `
                    }}
                  />
                </div>
              </motion.div>
              
              {/* GitHub Streak */}
              <motion.div 
                className="github-stat-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <h4>🔥 Coding Streak</h4>
                <div className="streak-container">
                  <img 
                    src="https://streak-stats.demolab.com/?user=d-malhotra2020&theme=dark&background=0d1117&stroke=4CAF50&ring=4CAF50&fire=4CAF50&currStreakLabel=ffffff&sideLabels=ffffff&currStreakNum=4CAF50&sideNums=4CAF50&dates=cccccc" 
                    alt="GitHub Streak" 
                    className="github-streak"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = `
                        <div class="github-fallback">
                          <div class="fallback-icon">🔥</div>
                          <div class="fallback-text">
                            <h5>Coding Consistency</h5>
                            <p>Regular contributor maintaining consistent development activity</p>
                          </div>
                        </div>
                      `
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Most Used Languages */}
              <motion.div 
                className="github-stat-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <h4>💻 Most Used Languages</h4>
                <div className="languages-container">
                  <img 
                    src="https://github-readme-stats.vercel.app/api/top-langs/?username=d-malhotra2020&layout=compact&theme=dark&hide_border=false&bg_color=0d1117&text_color=ffffff&title_color=4CAF50&border_color=4CAF50&cache_seconds=86400" 
                    alt="Most Used Languages" 
                    className="github-languages"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = `
                        <div class="github-fallback">
                          <div class="fallback-icon">💻</div>
                          <div class="fallback-text">
                            <h5>Programming Languages</h5>
                            <div class="fallback-languages">
                              <span class="lang-tag">Python</span>
                              <span class="lang-tag">JavaScript</span>
                              <span class="lang-tag">HTML/CSS</span>
                              <span class="lang-tag">Java</span>
                            </div>
                          </div>
                        </div>
                      `
                    }}
                  />
                </div>
              </motion.div>
            </div>
            
            <div className="github-link-container">
              <motion.a 
                href="https://github.com/d-malhotra2020" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-profile-link"
                whileHover={{ y: -2, scale: 1.05 }}
              >
                <Github size={20} />
                View Full GitHub Profile
                <ExternalLink size={16} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            className="code-closing"
            variants={itemVariants}
          >
            <span className="code-bracket">{'}'}</span>{' '}
            <span className="code-comment">// End getAboutMe()</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default About