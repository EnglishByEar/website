import type { GrammarLesson } from '@/types/grammar'

export const modifierLessons: GrammarLesson[] = [
  {
    id: 'adjectives-as-modifiers',
    title: 'Adjectives as Modifiers',
    category: 'modifiers',
    description: 'Learn how adjectives describe and modify nouns and pronouns.',
    formula: { structure: 'Adjective + Noun', breakdown: 'Place an adjective before a noun to describe its quality, size, color, or condition.' },
    explanation: 'Adjectives add detail to nouns and pronouns. They can appear before a noun or after a linking verb.',
    examples: [
      { sentence: 'She bought a beautiful dress.', translation: 'Beautiful describes the dress.' },
      { sentence: 'The soup smells delicious.', translation: 'Delicious describes the soup after a linking verb.' },
    ],
    commonMistakes: [
      { incorrect: 'He is a man tall.', correct: 'He is a tall man.', explanation: 'Attributive adjectives usually come before the noun.' },
    ],
    usage: 'Use adjectives to make descriptions more precise and vivid.',
  },
  {
    id: 'adverbs-as-modifiers',
    title: 'Adverbs as Modifiers',
    category: 'modifiers',
    description: 'Understand how adverbs modify verbs, adjectives, and other adverbs.',
    formula: { structure: 'Verb + Adverb / Adverb + Adjective', breakdown: 'Adverbs explain how, when, where, or how much something happens.' },
    explanation: 'Adverbs give more information about actions and descriptions. Their position can change depending on what they modify.',
    examples: [
      { sentence: 'The child spoke quietly.', translation: 'Quietly explains how the child spoke.' },
      { sentence: 'That is an extremely useful guide.', translation: 'Extremely modifies the adjective useful.' },
    ],
    commonMistakes: [
      { incorrect: 'She sings beautiful.', correct: 'She sings beautifully.', explanation: 'Use an adverb to modify the verb sings.' },
    ],
    usage: 'Use adverbs carefully; strong verbs often need fewer adverbs.',
  },
  {
    id: 'participial-phrases',
    title: 'Participial Phrases',
    category: 'modifiers',
    description: 'Use present and past participial phrases to add concise detail.',
    formula: { structure: 'Participial phrase, + main clause', breakdown: 'The phrase must clearly modify the noun that follows or precedes it.' },
    explanation: 'Participial phrases begin with a present participle ending in -ing or a past participle. They combine description with sentence variety.',
    examples: [
      { sentence: 'Running through the park, Maya felt refreshed.' },
      { sentence: 'Tired after the journey, the travelers rested.' },
    ],
    commonMistakes: [
      { incorrect: 'Walking to school, the rain started.', correct: 'Walking to school, I felt the rain start.', explanation: 'The modifier must describe the person or thing doing the walking.' },
    ],
    usage: 'Use a comma after an introductory participial phrase.',
  },
  {
    id: 'misplaced-modifiers',
    title: 'Misplaced Modifiers',
    category: 'modifiers',
    description: 'Place modifiers close to the words they describe for clear meaning.',
    formula: { structure: 'Modifier + word it modifies', breakdown: 'Keep descriptive words and phrases next to their intended targets.' },
    explanation: 'A misplaced modifier is separated from the word it should describe, which can create confusion or an unintended meaning.',
    examples: [
      { sentence: 'She served sandwiches to the children on paper plates.', translation: 'The placement may suggest the children are on paper plates.' },
      { sentence: 'She served the children sandwiches on paper plates.', translation: 'Now on paper plates clearly modifies sandwiches.' },
    ],
    commonMistakes: [
      { incorrect: 'He almost drove his car for six hours.', correct: 'He drove his car for almost six hours.', explanation: 'Almost should modify the amount of time.' },
    ],
    usage: 'Read sentences for the meaning a modifier appears to create, not only the meaning you intended.',
  },
  {
    id: 'dangling-modifiers',
    title: 'Dangling Modifiers',
    category: 'modifiers',
    description: 'Identify and repair modifiers that lack a clear subject.',
    formula: { structure: 'Introductory modifier, + clear subject + verb', breakdown: 'The subject immediately after the modifier should perform the action in the modifier.' },
    explanation: 'A dangling modifier has no logical word to modify. Rewrite the sentence by naming the actor or changing the structure.',
    examples: [
      { sentence: 'After reading the report, I understood the problem.' },
      { sentence: 'To save time, the team used a shared document.' },
    ],
    commonMistakes: [
      { incorrect: 'After reading the report, the problem became clear.', correct: 'After reading the report, I understood the problem.', explanation: 'The problem cannot read the report; the reader must be the subject.' },
    ],
    usage: 'Check that the grammatical subject can logically perform the action in the opening phrase.',
  },
]

export function getModifierLessonBySlug(slug: string) {
  return modifierLessons.find((lesson) => lesson.id === slug)
}

export function getLessonsByCategory(categoryId: string): GrammarLesson[] {
  return modifierLessons.filter((lesson) => lesson.category === categoryId)
}