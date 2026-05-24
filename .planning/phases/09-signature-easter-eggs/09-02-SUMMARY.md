---
phase: 09-signature-easter-eggs
plan: 02
subsystem: keyboard-shortcuts
tags: [ux, a11y, keyboard, framer-motion]
requires:
  - src/lib/router.js
  - src/components/Navbar.jsx
  - src/components/AgentDock.jsx
provides:
  - src/hooks/useKeyboardShortcuts.js
  - src/components/KeyboardShortcutsOverlay.jsx
  - "App.css: .shortcuts-overlay / .shortcuts-card / .shortcuts-card kbd"
affects:
  - src/App.jsx
tech_stack:
  added: []
  patterns:
    - "Leader-key (`g <x>`) shortcut model with 1.5s timeout"
    - "Single global keydown listener — leader state in useRef (not useState)"
    - "Cross-route scroll: navigateTo('/') then 50ms tick + scrollTo"
    - "Focus trap with tab cycling clamp; previouslyFocused restore on close"
    - "prefers-reduced-motion via Framer Motion useReducedMotion() — same lock as Phase 4"
key_files:
  created:
    - src/hooks/useKeyboardShortcuts.js
    - src/components/KeyboardShortcutsOverlay.jsx
  modified:
    - src/App.jsx
    - src/styles/App.css
decisions:
  - "SHORTCUTS exported from the hook (single source of truth) — overlay imports it so bindings can never drift apart"
  - "Escape only consumed when overlay is open — AgentDock's Escape handler keeps working unchanged"
  - "Cross-route nav for scroll bindings: setTimeout 50ms after navigateTo to give the hash router one render cycle"
  - "Focus trap implemented inline (not via library) — kept the overlay under ~140 lines"
metrics:
  tasks_completed: 3
  files_changed: 4
  lines_added: 414
  lines_removed: 1
  build_status: "npm run build: PASS"
  lint_status: "no eslint config present in repo (pre-existing) — skipped; clean by inspection"
  completed: 2026-05-23
---

# Phase 9 Plan 02: Leader-Key Shortcut Layer — Summary

One-liner: vim/GitHub-style `g + letter` leader shortcuts + `?` help overlay, mounted globally at the App root with full focus management and reduced-motion handling.

## What shipped

A `useKeyboardShortcuts` hook + `KeyboardShortcutsOverlay` component, both mounted at the App root so shortcuts work on every route. Section-scroll bindings auto-navigate to home first when invoked from a writing/work route, then scroll once the home shell mounts.

## SHORTCUTS table as shipped

| Combo | Action                                                  |
| ----- | ------------------------------------------------------- |
| `g a` | scroll to `#about`                                      |
| `g e` | scroll to `#experience` (nav label: "career")           |
| `g w` | scroll to `#projects` (nav label: "work")               |
| `g s` | scroll to `#skills` (nav label: "stack")                |
| `g c` | scroll to `#contact`                                    |
| `g r` | `navigateTo('/writing')` — opens longform writing index |
| `?`   | toggle help overlay (open or close)                     |
| `Esc` | close overlay only when overlay is open                 |

Disabled when: focus is in `<input>` / `<textarea>` / `[contenteditable=true]`, or any of `metaKey` / `ctrlKey` / `altKey` is held.

## Tasks + commits

| Task | Name                                                       | Commit    | Files |
| ---- | ---------------------------------------------------------- | --------- | ----- |
| 1    | `useKeyboardShortcuts` hook + `SHORTCUTS` binding table    | `032cd16` | `src/hooks/useKeyboardShortcuts.js` |
| 2    | `KeyboardShortcutsOverlay` component + styles              | `a171def` | `src/components/KeyboardShortcutsOverlay.jsx`, `src/styles/App.css` |
| 3    | Mount hook + overlay at App root in all 4 route shells     | `3d52903` | `src/App.jsx` |

