---
phase: 09
verified: 2026-05-24T00:09:25Z
status: human_needed
must_haves_total: 4
must_haves_passed: 3
human_verification_total: 4
score: 3/4 must-haves verified
---

# Phase 9: Signature Easter Eggs — Verification Report

**Phase Goal:** Two or three small craft details that visitors notice and remember.

**Verified:** 2026-05-24T00:09:25Z
**Status:** human_needed (3 of 4 success criteria are observable in the codebase; the fourth — "elicits an 'oh nice' from a tested visitor" — is intrinsically subjective and requires Drew or a test visitor)
**Re-verification:** No — initial verification

## Result

Phase 9 ships three small craft details — `/whoami`, leader-key shortcuts, and per-tab agent persistence — all real, all wired, all gated by `npm run build`. The build runs end-to-end with the generator firing before vite. The three artifacts land in `dist/` with correct content (12 stack items, 4 projects, valid JSON, plain-text body, `<pre>` opens on line 4). The keyboard hook + overlay mount in all four route shells with the full a11y contract (role/dialog, aria-modal, aria-labelledby, useReducedMotion, focus management). The AgentDock persistence layer uses a versioned `drew-agent-dock:v1` key, lazy useState initializer, schema validation, try/catch around every storage call, a greeting-only early-return gate to keep cleared chats from re-persisting, and a Trash2 clear button matching the close button. SC #4 ("oh nice") is left for human acceptance — code can't verify subjective UX.

## Must-Haves (ROADMAP Success Criteria)

| # | Success Criterion | Status | Evidence |
|---|---|---|---|
| 1 | `/whoami` returns a terminal-style view; `curl drewmalhotra.com/whoami` returns clean text/JSON | VERIFIED | `dist/whoami/index.html` (4025 B, `<pre>` opens on line 4), `dist/whoami.json` (1726 B, valid JSON, 9 fields, 12 stack, 4 projects), `dist/whoami.txt` (1558 B, zero `<` chars). Inline animation script has `prefers-reduced-motion` check (grep count 2 in HTML). |
| 2 | Keyboard shortcuts `g a` / `g w` / `g c` / `?` work for navigation + help | VERIFIED | `src/hooks/useKeyboardShortcuts.js` exports 8 SHORTCUTS, uses `useRef` for leader, `1500` ms timeout, `metaKey/ctrlKey/altKey` skip branch, `isContentEditable === true` skip. `KeyboardShortcutsOverlay` has `role="dialog"`, `aria-modal="true"`, `aria-labelledby="shortcuts-title"`, `useReducedMotion`, `requestAnimationFrame`, `previouslyFocused`. `App.jsx` mounts both in all 4 route shells (5 references = 1 import + 4 mount sites). |
| 3 | Agent dock remembers conversation history within the same browser session | VERIFIED | `src/components/AgentDock.jsx` has `STORAGE_KEY = 'drew-agent-dock:v1'` (module scope, versioned), `loadPersistedMessages` (schema-validated, try/catch), `persistMessages` (try/catch swallow), `useState(loadPersistedMessages)` lazy initializer, `useEffect([messages])` with greeting-only early-return gate, `clearChat` that removes key BEFORE setMessages, and a `<button className="agent-head-clear">` with `Trash2 size={14}` + `aria-label="Clear chat"`. Only the `messages` array is persisted (effect dep array confirms). |
| 4 | At least one detail elicits "oh nice" from a tested visitor | HUMAN NEEDED | Subjective UX. Requires Drew or a test visitor to interact with the live site and react. Cannot be verified programmatically. |

**Score:** 3 of 4 success criteria verified by code; 1 requires human acceptance.

## Automated checks

### Build pipeline

```
$ npm run build
[build-whoami] wrote public/whoami/index.html (4025 bytes), public/whoami.json (1726 bytes), public/whoami.txt (1558 bytes)
vite v4.5.14 building for production...
✓ 1676 modules transformed.
dist/index.html                  10.19 kB │ gzip:   3.04 kB
dist/assets/index-c175f6be.css   47.63 kB │ gzip:   8.98 kB
dist/assets/index-1ac19414.js   349.42 kB │ gzip: 114.20 kB
✓ built in 2.04s
```

Exit 0. Generator runs first; vite runs second.

### `dist/whoami.json` shape

```
keys: name,role,employer,location,focus,stack,projects,links,generated_at
projects: 4   stack: 12   generated_at: 2026-05-24
name: Drew Malhotra
```

Canonical name in `src/data/whoami.js` is "Drew Malhotra" (résumé display form). The verification prompt asked for `Dhruv "Drew" Malhotra`; that does not match the canonical source. The .json output matches its source — no drift.

### `dist/whoami/index.html` head

