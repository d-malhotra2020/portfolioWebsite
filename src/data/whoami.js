// Canonical profile data for the /whoami and /resume routes.
//
// This file is the single source of truth. `scripts/build-whoami.js` reads it
// at build time and emits three projections into public/:
//   - public/whoami/index.html  (terminal-animated browser view)
//   - public/whoami.json        (structured for bots / `curl -H "Accept: application/json"`)
//   - public/whoami.txt         (pure plain text for `curl`)
//
// The /resume SPA route also renders directly from this data.
// Do not edit the generated artifacts — re-run `npm run build` instead.
//
// Voice: lowercase, terse, operator-console. Résumé-accurate values only.
// No fabricated numbers. Every claim below maps to a measurement.

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
  experience: [
    {
      role: 'Software Engineer in Test',
      org: 'Brivo (fmr. Eagle Eye Networks)',
      period: '2024.10 — present',
      location: 'Austin, TX',
      bullets: [
        'Architected a 24×7 Synthetic Monitoring Framework for the Automations Alert Platform validating the end-to-end Alerts V3 pipeline across all 21 EEN production clusters. Defined SLA thresholds (<60s alert latency, <30s webhook latency, 99.9% availability, 100% payload completeness) and escalation rules.',
        'Drove QA strategy for the AlertD → Automations V3 migration (multi-month, all-customer impact). Seven-phase test plan with custom Python tooling validated rule parity, action delivery, and rollback paths for the largest dataset (700 cameras × 897 rules).',
        'Productized qalab-alertMonitor from a localhost Flask dashboard into a hosted internal service: containerized for production, built Concourse CI/CD, provisioned behind VPN/SSO. Replaced manual Playwright headed-browser login with an automated token-refresh loop.',
        'Reverse-engineered undocumented throttling by analyzing 3,100+ alerts and 10,100+ notifications — discovered a shared rule-level cooloff mechanism that influenced platform architecture.',
        'API input-validation audit across 6+ endpoint groups uncovered a critical PATCH vulnerability in the rules endpoint that allowed removal of required fields in production. Led to immediate remediation.',
        '1,000+ pytest-django tests + 300+ Postman API tests, 100% coverage on core services.'
      ]
    },
    {
      role: 'Intelligence Specialist (S-2)',
      org: 'United States Navy',
      period: '2017 — 2022',
      location: 'Various',
      bullets: [
        '5 years active duty. Clearance management for 3,000+ personnel. Security clearance eligible.',
        'S-2 Intelligence shop operations across multiple commands.'
      ]
    }
  ],
  projects: [
    {
      title: 'video-analytics — YOLOv8 honest benchmark',
      oneliner:
        'YOLOv8n measured on 210-image stratified COCO val2017 sample. Person F1 = 0.688 (drops 0.798 → 0.651 sparse → dense). `make bench` reproducible.',
      url: 'https://drewmalhotra.com/work/video-analytics',
      live: 'https://video-analytics-production.up.railway.app'
    },
    {
      title: 'traffic-optimization',
      oneliner:
        'rule-based adaptive signal optimizer over 664 real OSM signalized intersections in downtown SF. Microsim: +18.2% throughput vs fixed-time at peak load (and honest losses at light load).',
      url: 'https://drewmalhotra.com/work/traffic-optimization',
      live: 'https://traffic-optimization-production.up.railway.app'
    },
    {
      title: 'donation-platform recommender',
      oneliner:
        'two-tower pytorch recommender benchmarked against 5 baselines on 3K real ProPublica nonprofits. NDCG@10 = 5.7× random, 99% catalog coverage. Live operator console + GitHub Pages benchmark report.',
      url: 'https://drewmalhotra.com/work/donation-platform',
      live: 'https://donation-platform-production-c8e0.up.railway.app'
    },
    {
      title: 'financial-analysis engine',
      oneliner:
        'time-series ingestion + statistical + ML ensemble over public market feeds. 49.5% honest next-day-direction accuracy on 1,990 predictions across 10 large caps over 12 months.',
      url: 'https://drewmalhotra.com/work/financial-analysis',
      live: 'https://financial-analysis-tool-production.up.railway.app'
    },
    {
      title: 'smart-home automation',
      oneliner:
        'flask command center + real paho-mqtt mosquitto broker round-trip + graceful sim-mode fallback. Raspberry Pi operator-terminal UI with a `// system reality` footer that distinguishes real from simulated.',
      url: 'https://drewmalhotra.com/work/smart-home',
      live: 'https://smart-home-automation-production.up.railway.app'
    },
    {
      title: 'this portfolio',
      oneliner:
        'operator-console aesthetic. React + Vite, custom CSS design system, Framer Motion choreography, Cloudflare Worker proxying Claude for an in-page interview agent.',
      url: 'https://drewmalhotra.com/work/this-portfolio'
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
