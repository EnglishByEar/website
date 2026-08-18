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
    description: 'Learn how prepositions connect ideas and describe time, place, movement, relationships, and context.',
    slug: 'prepositions',
    lessonCount: 6,
  },
  {
    id: 'modifiers',
    title: 'Modifiers',
    description: 'Make your writing clearer and more vivid by learning how adjectives, adverbs, and phrases add detail to sentences.',
    slug: 'modifiers',
    lessonCount: 5,
  },
]

export function getCategoryBySlug(slug: string): GrammarCategory | undefined {
  return grammarCategories.find((cat) => cat.slug === slug)
}
