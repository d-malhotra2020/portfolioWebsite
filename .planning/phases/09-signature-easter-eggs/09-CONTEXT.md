# Phase 9 — Context

**Phase:** Signature Easter Eggs
**Goal:** Two or three small craft details that visitors notice and remember.
**Gathered:** 2026-05-23 (`--auto` mode — recommended defaults selected)
**Status:** Ready for planning

---

## Domain boundary

Phase 9 ships three small "craft" surfaces — a `/whoami` route, a keyboard-shortcut layer, and AgentDock session persistence — sized so each can be touched and reverted independently. No new product capabilities; these are surface details that signal taste.

Carrying forward from earlier phases:
- Hash router (`src/lib/router.js`) is the only routing primitive. Hash routes are SEO-invisible (locked in Phase 5).
- Operator-console aesthetic — dark + monospace chrome — is the lock.
- GitHub Pages static hosting — no server-side content negotiation available.
- AgentDock (`src/components/AgentDock.jsx`) state is in-memory only today; no persistence layer exists.

---

## Decisions locked

### `/whoami` delivery on a static host

Static HTML file at `public/whoami/index.html`. The `<body>` is mostly a single `<pre>` block containing clean profile text — so `curl drewmalhotra.com/whoami` dumps a readable text profile with minimal HTML wrapping. A small `<script>` upgrades the page to an animated terminal-style view in browsers (typewriter cursor, ascii line art, optional `?` link to keyboard shortcuts).

Also ship:
- `public/whoami.json` — same profile, structured JSON. For `curl -H "Accept: application/json"` users and bot integrations.
- `public/whoami.txt` — same profile, pure plain text (no HTML wrapper).

Why this shape: GitHub Pages has no User-Agent-based content negotiation. The honest path is a `<pre>`-anchored HTML that degrades to readable text under curl, plus explicit `.json` / `.txt` siblings for clients that want them. Cleaner than asking visitors to remember an extension; cleaner than running a Worker just for this.

### `/whoami` content

Sections (in order):
1. ASCII line-art header — small "D" monogram, hidden from screen readers via `aria-hidden` (visible only when JS enables it; `.txt` strips it).
2. Identity — name, current role, employer, location.
3. Active focus — one-sentence summary of what Drew is working on.
4. Stack — top 12 skills.
5. Selected work — 4 projects (title + one-line + URL).
6. Links — GitHub, LinkedIn, email, résumé PDF.
7. Footer — site URL, "generated from PROJECT.md / résumé," and a hint that `?` reveals keyboard shortcuts in the browser.

The text body is the source of truth — JSON and HTML are projections of the same data. Implement as a small build-time generator (`scripts/build-whoami.js`) that reads from a single canonical source (inline data object or `src/data/whoami.js`) and writes all three files into `public/whoami/` and `public/`.

### Keyboard shortcuts — leader-key model

Convention: press `g` then within 1.5 seconds press the destination letter.

| Combo | Action |
|---|---|
| `g a` | scroll to `#about` |
| `g e` | scroll to `#experience` (career) |
| `g w` | scroll to `#projects` (work) |
| `g s` | scroll to `#skills` (stack) |
| `g c` | scroll to `#contact` |
| `g r` | navigate to `#/writing` (reading) |
| `?`   | open shortcut help overlay |
| `Esc` | close shortcut overlay / close AgentDock |

