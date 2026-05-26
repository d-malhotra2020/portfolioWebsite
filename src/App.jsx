import React, { useState } from 'react'
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
import WritingIndex from './components/WritingIndex'
import WritingPost from './components/WritingPost'
import WorkPost from './components/WorkPost'
import Resume from './components/Resume'
import KeyboardShortcutsOverlay from './components/KeyboardShortcutsOverlay'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import { useHashRoute, matchRoute } from './lib/router'
import './styles/App.css'

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
        <WritingIndex />
        <AgentDock />
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  if (route.kind === 'writing-post') {
    return (
      <div className="app">
        <ScrollProgress />
        <WritingPost slug={route.slug} />
        <AgentDock />
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  if (route.kind === 'work-post') {
    return (
      <div className="app">
        <ScrollProgress />
        <WorkPost slug={route.slug} />
        <AgentDock />
        <KeyboardShortcutsOverlay open={helpOpen} onClose={closeHelp} />
      </div>
    )
  }

  if (route.kind === 'resume') {
    return (
      <div className="app resume-app">
        <Resume />
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
