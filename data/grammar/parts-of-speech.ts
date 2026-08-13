import type { GrammarLesson } from '@/types/grammar'

export const partsOfSpeechLessons: GrammarLesson[] = [
  {
    id: 'nouns', title: 'Nouns', category: 'parts-of-speech', description: 'Name people, places, things, and ideas.',
    formula: { structure: 'Noun = person, place, thing, or idea', breakdown: 'Nouns can be common or proper, concrete or abstract, singular or plural.' },
    explanation: 'Nouns give names to the subjects and objects we talk about. They can be the subject of a sentence, receive an action, or show ownership.',
    examples: [{ sentence: 'The student opened the book.' }, { sentence: 'Honesty builds trust.' }, { sentence: 'London is a busy city.' }],
    commonMistakes: [{ incorrect: 'She has two cat.', correct: 'She has two cats.', explanation: 'Countable plural nouns usually need -s or -es.' }], signalWords: ['person', 'place', 'thing'],
  },
  
]

export function getPartsLessonBySlug(slug: string) {
  return partsOfSpeechLessons.find((lesson) => lesson.id === slug)
}

export function getLessonsByCategory(categoryId: string): GrammarLesson[] {
  return partsOfSpeechLessons.filter((lesson) => lesson.category === categoryId)
}