```
<!DOCTYPE html>
<html lang="en"><head>… single-line <style> …</head>
<body>
<pre id="whoami" aria-label="drew malhotra profile"><span aria-hidden="true">    ____
```

`<pre>` opens on line 4 of the response. Within the first ~6 lines, as required. Profile text dominates the response body.

### `dist/whoami.txt` first lines

```
# whoami

  name      Drew Malhotra
  role      software engineer · sdet
  employer  Brivo (fmr. Eagle Eye Networks)
```

Zero `<` characters in the .txt output (`grep -c "<" dist/whoami.txt` → 0). Pure plain text.

### gitignore

`git check-ignore` returns 0 for all three generated artifacts (`public/whoami/index.html`, `public/whoami.json`, `public/whoami.txt`). `public/whoami/.gitkeep` is tracked. Single source of truth maintained.

### AgentDock persistence grep checks

| Token | Hit |
|---|---|
| `STORAGE_KEY = 'drew-agent-dock:v1'` | line 19 |
| `sessionStorage.getItem` | line 28 |
| `sessionStorage.setItem` | line 48 |
| `sessionStorage.removeItem` | lines 173, 197 (gate + clearChat) |
| `import { … Trash2 } from 'lucide-react'` | line 3 |
| `aria-label="Clear chat"` | line 331 |
| `title="Clear chat"` | line 332 |

`useState(loadPersistedMessages)` at line 146 — function reference (lazy initializer), not a call. Only `messages` is persisted: the effect at lines 166–181 takes `[messages]` as its dep array and passes only `messages` to `persistMessages`.

### Keyboard hook grep checks

| Token | Hit |
|---|---|
| `LEADER_TIMEOUT_MS = 1500` | line 13 |
| `e.metaKey \|\| e.ctrlKey \|\| e.altKey` skip | line 93 |
| `isContentEditable === true` | line 54 (in `isEditableTarget`) |
| `prefers-reduced-motion: reduce` | line 27 |
| `SHORTCUTS` array | 8 entries (line count of `keys:` is 8) |
| `navigateTo` import | line 2 |

Note: the verifier's prompt listed `contentEditable` as a grep token. The hook uses `el.isContentEditable` (the DOM-property form, equivalent to React's normalized `contentEditable` prop). Both substrings — `contenteditable` and `isContentEditable` — appear in the file (comments + code). Verified.

### KeyboardShortcutsOverlay a11y grep checks

| Token | Hit |
|---|---|
| `role="dialog"` | line 93 |
| `aria-modal="true"` | line 94 |
| `aria-labelledby="shortcuts-title"` | line 95 |
| `useReducedMotion` | imported and called |
| `requestAnimationFrame` | line 27 (focus management) |
| `previouslyFocused` | lines 18, 23, 37 (focus restore) |

### App.jsx mount

```
$ grep -c "KeyboardShortcutsOverlay" src/App.jsx
5
```

1 import + 4 mount sites (writing-index, writing-post, work-post, home). `useKeyboardShortcuts({ onToggleHelp, isHelpOpen })` is called once at the App root above the route-matching code, so the listener mounts on every route.

### Section IDs targeted by `g <x>` exist

| Hotkey | Section ID | DOM source |
|---|---|---|
| `g a` | `#about` | `src/components/About.jsx:34` |
| `g e` | `#experience` | `src/components/Experience.jsx:133` |
| `g w` | `#projects` | `src/components/Projects.jsx:113` |
| `g s` | `#skills` | `src/components/Skills.jsx:42` |
| `g c` | `#contact` | `src/components/Contact.jsx:60` |

`g r` calls `navigateTo('/writing')` — existing route handler. All bindings resolve to real DOM or real routes.

### Commit history

All 8 expected commits are in `main`:

```
38adb26 feat(09-01): canonical whoami profile data + build-time generator
b9a6f7f feat(09-01): wire whoami generator into npm build + gitignore artifacts
01fb41f fix(09-01): inline HTML head on one line so <pre> opens by line 4
032cd16 feat(09-02): add useKeyboardShortcuts hook with leader-key bindings
a171def feat(09-02): add KeyboardShortcutsOverlay component + styles
3d52903 feat(09-02): mount shortcut hook + overlay at App root in all 4 route shells
4519564 feat(09-03): AgentDock sessionStorage persistence + lazy hydration
89be3ba feat(09-03): clear-chat button in AgentDock header + matching styles
```

Working tree is clean.

### Anti-patterns

Scanned the 5 phase-9 files (`src/data/whoami.js`, `scripts/build-whoami.js`, `src/hooks/useKeyboardShortcuts.js`, `src/components/KeyboardShortcutsOverlay.jsx`, `src/components/AgentDock.jsx`, plus the App.css block from line 2917 onward):

