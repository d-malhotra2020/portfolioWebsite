import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts'

// Phase 9 — Help overlay listing every keyboard shortcut.
//
// Accessibility contract:
//  - role="dialog", aria-modal, aria-labelledby pointed at the visible title
//  - Focus moves into the dialog on open and returns to the previously
//    focused element on close (small in-component focus trap)
//  - Animation is suppressed under prefers-reduced-motion (Phase 4 lock)

const KeyboardShortcutsOverlay = ({ open, onClose }) => {
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const previouslyFocused = useRef(null)

  // Focus management — runs on every open/close transition.
  useEffect(() => {
    if (open) {
      previouslyFocused.current =
        typeof document !== 'undefined' ? document.activeElement : null
      // requestAnimationFrame ensures the dialog has painted before we move
      // focus — without it, screen readers occasionally miss the announcement.
      const raf = requestAnimationFrame(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus()
        } else if (dialogRef.current) {
          dialogRef.current.focus()
        }
      })
      return () => cancelAnimationFrame(raf)
    }
    // Closing — restore focus to whatever element opened the overlay (if any).
    const prev = previouslyFocused.current
    if (prev && typeof prev.focus === 'function') {
      prev.focus()
    }
    return undefined
  }, [open])

  // Small focus trap — clamp Tab cycling within the dialog while it's open.
  const onDialogKeyDown = (e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusables = dialogRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // Animation values — collapsed to zero-duration when reduced motion is requested.
  const motionProps = reduceMotion
    ? {
        initial: false,
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
        transition: { duration: 0.18, ease: [0.2, 0.65, 0.3, 1] }
      }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="shortcuts-overlay"
          className="shortcuts-overlay"
          role="presentation"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.12 }}
        >
          <motion.div
            ref={dialogRef}
            className="shortcuts-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onDialogKeyDown}
            {...motionProps}
          >
            <header>
              <Keyboard size={14} aria-hidden="true" />
              <h2 id="shortcuts-title">keyboard shortcuts</h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close shortcuts overlay"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </header>

            <dl>
              {SHORTCUTS.map(({ keys, action, hint }) => (
                <React.Fragment key={hint}>
                  <dt>
                    {keys.map((k, i) => (
                      <kbd key={`${hint}-${i}`}>{k}</kbd>
                    ))}
                  </dt>
                  <dd>{action}</dd>
                </React.Fragment>
              ))}
            </dl>

            <p className="shortcuts-tip">
              Tip: type <kbd>g</kbd> then a letter within 1.5s. Shortcuts pause
              while typing in inputs.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default KeyboardShortcutsOverlay
