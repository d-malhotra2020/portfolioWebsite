import { useEffect, useState } from 'react'

// Minimal router. Sufficient for GitHub Pages static hosting.
// Route shape: "/", "/writing", "/writing/<slug>", "/work/<slug>".
//
// Two URL forms are accepted, transparently:
//   1. Path form:  drewmalhotra.com/work/donation-platform
//   2. Hash form:  drewmalhotra.com/#/work/donation-platform
//
// Path-form URLs hit a prerendered HTML stub (scripts/prerender.js) with
// per-page OG meta so social-media crawlers can preview each deep-dive.
// In-app navigation prefers the path form via the History API so when a
// user copies the URL bar after navigating, the share preview works.

const KNOWN_ROUTE_RE = /^\/(work|writing)\/[a-z0-9-]+\/?$|^\/resume\/?$/

const readRoute = () => {
  // Hash takes precedence (legacy + the prerendered shim writes it).
  const rawHash = window.location.hash || ''
  if (rawHash && rawHash !== '#' && rawHash !== '#/') {
    const path = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash
    return path.startsWith('/') ? path : '/' + path
  }
  // Fall back to pathname for prerendered stub URLs.
  const pathname = window.location.pathname
  if (KNOWN_ROUTE_RE.test(pathname) || pathname === '/writing' || pathname === '/writing/') {
    return pathname.replace(/\/$/, '') || '/'
  }
  if (pathname === '/resume' || pathname === '/resume/') return '/resume'
  return '/'
}

export const useHashRoute = () => {
  const [path, setPath] = useState(readRoute())
  useEffect(() => {
    const onChange = () => setPath(readRoute())
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [])
  return path
}

export const matchRoute = (path) => {
  if (path === '/' || path === '') return { kind: 'home' }
  if (path === '/writing' || path === '/writing/') return { kind: 'writing-index' }
  if (path === '/resume' || path === '/resume/') return { kind: 'resume' }
  const writing = path.match(/^\/writing\/([a-z0-9-]+)\/?$/)
  if (writing) return { kind: 'writing-post', slug: writing[1] }
  const work = path.match(/^\/work\/([a-z0-9-]+)\/?$/)
  if (work) return { kind: 'work-post', slug: work[1] }
  return { kind: 'home' }
}

export const navigateTo = (path) => {
  // Drive navigation through the History API so the URL bar shows the path
  // form (which matches our prerendered OG-stub URLs). Clear any leftover
  // hash so a paste from the URL bar is /work/<slug>, not /work/<slug>#/work/<slug>.
  try {
    window.history.pushState(null, '', path)
    // Manually trigger so useHashRoute updates (pushState doesn't fire popstate).
    window.dispatchEvent(new PopStateEvent('popstate'))
  } catch (e) {
    // Older browsers — fall back to the old hash-router behavior.
    window.location.hash = path
  }
  window.scrollTo(0, 0)
}
