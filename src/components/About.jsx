import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const principles = [
  {
    n: '01',
    h: 'Reliability over cleverness',
    p: 'I uncovered a critical PATCH vulnerability that allowed removal of required fields in production. Fix shipped same-day. Boring code that fails loudly beats elegant code that fails silently.',
    link: { href: '#/writing/patch-vulnerability', label: 'Read the case study →' }
  },
  {
    n: '02',
    h: 'Measure the system',
    p: 'P95/P99 latency baselines, 3,100+ alerts analyzed, 10,100+ notifications correlated. If you can\'t observe it, you can\'t improve it. Everything I ship is instrumented.'
  },
  {
    n: '03',
    h: 'Test in adversarial mode',
    p: 'I write 1,000+ unit tests not to feel safe — but to break the system. Concurrency, retries, cooloff, webhook race conditions. The interesting failures live there.'
  }
]

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })

  const stagger = { visible: { transition: { staggerChildren: 0.08 } } }
  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 1] } }
  }

  return (
    <section id="about" className="section">
      <div className="shell">
        <div className="section-marker">
          <span className="tag"><span className="dot" /> // 01 · about()</span>
          <h2>Engineer first. <span className="em">Generalist</span> by training.</h2>
        </div>

        <motion.div
          ref={ref}
          className="about-card"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className="about-l" variants={item}>
            <img
              className="about-portrait"
              src="/ImageFiles/profilePhoto.jpeg"
              alt="Dhruv Malhotra"
            />
            <div className="about-meta">
              <div className="row"><span className="k">role</span><span className="v">SDET</span></div>
              <div className="row"><span className="k">company</span><span className="v">Brivo</span></div>
              <div className="row"><span className="k">years exp</span><span className="v">6+</span></div>
              <div className="row"><span className="k">location</span><span className="v">Austin, TX</span></div>
              <div className="row"><span className="k">timezone</span><span className="v">UTC −6</span></div>
              <div className="row"><span className="k">clearance</span><span className="v">eligible</span></div>
              <div className="row"><span className="k">prior</span><span className="v">USN Corpsman</span></div>
            </div>
          </motion.div>

          <motion.div className="about-r" variants={item}>
            <h3 className="about-lede">
              I started in the Navy keeping <em>4,500 servicemembers alive</em> and graduated
              into building the systems that keep millions of users transacting safely.
            </h3>
            <p>
              Today I'm a <strong>Software Engineer in Test at Brivo</strong> (formerly Eagle
              Eye Networks), where I built a multi-cluster Python/Flask synthetic monitoring
              platform validating notification pipelines across <strong>26 production
              environments in 6 global regions</strong>.
            </p>
            <p>
              Before that — four years at Givelify shipping a PyTorch recommender to
              <strong> 1.5M users</strong>, and 15 months at Yunex Traffic simulating
              <strong> 3,000+ intersections</strong> to validate signal coordination at city
              scale. I'm a <strong>security clearance eligible veteran</strong> — five years
              US Navy before pivoting to software.
            </p>
            <p>
              I work alongside <strong>Claude Code, Codex, and Gemini</strong> daily — LLM
              tooling is a force multiplier I lean into, not a curiosity. The LLM-augmented
              QA workflow I built at Brivo collapsed manual testing cycles from days to
              ~15 minutes; the chat dock on this page is itself a small demo of how I think
              about agentic systems.
            </p>
            <p>
              The throughline: I find the failure modes nobody else does, document them, and
              leave systems measurably more resilient than I found them.
            </p>

            <motion.div className="principle-list" variants={stagger}>
              {principles.map((p) => (
                <motion.div className="principle" key={p.n} variants={item}>
                  <div className="num">{p.n}/</div>
                  <div>
                    <h4>{p.h}</h4>
                    <p>{p.p}</p>
                    {p.link && (
                      <a className="principle-link" href={p.link.href}>
                        {p.link.label}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
