import { useEffect, useRef } from 'react'
import { navigateTo } from '../lib/router'

// Phase 9 — vim/GitHub-style leader-key shortcuts.
// Press `g` then within 1.5s press a destination letter; `?` toggles a help overlay.
// The hook mounts a single global keydown listener and respects:
//  - form input focus (skip while typing in <input>, <textarea>, contenteditable)
//  - modifier keys (skip when Cmd/Ctrl/Alt held, so native shortcuts win)
//
// Leader state lives in a useRef (not useState) so the listener does NOT recreate
// on every key press — the effect's empty deps make this hot path allocation-free.

const LEADER_TIMEOUT_MS = 1500
const SCROLL_OFFSET = 100 // matches Navbar's offset for fixed statusbar + nav

// Destination ids on the home route. `g r` is a route nav, handled separately.
const SCROLL_BINDINGS = {
  a: 'about',
  e: 'experience',
  w: 'projects',
  s: 'skills',
  c: 'contact'
}

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return false
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
  window.scrollTo({ top: el.offsetTop - SCROLL_OFFSET, behavior })
  return true
}

// Cross-route scroll: if the section isn't mounted (writing/work route), jump
// to home first and then scroll after React has had one render cycle to mount
// the home shell. 50ms is enough for the hashchange + matchRoute + mount.
const scrollToSectionAcrossRoutes = (id) => {
  if (scrollToSection(id)) return
  navigateTo('/')
  setTimeout(() => scrollToSection(id), 50)
}

const isEditableTarget = () => {
  const el = typeof document !== 'undefined' ? document.activeElement : null
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return true
  // contenteditable can be "true", "" (empty string), or "plaintext-only" — all editable.
  // isContentEditable normalises all of these to a boolean.
  return el.isContentEditable === true
}

// Public binding list — the overlay component reads this so the help text and
// the actual bindings can never drift apart.
export const SHORTCUTS = [
  { keys: ['g', 'a'], action: 'scroll to about',         hint: 'g a' },
  { keys: ['g', 'e'], action: 'scroll to career',        hint: 'g e' },
  { keys: ['g', 'w'], action: 'scroll to work',          hint: 'g w' },
  { keys: ['g', 's'], action: 'scroll to stack',         hint: 'g s' },
  { keys: ['g', 'c'], action: 'scroll to contact',       hint: 'g c' },
  { keys: ['g', 'r'], action: 'open writing',            hint: 'g r' },
  { keys: ['?'],      action: 'toggle this help overlay', hint: '?' },
  { keys: ['Esc'],    action: 'close overlay or dock',   hint: 'Esc' }
]

const useKeyboardShortcuts = ({ onToggleHelp, isHelpOpen }) => {
  // Stash the latest callbacks in refs so the effect can stay mounted across renders
  // without re-binding the global listener every time isHelpOpen flips.
  const onToggleHelpRef = useRef(onToggleHelp)
  const isHelpOpenRef = useRef(isHelpOpen)
  useEffect(() => {
    onToggleHelpRef.current = onToggleHelp
    isHelpOpenRef.current = isHelpOpen
  }, [onToggleHelp, isHelpOpen])

  const leader = useRef({ active: false, timeoutId: null })

  useEffect(() => {
    const clearLeader = () => {
      if (leader.current.timeoutId !== null) {
        clearTimeout(leader.current.timeoutId)
      }
      leader.current.active = false
      leader.current.timeoutId = null
    }

    const handler = (e) => {
      // 1. Skip when any modifier is held — never override native browser shortcuts.
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // 2. Skip when typing in form inputs / contenteditable surfaces.
      if (isEditableTarget()) return

      // 3. Leader-active branch: this is the SECOND keypress in a `g <x>` combo.
      if (leader.current.active) {
        clearLeader()
        const k = (e.key || '').toLowerCase()

        if (k === 'r') {
          e.preventDefault()
          navigateTo('/writing')
          return
        }

        const sectionId = SCROLL_BINDINGS[k]
        if (sectionId) {
          e.preventDefault()
          scrollToSectionAcrossRoutes(sectionId)
        }
        // Anything else after `g` is silently consumed (leader expired).
        return
      }

      // 4. Leader-inactive branch: handle solo keys and arm the leader.
      const key = e.key

      // `?` is Shift+/ — `event.key === '?'` works across layouts.
      if (key === '?') {
        e.preventDefault()
        onToggleHelpRef.current?.()
        return
      }

      // Escape closes the overlay ONLY when it's open. When closed, do NOT
      // intercept — AgentDock has its own Escape handler that closes the dock,
      // and we must not steal that event.
      if (key === 'Escape' && isHelpOpenRef.current) {
        // No preventDefault — the dock's handler is a no-op when its `open` is
        // false, so letting the event through is harmless and keeps both
        // surfaces decoupled.
        onToggleHelpRef.current?.()
        return
      }

      // Arm the leader on `g`.
      if (typeof key === 'string' && key.toLowerCase() === 'g') {
        e.preventDefault()
        if (leader.current.timeoutId !== null) clearTimeout(leader.current.timeoutId)
        leader.current.active = true
        leader.current.timeoutId = setTimeout(clearLeader, LEADER_TIMEOUT_MS)
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      clearLeader()
    }
  }, [])
}

export default useKeyboardShortcuts
