// Canonical profile data for the /whoami route.
//
// This file is the single source of truth. `scripts/build-whoami.js` reads it
// at build time and emits three projections into public/:
//   - public/whoami/index.html  (terminal-animated browser view)
//   - public/whoami.json        (structured for bots / `curl -H "Accept: application/json"`)
//   - public/whoami.txt         (pure plain text for `curl`)
//
// Do not edit the generated artifacts — re-run `npm run build` instead.
//
// Voice: lowercase, terse, operator-console. Résumé-accurate values only.

export const whoami = {
  name: 'Drew Malhotra',
  role: 'software engineer · sdet',
  employer: 'Brivo (fmr. Eagle Eye Networks)',
  location: 'Austin, TX',
  focus:
    'distributed test infra + synthetic monitoring across 26 production envs in 6 regions; ai/ml-augmented qa on the side.',
  stack: [
    'Python',
    'Java',
    'TypeScript',
    'pytest',
    'Playwright',
    'aiohttp',
    'FastAPI',
    'AWS',
    'Kubernetes',
    'PyTorch',
    'React',
    'Anthropic API'
  ],
  projects: [
    {
      title: 'donation-platform recommender',
      oneliner:
        'production pytorch recommender + improved search for the giving platform serving 1.5M users; +25% retention.',
      url: 'https://drewmalhotra.com/#/work/donation-platform'
    },
    {
      title: 'financial-analysis engine',
      oneliner:
        '~1M data points/day; classical stats + ml predictors via fastapi over postgres. 94% prediction accuracy.',
      url: 'https://drewmalhotra.com/#/work/financial-analysis'
    },
    {
      title: 'smart-home automation',
      oneliner:
        'raspberry pi flask command center, 15+ iot sensors over mqtt, sub-500ms control latency, 30% energy savings.',
      url: 'https://drewmalhotra.com/#/work/smart-home'
    },
    {
      title: 'this portfolio',
      oneliner:
        'operator-console aesthetic. react + vite, custom css design system, cloudflare worker proxying claude.',
      url: 'https://drewmalhotra.com/#/work/this-portfolio'
    }
  ],
  links: {
    github: 'https://github.com/d-malhotra2020',
    linkedin: 'https://www.linkedin.com/in/drewmalhotra/',
    email: 'dhruvmalhotra2026@gmail.com',
    resume: '/Dhruv_malhotra_resume.pdf'
  },
  // generated_at is stamped at build time by scripts/build-whoami.js.
  // Keep this null in source so the file isn't churning on every build.
  generated_at: null
}
