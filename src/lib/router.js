import { useEffect, useState } from 'react'

// Minimal hash-based router. Sufficient for GitHub Pages static hosting.
// Route shape: "/", "/writing", "/writing/<slug>"

const parseHash = () => {
  const raw = window.location.hash || '#/'
  const path = raw.startsWith('#') ? raw.slice(1) : raw
  return path.startsWith('/') ? path : '/' + path
}

export const useHashRoute = () => {
  const [path, setPath] = useState(parseHash())
  useEffect(() => {
    const onChange = () => setPath(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export const matchRoute = (path) => {
  if (path === '/' || path === '') return { kind: 'home' }
  if (path === '/writing' || path === '/writing/') return { kind: 'writing-index' }
  const writing = path.match(/^\/writing\/([a-z0-9-]+)\/?$/)
  if (writing) return { kind: 'writing-post', slug: writing[1] }
  const work = path.match(/^\/work\/([a-z0-9-]+)\/?$/)
  if (work) return { kind: 'work-post', slug: work[1] }
  return { kind: 'home' } // fall back to home rather than 404
}

export const navigateTo = (path) => {
  window.location.hash = path
  window.scrollTo(0, 0)
}