Implementation hook: `src/hooks/useKeyboardShortcuts.js` — single global `keydown` listener mounted from `App.jsx`. Honors:
- Disabled when focus is inside an `<input>`, `<textarea>`, or any `contenteditable` element (so typing in the agent dock or contact form doesn't trigger nav).
- Disabled if `event.metaKey || event.ctrlKey || event.altKey` is set (so browser shortcuts win).
- Leader timeout is 1.5 s; pressing any non-matching key cancels the leader.
- `?` is `Shift + /`; check `event.key === '?'` to handle both layouts.
- Respect existing `prefers-reduced-motion` lock from Phase 4 — animated overlay reveal disabled under reduced motion.

Help overlay is a centered modal (dark, monospace, single-column table of bindings). Reuse existing `.modal` / `.panel` styles where possible — no new design system primitives.

Why leader-key over single-key: single-key shortcuts collide with regular typing and force every input on the page to defensively `stopPropagation`. The `g`-leader pattern is the GitHub / vim convention senior engineers expect.

### AgentDock session persistence

Use `window.sessionStorage` (per-tab, cleared on tab close) — matches success criterion #3 ("within the same browser session") and avoids the privacy surprise of persisting recruiter conversations across tabs.

Implementation:
- Key: `drew-agent-dock:v1` (versioned so a future schema change can ignore old data).
- Persist `messages[]` only — not `open` / `busy` / `showSuggest`.
- On mount, hydrate from `sessionStorage`; if parse fails or schema mismatches, fall back to the default greeting array.
- After every `setMessages` write, persist the new array.
- Wrap in `try / catch` — Safari private mode and storage-disabled browsers must degrade silently (chat still works, just no persistence).
- Add a small `clear` action in the dock header (one-click "start over") that resets to the default greeting and removes the key.

Schema migration: bump the key suffix to `v2` if the message shape ever changes. Old keys are orphaned but small; no cleanup needed.

### Scope guardrail — what's NOT in Phase 9

- Cross-tab agent persistence (would need `localStorage` + a tab-sync mechanism — privacy concern, out of scope).
- Cloudflare Worker–rendered `/whoami` (content negotiation by User-Agent) — adds infra for a marginal UX win; static files are sufficient.
- A full command palette (Cmd+K spotlight) — fun but its own phase.
- Server-rendered terminal animation — JS-only upgrade is fine.
- Easter-egg "konami code" / matrix rain / cursor effects — explicitly rejected as theme-toggle-style noise per PROJECT.md decision log.

---

## Code context

| Surface | File | Reuse |
|---|---|---|
| Hash router | `src/lib/router.js` | `navigateTo('/writing')` already exists; shortcuts call this for `g r`. |
| Section ids | `src/components/Navbar.jsx` | Section anchors `home / about / experience / projects / skills / contact` are stable — shortcuts target the same ids. |
| Agent state | `src/components/AgentDock.jsx` | `messages` lives in a single `useState`; persistence wraps it with a `useEffect` and a hydration init. |
| Existing escape key | `src/components/AgentDock.jsx` (lines 121–127) | Already closes dock on Escape — shortcut layer must coexist (let the dock's local handler keep handling Escape when dock is open). |
| Styles | `src/styles/App.css` | Monospace and panel styles already in place; help overlay reuses them. |

---

## Canonical refs

- `.planning/PROJECT.md` — voice, aesthetic lock, out-of-scope list.
- `.planning/REQUIREMENTS.md` — REQ-02 (per-project depth — context for `/whoami` content).
- `.planning/ROADMAP.md` Phase 9 — success criteria.
- `src/lib/router.js` — hash router contract for `g r` nav.
- `src/components/Navbar.jsx` — canonical section id list (`about`, `experience`, `projects`, `skills`, `contact`).
- `src/components/AgentDock.jsx` — message shape, greeting constant.
- `public/404.html` — existing static-page convention (SPA fallback for GH Pages).

No external specs / ADRs referenced.

---

## Deferred ideas

| Idea | Why deferred |
|---|---|
| Cmd+K command palette | Worth its own phase if Drew wants it later; not a "small detail." |
| Worker-rendered `/whoami` with Accept-header negotiation | Marginal UX gain over static files; adds infra. |
| Cross-tab agent history (`localStorage`) | Privacy + UX surprise; revisit only if visitor feedback asks. |
| GitHub-style `g i` / `g p` shortcuts for issues/PRs (cross-site) | Outside this site's surface. |
| Animated typewriter rendering of the homepage hero | Theme-toggle-style noise; explicitly rejected. |

---

*Authored: 2026-05-23 during gsd-discuss-phase 9 (`--auto`).*
