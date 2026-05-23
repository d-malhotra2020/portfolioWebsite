import React from 'react'
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
import { useHashRoute, matchRoute } from './lib/router'
import './styles/App.css'

function App() {
  const path = useHashRoute()
  const route = matchRoute(path)

  if (route.kind === 'writing-index') {
    return (
      <div className="app">
        <ScrollProgress />
        <WritingIndex />
        <AgentDock />
      </div>
    )
  }

  if (route.kind === 'writing-post') {
    return (
      <div className="app">
        <ScrollProgress />
        <WritingPost slug={route.slug} />
        <AgentDock />
      </div>
    )
  }

  if (route.kind === 'work-post') {
    return (
      <div className="app">
        <ScrollProgress />
        <WorkPost slug={route.slug} />
        <AgentDock />
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
    </div>
  )
}

export default App
