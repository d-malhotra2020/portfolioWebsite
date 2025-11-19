import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const FloatingCode = ({ theme }) => {
  // Don't show floating code for GitHub theme (light theme)
  if (theme === 'github') {
    return null
  }
  const [codeElements, setCodeElements] = useState([])
  
  const codeSnippets = [
    'function developWebsite()',
    'const skills = ["Python", "JavaScript"]',
    'if (problem) { solve(); }',
    'return "Hello World";',
    'async/await fetchData()',
    'class SoftwareDeveloper {}',
    'import React from "react"',
    'git commit -m "feature"',
    'npm install dependencies',
    'docker run --name app',
    'SELECT * FROM experience',
    'while(learning) { code(); }',
    'export default Portfolio',
    'console.log("Drew Malhotra")',
    'try { innovate(); } catch(e)',
    'let passion = "coding"',
    'kubectl apply -f deploy.yml',
    'pip install requirements',
    'terraform apply --auto-approve'
  ]

  useEffect(() => {
    const createFloatingCode = () => {
      const id = Date.now() + Math.random()
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      const newElement = {
        id,
        text: snippet,
        x: Math.random() * 100,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5
      }

      setCodeElements(prev => [...prev, newElement])

      // Remove after animation
      setTimeout(() => {
        setCodeElements(prev => prev.filter(el => el.id !== id))
      }, (newElement.duration + newElement.delay) * 1000)
    }

    // Create initial elements
    for (let i = 0; i < 5; i++) {
      setTimeout(createFloatingCode, i * 1000)
    }

    // Create new elements periodically
    const interval = setInterval(createFloatingCode, 3000)

    return () => clearInterval(interval)
  }, [codeSnippets])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -2,
        overflow: 'hidden'
      }}
    >
      {codeElements.map(element => (
        <motion.div
          key={element.id}
          initial={{ 
            y: '100vh', 
            opacity: 0,
            rotateZ: 0
          }}
          animate={{ 
            y: '-100px', 
            opacity: [0, 0.3, 0.3, 0],
            rotateZ: 360
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            ease: 'linear',
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: element.duration
            }
          }}
          style={{
            position: 'absolute',
            left: `${element.x}%`,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-comment)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {element.text}
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingCode