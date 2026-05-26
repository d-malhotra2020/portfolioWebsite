// Writing index. Add new posts here as they ship.
import patchVuln from './patch-vulnerability.md?shiki'
import honestyPlaybook from './honesty-playbook.md?shiki'
import realVideoAnalytics from './real-video-analytics.md?shiki'

export const posts = [
  {
    slug: 'real-video-analytics',
    title: 'What a real video-analytics platform would actually need',
    dek: 'My YOLOv8 benchmark is object detection on still images with a thin visualization tier. Here is the roadmap that turns it into something a hiring manager would call a platform — tracking, streaming, asymmetric error budgets, shadow-mode deployment.',
    date: '2026-05-26',
    readingTime: 6,
    tags: ['ml', 'cv', 'systems', 'roadmap'],
    body: realVideoAnalytics
  },
  {
    slug: 'honesty-playbook',
    title: 'The honesty playbook',
    dek: 'Five of my hobby projects shipped homepage claims the code wasn\'t measuring. I scrubbed them in a single week. This is the five-step playbook I used, and what it taught me about the difference between claims and measurements.',
    date: '2026-05-26',
    readingTime: 7,
    tags: ['process', 'reflection', 'sdet', 'craft'],
    body: honestyPlaybook
  },
  {
    slug: 'patch-vulnerability',
    title: 'The PATCH that nullified prod',
    dek: 'How an API input-validation audit at Brivo surfaced a vulnerability that let production records have their required fields removed — and what it taught me about adversarial testing.',
    date: '2026-05-23',
    readingTime: 7,
    tags: ['security', 'testing', 'sdet', 'case study'],
    body: patchVuln
  }
]

export const findPost = (slug) => posts.find((p) => p.slug === slug)
