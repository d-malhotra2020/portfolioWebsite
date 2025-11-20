import React, { useRef, useEffect } from 'react'

const ParticleSystem = ({ theme }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Particle class
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        
        // Theme-based colors
        let color = '76, 175, 80' // Default green
        if (theme === 'dracula') color = '189, 147, 249'
        else if (theme === 'monokai') color = '253, 151, 31'
        else if (theme === 'github') color = '3, 102, 214'
        else if (theme === 'vscode') color = '0, 122, 204'
        else if (theme === 'sublime') color = '255, 87, 34'

        ctx.fillStyle = `rgba(${color}, ${this.opacity})`
        ctx.fill()
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = []
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle())
      }
      particlesRef.current = particles
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            
            // Theme-based connection colors
            let color = '76, 175, 80'
            if (theme === 'dracula') color = '189, 147, 249'
            else if (theme === 'monokai') color = '253, 151, 31'
            else if (theme === 'github') color = '3, 102, 214'
            else if (theme === 'vscode') color = '0, 122, 204'
            else if (theme === 'sublime') color = '255, 87, 34'

            ctx.strokeStyle = `rgba(${color}, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.6
      }}
    />
  )
}

export default ParticleSystem