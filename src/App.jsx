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
import { useVisitorTracking } from './hooks/useVisitorTracking'
import './styles/App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { stats, showVisitorCounter, setShowVisitorCounter } = useVisitorTracking()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.02) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />
      
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

      <Navbar />
      
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