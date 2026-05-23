## The hook

The site you're reading is built around one decision: **everything visible is a real signal, nothing is a slideshow.** The status board pings live deployments from your browser. The commit feed pulls from GitHub's public API. The chat dock streams from a Cloudflare Worker that proxies the Anthropic API with a system prompt that mirrors my résumé. If a recruiter clicks anything on the page, they're touching real infrastructure, not screenshots of it.

## Architecture

```text
                       drewmalhotra.com (GitHub Pages, static)
                                  |
        +-------------------------+--------------------------+
        |                         |                          |
   React SPA                  Status board               Chat dock
   (Vite + Framer Motion)   (browser pings the 6        (POST → CF Worker)
                            Railway deployments)              |
                                                              v
                                                       drew-agent.workers.dev
                                                              |
                                                              v
                                                       api.anthropic.com
                                                       (Claude Haiku 4.5)
```

There's no backend in the traditional sense. The site is fully static. The only "live" code path is the Cloudflare Worker, which exists only because the Anthropic API key cannot ship in a browser bundle.

## Key decisions

**Hash routing over a router library.** The site is static; GH Pages doesn't support server-side routing for arbitrary paths. Adding `react-router-dom` would have meant configuring `404.html` redirects and brittle deep-link handling. Instead I wrote ~40 lines of `useHashRoute` + `matchRoute` in `src/lib/router.js`. Deep links like `#/writing/patch-vulnerability` work natively, no special config. Tradeoff: hash routes are uglier in the URL bar. For a portfolio I traded aesthetics for zero dependencies.

**Cloudflare Worker for the agent backend (not Vercel, Railway, or AWS Lambda).** Workers boot in single-digit milliseconds at the edge, have a generous free tier (100K requests/day), and let me put the Anthropic API key in a secret store with one CLI command. The Worker itself is 200 lines. The full system prompt — Drew's voice, résumé facts, LLM tooling enthusiasm — lives at the top of `workers/agent/src/index.js` so I can change it with a `wrangler deploy` and not a frontend rebuild.

**Operator-console aesthetic over editorial / portfolio-design clichés.** Most engineering portfolios converge on the same dark-blue Inter look. I tried an editorial / paper aesthetic first; it read as designer's portfolio, not engineer's. The operator console (dark base, Geist Sans for display, JetBrains Mono for chrome, cyan/amber accents) reads as something I'd actually use as an engineer. The status header bar across the top — `system: online · env: portfolio.v3 · availability: open` — is the signature move.

**LLM-augmented build, with my voice on top.** I built this site collaboratively with Claude, Codex, and Gemini in the loop. The drafts of these deep-dives were generated; I edited the prose for voice. The chat agent's system prompt was authored with the LLM's help reading my résumé. The work is mine; the time-to-ship was halved by the tooling. That's the *point*, not a confession.

## What I'd do differently

**Per-post OG images.** SPAs without prerendering can't update `<meta og:image>` for social-media scrapers. Right now every link shared on LinkedIn/Twitter shows the homepage preview. Real fix: either move to a framework with prerendering (Next.js, Astro) or generate OG images at request time via another Cloudflare Worker. I deferred this and the social previews are now the weakest link in the discovery story.

**Worker rate-limiting from day one.** I shipped the agent without per-IP rate limiting because the CORS allowlist felt like enough. A bored attacker could still drain my Anthropic budget by replaying requests from drewmalhotra.com itself (via XSS on a different page they control, or just from a headless browser). KV-backed rate limiting is one of the next phases on the roadmap, but it should've been v1.

**Bundle size.** ~317 KB raw, ~103 KB gzipped. That's fine for a portfolio but it's bigger than it needs to be — Framer Motion alone is ~70 KB. I could ship CSS-only animations for the same effect on most of the staggered reveals. Future me will revisit when I have a real reason.

## What the build proves

This portfolio is the deliverable, not the medium. It demonstrates:

- A real product shipped with deployment automation, env-var management, and CORS-locked downstream services.
- LLM tooling used the way I'd use it on a team — collaborator on drafts, accelerator on infrastructure, never the author of record.
- A bias toward "the simplest thing that proves the point" — no Next.js, no design system library, no auth provider.

If you want to talk about how I build, the source is at the [GitHub link](https://github.com/d-malhotra2020/portfolioWebsite) — or ask the agent on the home page how I'd approach your problem.
