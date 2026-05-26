// Writing index. Add new posts here as they ship.
import patchVuln from './patch-vulnerability.md?shiki'

export const posts = [
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
