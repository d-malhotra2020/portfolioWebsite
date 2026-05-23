import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const blocks = [
  {
    n: '01',
    h: 'Languages',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C/C++', 'Swift', 'HTML/CSS']
  },
  {
    n: '02',
    h: 'Backend & APIs',
    skills: ['Flask', 'Django', 'FastAPI', 'aiohttp', 'Node.js', 'REST', 'GraphQL', 'pytest-django', 'Microservices']
  },
  {
    n: '03',
    h: 'Test & Quality',
    skills: ['pytest', 'pytest-django', 'JUnit', 'Selenium', 'Playwright', 'Postman', 'k6', 'BDD', 'TDD', 'JIRA', 'Browserstack', 'Load testing', 'Synthetic monitoring', 'Chaos eng.']
  },
  {
    n: '04',
    h: 'Cloud · Infra · Monitoring',
    skills: ['AWS (EC2, Lambda, S3, CloudWatch)', 'Docker', 'Kubernetes', 'PostgreSQL', 'MySQL', 'Redis', 'MongoDB', 'Linux', 'Jenkins', 'GitHub Actions', 'Grafana', 'DataDog', 'Prometheus']
  },
  {
    n: '05',
    h: 'AI · ML · LLMs',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Time-series', 'Anomaly detection', 'Claude Code', 'Codex', 'Gemini', 'Anthropic API', 'LLM-augmented QA']
  },
  {
    n: '06',
    h: 'Frontend',
    skills: ['React', 'Vite', 'Framer Motion', 'HTML/CSS', 'Vue.js', 'Lucide']
  }
]

const Skills = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="skills" className="section">
      <div className="shell">
        <div className="section-marker">
          <span className="tag"><span className="dot" /> // 04 · stack.toolkit</span>
          <h2>The <span className="em">stack</span>, in inventory.</h2>
        </div>

        <motion.div
          ref={ref}
          className="cap-grid"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {blocks.map((b) => (
            <motion.div
              key={b.n}
              className="cap-block"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="cap-head">
                <h3 className="cap-title">{b.h}</h3>
                <span className="cap-icon">{b.n}/06</span>
              </div>
              <div className="cap-list">
                {b.skills.map((s, j) => (
                  <span key={j} className="pill">{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
