import React, { lazy, Suspense, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatusBoard from './components/StatusBoard'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import AgentDock from './components/AgentDock'
import KeyboardShortcutsOverlay from './components/KeyboardShortcutsOverlay'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import { useHashRoute, matchRoute } from './lib/router'
import './styles/App.css'

// Non-home routes (and the markdown they pull in) load on demand to keep the landing bundle small.
const WritingIndex = lazy(() => import('./components/WritingIndex'))
const WritingPost = lazy(() => import('./components/WritingPost'))
const WorkPost = lazy(() => import('./components/WorkPost'))
const Resume = lazy(() => import('./components/Resume'))

function App() {
  const path = useHashRoute()
  const route = matchRoute(path)

  const [helpOpen, setHelpOpen] = useState(false)
  useKeyboardShortcuts({
    onToggleHelp: () => setHelpOpen((o) => !o),
    isHelpOpen: helpOpen
  })
  const closeHelp = () => setHelpOpen(false)

  if (route.kind === 'writing-index') {
    return (
      <div className="app">
        <ScrollProgress />
        <Suspense fallback={null}><WritingIndex /></Suspense>
        <AgentDock />
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  if (route.kind === 'writing-post') {
    return (
      <div className="app">
        <ScrollProgress />
        <Suspense fallback={null}><WritingPost slug={route.slug} /></Suspense>
        <AgentDock />
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  if (route.kind === 'work-post') {
    return (
      <div className="app">
        <ScrollProgress />
        <Suspense fallback={null}><WorkPost slug={route.slug} /></Suspense>
        <AgentDock />
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  if (route.kind === 'resume') {
    return (
      <div className="app resume-app">
        <Suspense fallback={null}><Resume /></Suspense>
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  return (
    <div className="app">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <StatusBoard />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <AgentDock />
      <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
    </div>
  )
}

export default App
