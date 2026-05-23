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
import './styles/App.css'

function App() {
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
