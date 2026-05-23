import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const blocks = [
  {
    n: '01',
    h: 'Backend & APIs',
    skills: ['Python', 'Flask', 'Django', 'FastAPI', 'aiohttp', 'Node.js', 'REST', 'GraphQL', 'pytest-django']
  },
  {
    n: '02',
    h: 'Test & Quality',
    skills: ['pytest', 'JUnit', 'Postman', 'Load testing', 'Synthetic monitoring', 'Chaos eng.', 'CI/CD', 'Jenkins']
  },
  {
    n: '03',
    h: 'Cloud & Infra',
    skills: ['AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'MongoDB', 'Linux', 'Microservices']
  },
  {
    n: '04',
    h: 'AI / ML',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'LLM workflows', 'Time-series']
  },
  {
    n: '05',
    h: 'Frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Framer Motion', 'HTML/CSS', 'Vue.js']
  },
  {
    n: '06',
    h: 'Edge & IoT',
    skills: ['Raspberry Pi', 'MQTT', 'Sensor integration', 'Embedded testing', 'NTCIP', 'Real-time']
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
