import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'
import VisitorCounter from './components/VisitorCounter'
import ParticleSystem from './components/ParticleSystem'
import { useTheme } from './hooks/useTheme'
import { useVisitorTracking } from './hooks/useVisitorTracking'
import './styles/App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const { stats, showVisitorCounter, setShowVisitorCounter } = useVisitorTracking()

  useEffect(() => {
    // Hide loading screen after initial load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <ScrollProgress />
      
      <AnimatePresence>
        {showVisitorCounter && (
          <VisitorCounter 
            stats={stats} 
            onClose={() => setShowVisitorCounter(false)}
          />
        )}
      </AnimatePresence>

      <Navbar theme={theme} setTheme={setTheme} />
      
      <ParticleSystem theme={theme} />
      
      <main className="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  )
}

export default App