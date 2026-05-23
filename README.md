# drewmalhotra.com

Personal portfolio for **Dhruv (Drew) Malhotra** — Software Engineer · SDET.
Live at **[drewmalhotra.com](https://drewmalhotra.com)**.

A static React site with a few live-signal pieces wired in: a status board
that pings every project I've deployed, a commit feed pulled straight from
GitHub, and an AI agent that fields questions from recruiters in my voice
(backed by a Cloudflare Worker proxying the Claude API).

---

## What's in here

```
.
├── src/                       # React app (Vite + Framer Motion)
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── Navbar.jsx         # Status bar + nav lockup
│   │   ├── Hero.jsx           # Masthead + terminal whoami panel
│   │   ├── StatusBoard.jsx    # Live uptime pings + commit feed wrapper
│   │   ├── CommitFeed.jsx     # GitHub events / per-repo commits
│   │   ├── About.jsx          # Bio + principles
│   │   ├── Experience.jsx     # Career timeline (collapsible cards)
│   │   ├── Projects.jsx       # Selected work grid with metric strips
│   │   ├── Skills.jsx         # Inventory grid (6 blocks)
│   │   ├── Contact.jsx        # Channels + Formspree memo form
│   │   ├── ScrollProgress.jsx # Cyan/amber scroll indicator
│   │   └── AgentDock.jsx      # Floating chat dock → Claude via Worker
│   └── styles/App.css         # Single design-system stylesheet
├── workers/
│   └── agent/                 # Cloudflare Worker that proxies the agent
│       ├── src/index.js       # SSE proxy + system prompt
│       ├── wrangler.toml
│       └── README.md          # Worker-specific setup
├── public/                    # Static assets (CNAME, resume PDF, photo)
├── projects/                  # Source for the side projects deployed to Railway
├── index.html
├── vite.config.js
└── package.json
```

---

## Stack

- **React 18** + **Vite** + **Framer Motion** + **Lucide React** for the SPA
- **Geist Sans** + **JetBrains Mono** for typography (operator-console aesthetic)
- **Cloudflare Workers** for the agent backend (SSE proxy → Anthropic API)
- **Claude Haiku 4.5** for the agent itself
- **GitHub Pages** for static hosting (custom domain via `CNAME`)
- **Formspree** for the contact form

No CSS framework, no UI library, no theme system, no analytics SDK beyond GA4.

---

## Running locally

```bash
npm install
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000).

### Wiring up the AI agent for local dev

The chat dock falls back gracefully if no Worker endpoint is configured — but
to actually stream responses locally, create `.env.local` in the repo root:

```
VITE_AGENT_ENDPOINT=https://drew-agent.drewmalhotra.workers.dev
```

…and restart `npm run dev`. The endpoint is also locked down by CORS, so it
only accepts requests from the production origins and `localhost:3000`.

See [`workers/agent/README.md`](./workers/agent/README.md) for instructions on
deploying or modifying the Worker itself.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint with React rules |
| `npm run deploy` | Push `main` to GitHub (triggers the deploy workflow) |

---

## Deployment

### Portfolio (GitHub Pages)

```bash
git add -A && git commit -m "..."
npm run deploy   # = git push origin main
```

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm install && npm run build` in an Actions runner, uploads `dist/` as a
Pages artifact, and serves it at [drewmalhotra.com](https://drewmalhotra.com).
The custom domain + HTTPS cert are managed through GitHub Pages settings
(no `gh-pages` branch in use).

The agent endpoint is wired in via a **GitHub repository variable** named
`VITE_AGENT_ENDPOINT`. Update it under Settings → Secrets and variables →
Actions → Variables, or via the gh CLI:

```bash
gh variable set VITE_AGENT_ENDPOINT \
  --body "https://drew-agent.drewmalhotra.workers.dev" \
  --repo d-malhotra2020/portfolioWebsite
```

The workflow exposes this variable to Vite during the build, so the URL
gets baked into the static bundle.

### Agent Worker (Cloudflare)

```bash
cd workers/agent
npx wrangler deploy
```

Secrets and origin allowlist are documented in
[`workers/agent/README.md`](./workers/agent/README.md). The Anthropic API key
lives only as a Cloudflare Worker secret — never in the repo or the browser
bundle.

---

## Live signals

A few details that don't look like much from the outside but earn the
"operator console" framing:

- **Status board** pings every Railway deployment from the browser using
  `no-cors` fetches and auto-refreshes every 2 minutes. A red pip means
  reachable-but-erroring; green means responding. Brivo is marked
  `proprietary · brivo internal` since the work is real but not public.
- **Commit feed** first hits the GitHub events API; if that's empty or
  rate-limited, it fans out to the canonical side-project repos and grabs the
  most recent commit per repo. Sorted by timestamp, six rows deep.
- **Agent dock** streams Anthropic SSE chunks straight through the Worker
  and renders them with a tiny inline markdown shim (handles `**bold**`,
  `` `code` ``, and bullet lists). Conversation history is capped at 12 turns
  and 1000 chars per turn server-side.

---

## Contact

- **Email**: [dhruvmalhotra2026@gmail.com](mailto:dhruvmalhotra2026@gmail.com)
- **LinkedIn**: [/in/drewmalhotra](https://www.linkedin.com/in/drewmalhotra/)
- **GitHub**: [@d-malhotra2020](https://github.com/d-malhotra2020)
- Or just open the site and ask the agent.
