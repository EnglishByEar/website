import type { GrammarCategory } from '@/types/grammar'

export const grammarCategories: GrammarCategory[] = [
  {
    id: 'tenses',
    title: 'Tenses',
    description: 'Master English verb tenses and time expressions',
    slug: 'tenses',
    lessonCount: 12,
  },
  {
    id: 'sentence-structure',
    title: 'Sentence Structure',
    description: 'Learn how English sentences fit together, from basic subject–verb patterns to complex ideas and smooth transitions.',
    slug: 'sentence-structure',
    lessonCount: 8,
  },
  {
    id: 'parts-of-speech',
    title: 'Parts of Speech',
    description: 'Understand nouns, verbs, adjectives, and more',
    slug: 'parts-of-speech',
    lessonCount: 10,
  },
  {
    id: 'punctuation',
    title: 'Punctuation',
    description: 'Master proper punctuation rules and usage',
    slug: 'punctuation',
    lessonCount: 7,
  },
  {
    id: 'prepositions',
    title: 'Prepositions',
    description: 'Learn when and how to use prepositions correctly',
    slug: 'prepositions',
    lessonCount: 6,
  },
  {
    id: 'modifiers',
    title: 'Modifiers',
    description: 'Understand how to use adjectives and adverbs',
    slug: 'modifiers',
    lessonCount: 5,
  },
]

export function getCategoryBySlug(slug: string): GrammarCategory | undefined {
  return grammarCategories.find((cat) => cat.slug === slug)
}
