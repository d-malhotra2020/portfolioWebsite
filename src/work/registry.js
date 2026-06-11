// Per-project deep-dive registry. Add a project here to give it a /work/<slug> page.
import donationPlatform from './donation-platform.md?shiki'
import financialAnalysis from './financial-analysis.md?shiki'
import interviewAgent from './interview-agent.md?shiki'
import lansweeperDq from './lansweeper-dq.md?shiki'
import smartHome from './smart-home.md?shiki'
import thisPortfolio from './this-portfolio.md?shiki'
import trafficOptimization from './traffic-optimization.md?shiki'
import videoAnalytics from './video-analytics.md?shiki'

export const workPosts = [
  {
    slug: 'video-analytics',
    title: 'Video Analytics — YOLOv8 Honest Benchmark',
    category: 'CV · BENCHMARK',
    year: '2024',
    stack: ['Python', 'YOLOv8', 'PyTorch', 'OpenCV', 'aiohttp'],
    github: 'https://github.com/d-malhotra2020/video-analytics',
    live: 'https://video-analytics-production.up.railway.app',
    body: videoAnalytics
  },
  {
    slug: 'traffic-optimization',
    title: 'Traffic Flow Optimization',
    category: 'AI/ML · INFRA',
    year: '2024',
    stack: ['Python', 'FastAPI', 'OpenStreetMap', 'Docker', 'Railway'],
    github: 'https://github.com/d-malhotra2020/traffic-optimization',
    live: 'https://traffic-optimization-production.up.railway.app',
    body: trafficOptimization
  },
  {
    slug: 'donation-platform',
    title: 'Donation Platform Recommender',
    category: 'MOBILE · ML',
    year: '2023',
    stack: ['Python', 'PyTorch', 'React', 'Mobile'],
    github: 'https://github.com/d-malhotra2020/donation-platform',
    body: donationPlatform
  },
  {
    slug: 'financial-analysis',
    title: 'Financial Analysis Engine',
    category: 'DATA · ML',
    year: '2024',
    stack: ['Python', 'FastAPI', 'Next.js', 'yfinance', 'pandas'],
    github: 'https://github.com/d-malhotra2020/financial-analysis-tool',
    live: 'https://financial-analysis-tool-production.up.railway.app',
    body: financialAnalysis
  },
  {
    slug: 'smart-home',
    title: 'Smart Home Automation',
    category: 'IOT · SIM',
    year: '2024',
    stack: ['Python', 'Flask', 'MQTT', 'SQLite', 'Mosquitto'],
    github: 'https://github.com/d-malhotra2020/smart-home-automation',
    live: 'https://smart-home-automation-production.up.railway.app',
    body: smartHome
  },
  {
    slug: 'this-portfolio',
    title: 'This Portfolio',
    category: 'WEB · DESIGN',
    year: '2025',
    stack: ['React', 'Vite', 'Framer Motion', 'Cloudflare Workers'],
    github: 'https://github.com/d-malhotra2020/portfolioWebsite',
    live: 'https://drewmalhotra.com',
    body: thisPortfolio
  },
  {
    slug: 'interview-agent',
    title: 'Interview Agent · this chatbot',
    category: 'LLM · EDGE',
    year: '2026',
    stack: ['Cloudflare Workers', 'Anthropic API', 'KV', 'SSE'],
    github: 'https://github.com/d-malhotra2020/portfolioWebsite/tree/main/workers/agent',
    live: 'https://drewmalhotra.com',
    body: interviewAgent
  },
  {
    slug: 'lansweeper-dq',
    title: 'Data-Quality Validation Harness · Lansweeper technical test',
    category: 'QA · TDD',
    year: '2026',
    stack: ['Python', 'pytest', 'jsonschema', 'NVD/CVE'],
    github: 'https://github.com/d-malhotra2020/lansweeper-data-quality',
    body: lansweeperDq
  }
]

export const findWork = (slug) => workPosts.find((p) => p.slug === slug)