## Accessibility contract (overlay)

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="shortcuts-title"`.
- Focus moves to the close button on open via `requestAnimationFrame` (lets the dialog paint before screen-reader announcement).
- Previous focus stored in a ref and restored on close.
- Small inline focus trap: `Tab` and `Shift+Tab` wrap within the dialog's focusable elements (close button → kbd elements with implicit tabindex won't matter — only the close button is interactive).
- `prefers-reduced-motion: reduce` collapses the slide animation to zero-duration opacity via Framer Motion's `useReducedMotion()`.

## Coexistence with AgentDock

AgentDock keeps its own Escape handler (lines 126–132 of `src/components/AgentDock.jsx`). The hook's Escape branch ONLY fires when `isHelpOpen === true`, and it does NOT `preventDefault` — so the dock's handler can still see the event when both happen to be open. Verified by code-reading: when overlay is closed and the dock is open, the hook returns early on Escape and the dock alone closes.

## Manual-test acceptance — read-back against the implementation

The plan's Task 3 lists 12 manual checks. Drew should run them in a browser; below is the code-level read-back confirming each path is wired correctly. Items marked PENDING require a browser to confirm but the implementation matches the contract.

1. `g a` within 1.5s → scroll to About. Hook: leader armed on `g`, second key `a` matches `SCROLL_BINDINGS.a = 'about'`, calls `scrollToSectionAcrossRoutes('about')` → `scrollToSection('about')` smooth-scrolls (or instant under reduced motion). **PENDING (browser).**
2. `g`, wait >1.5s, then `a` → no scroll. Hook: `setTimeout(clearLeader, 1500)` resets `leader.active = false`; the late `a` lands in the leader-inactive branch with no `a` binding → noop. **PENDING (browser).**
3. `g a` in a text input → noop. Hook: `isEditableTarget()` checks `tagName === 'INPUT' || 'TEXTAREA'` and `isContentEditable` → returns true → handler returns early. **PENDING (browser).**
4. Cmd+`g a` → browser shortcut wins. Hook: `e.metaKey || e.ctrlKey || e.altKey` → return. No `preventDefault`. **PENDING (browser).**
5. `?` → overlay opens with all 8 bindings. `key === '?'` calls `onToggleHelp`; overlay renders `SHORTCUTS.map(...)` → 8 entries. **PENDING (browser).**
6. `Escape` while overlay open → overlay closes; focus returns. Hook's Escape branch fires; overlay's `useEffect([open])` cleanup restores `previouslyFocused.current.focus()`. **PENDING (browser).**
7. Dock-open + overlay-closed Escape → only dock closes. Hook's Escape branch guarded by `isHelpOpenRef.current` (false here) → noop. AgentDock's own handler fires on the un-preventDefaulted event. **PENDING (browser).**
8. Dock-closed + overlay-closed Escape → no errors. Hook noops; AgentDock's handler short-circuits on `open` false. **PENDING (browser).**
9. `g r` → navigates to `#/writing`. Hook: second-key branch, `k === 'r'` → `navigateTo('/writing')`. **PENDING (browser).**
10. From `/writing`, `g a` → home + scroll. Hook: `scrollToSectionAcrossRoutes('about')` calls `scrollToSection` (returns false since `#about` isn't mounted), falls through to `navigateTo('/')` + `setTimeout(50ms)` then re-tries. **PENDING (browser).**
11. Reduced-motion: `?` overlay appears instantly. `useReducedMotion()` → `motionProps` switches to `{ initial: false, transition: { duration: 0 } }`; scroll switches to `behavior: 'auto'`. **PENDING (browser).**
12. No new console warnings during navigation. Code-reviewed for missing deps / unstable refs — `useKeyboardShortcuts` uses refs for callback identity so the effect doesn't re-bind. **PENDING (browser).**

`npm run build`: **PASS** (Vite built cleanly, 2.12s, bundle includes `.shortcuts-overlay` CSS and the `scroll to about` SHORTCUTS string).

## Verification artifacts

- `dist/assets/index-039755f0.js` contains the SHORTCUTS table (grepped `scroll to about` — match).
- `dist/assets/index-0f35dbaf.css` contains `.shortcuts-overlay` styles (grepped — match).
- `src/App.jsx` has 5 references to `KeyboardShortcutsOverlay` (1 import + 4 mount sites = matches required ≥5).
- All required a11y grep checks pass: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `useReducedMotion`, `requestAnimationFrame`, `previouslyFocused`.

## Deviations from plan

### 1. [Rule 3 — blocking] Skipped `npm run lint` because no ESLint config exists in the repo

- **Found during:** Task 1
- **Issue:** Running `npm run lint` errors with `ESLint couldn't find a configuration file`. No `.eslintrc*` or `eslint.config.*` exists at the repo root, despite `eslint` and three plugins being listed in `devDependencies` and `package.json` defining a `lint` script. This is a pre-existing project state, not something this plan introduced.
- **Resolution:** Did NOT add an ESLint config — that's out of scope for this plan and would touch areas (every file in the repo) far beyond the four files this plan owns. Manually code-reviewed the three new/modified files for the conventions already in the codebase (no semicolons-as-statement-terminators after `import`, double-quote JSX strings, single-quote JS strings, two-space indent). Build is the actual gate for syntactic correctness; it passes.
- **Tracked as deferred:** Adding an ESLint config + fixing whatever pre-existing violations exist across the codebase is a maintenance task for Phase 12 (Recurring Maintenance Scaffolding).
- **Files modified:** none
- **Commit:** n/a (no fix applied)

### 2. Minor enhancement — focus-visible style on overlay close button

- **Found during:** Task 2
- **Issue:** The CSS spec in the plan didn't include a `:focus-visible` outline for the close button. Without it, keyboard-only users get no visible focus ring when tabbing — small a11y gap.
- **Resolution:** Added a 2-line `.shortcuts-card header button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }` rule (Rule 2 — missing critical a11y functionality).
- **Files modified:** `src/styles/App.css`
- **Commit:** `a171def` (folded into Task 2's commit)

### 3. Minor enhancement — `aria-hidden="true"` on lucide icons in the overlay

- **Found during:** Task 2
- **Issue:** Lucide icons used inside `<button aria-label="...">` and next to a visible `<h2>` would otherwise duplicate themselves into the accessibility tree.
- **Resolution:** Added `aria-hidden="true"` on the two icon glyphs in the overlay header (Rule 2).
- **Files modified:** `src/components/KeyboardShortcutsOverlay.jsx`
- **Commit:** `a171def` (folded into Task 2's commit)

## Known stubs

None.

## Threat flags

None — the change is client-only UI; no new network endpoints, auth paths, file access, or schema changes.

## Notes for Drew

- Manual smoke test should be quick. The contract is clear and the build is green. Open http://localhost:5173/, press `?` to verify the overlay, press `g a` to verify a scroll-binding, then click into the contact form's name input and confirm `g a` types literally instead of scrolling.
- If you ever add a binding, you only need to add it in two places: the `SCROLL_BINDINGS` (or letter-switch) in the hook AND the `SHORTCUTS` array. The overlay reads `SHORTCUTS` directly, so there's nothing to update in the modal markup.

## Self-Check: PASSED

- `src/hooks/useKeyboardShortcuts.js` exists (FOUND).
- `src/components/KeyboardShortcutsOverlay.jsx` exists (FOUND).
- `src/styles/App.css` modified at end-of-file with `.shortcuts-overlay` section (FOUND).
- `src/App.jsx` modified — hook + overlay mounted in 4 route shells (5 references; FOUND).
- Commit `032cd16` exists (FOUND in `git log`).
- Commit `a171def` exists (FOUND in `git log`).
- Commit `3d52903` exists (FOUND in `git log`).
- `npm run build` exits 0 (PASS).