- No `TODO`, `FIXME`, `TBD`, `HACK`, `XXX`, `PLACEHOLDER`, or `coming soon` markers introduced by Phase 9.
- All empty `catch {}` blocks in AgentDock.jsx and the build script are intentional (Safari private mode / storage-disabled degradation, scoped to single storage calls) and documented inline.
- No hardcoded empty data flowing to render. The greeting array is the legitimate initial state, hydrated from real sessionStorage when present.

## Human verification

The following must be tested by Drew (or a recruiter / test visitor) in a real browser. The code is wired correctly; these checks confirm the live behavior and the subjective acceptance bar.

### 1. `/whoami` typewriter animation in a browser

**Test:** Run `npm run dev`, open `http://localhost:5173/whoami` (or hit the deployed `drewmalhotra.com/whoami` after the next push).
**Expected:** The profile types itself out character-by-character with a blinking cursor at the tail. After ~600 chars it switches to a chunked dump so the wait stays under ~3 seconds. With `prefers-reduced-motion: reduce` toggled in OS settings, the full profile appears instantly with no animation.
**Why human:** Visual animation pacing, cursor visibility, and reduced-motion behavior cannot be observed programmatically without spinning a headless browser.

### 2. Keyboard shortcuts on a live page (`g a` smoke test)

**Test:** With `npm run dev` open at `http://localhost:5173/`, press `g` then `a` within 1.5 seconds. Then click into the contact form name input and type `g a`. Then hold Cmd and press `g a`. Then press `?` and confirm the overlay lists all 8 bindings; press `Esc` to close. From the `/writing` route, press `g a` and confirm the page navigates home AND scrolls to About.
**Expected:** First `g a` smooth-scrolls to `#about`. In the input, no scroll — "g a" appears in the field. With Cmd held, no scroll. `?` opens the overlay; `Esc` closes it; focus returns to the page. Cross-route `g a` navigates home then scrolls within ~50ms.
**Why human:** Keyboard event delivery, focus management, smooth-scroll behavior, and the input-suppression check require an actual browser keyboard event loop.

### 3. AgentDock persistence across a reload (and per-tab isolation)

**Test:** Open the dock via the FAB, send a real message, wait for the streamed reply, then reload the tab (Cmd+R). Open DevTools → Application → Session Storage and confirm `drew-agent-dock:v1` exists. Open a NEW tab to the same URL — dock should start fresh with just the greeting. Click the trash icon — dock resets to greeting, chips reappear, the storage key is gone.
**Expected:** Reload preserves the thread. New tab is fresh. Clear button resets state and removes the storage entry. Optionally simulate Safari private mode by running `Storage.prototype.setItem = function(){ throw new Error('quota') }` in DevTools — the chat must keep working with no uncaught errors.
**Why human:** sessionStorage is a per-tab browser-managed primitive. Reload semantics, per-tab isolation, and storage-failure degradation require a real browser session.

### 4. The "oh nice" check (SC #4)

**Test:** Show one of the three details (`curl drewmalhotra.com/whoami`, the `?` shortcut overlay, or reloading mid-conversation in the dock) to a senior engineer or recruiter who has not seen the site before. Watch their reaction.
**Expected:** A visible "oh nice" / "huh, that's cool" / "did you really…?" moment on at least one of the three surfaces.
**Why human:** Intrinsically subjective. This is the success criterion the phase exists to satisfy.

## Notes

- **Name discrepancy:** the verification prompt suggested the canonical name might be `Dhruv "Drew" Malhotra`. The actual source of truth `src/data/whoami.js` has `name: 'Drew Malhotra'`. The generator and all three projections reflect the source. No drift; no gap. If Drew wants the formal name shown, the fix is a one-line edit in `src/data/whoami.js` followed by `npm run build`.
- **ESLint config is missing from the repo** (pre-existing — flagged in both 09-02 and 09-03 SUMMARYs). `npm run lint` errors with `ESLint couldn't find a configuration file`. This is not a Phase 9 regression. `npm run build` is the binding gate and passes cleanly. Adding an ESLint config is appropriate work for Phase 12 (Recurring Maintenance Scaffolding) per the SUMMARYs.
- **Generated artifacts are gitignored;** the build script re-creates them every time. GH Actions workflow already calls `npm run build`, so `/whoami` ships on the next push to `main`.
- The `<kbd>?</kbd>` hint in the `/whoami` footer now resolves to a real interactive overlay (09-02 shipped the shortcut layer). The forward reference is no longer aspirational.
- AgentDock's existing Escape handler (line 185) is untouched by 09-02 and 09-03 — the shortcut hook only fires the Escape branch when `isHelpOpen === true`, and never `preventDefault`s, so the dock's own handler still works when the dock is open.

---

*Verified: 2026-05-24T00:09:25Z*
*Verifier: Claude (gsd-verifier)*
