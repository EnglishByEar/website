import type { GrammarLesson } from '@/types/grammar'

export const prepositionLessons: GrammarLesson[] = [
  {
    id: 'prepositions-of-time',
    title: 'Prepositions of Time',
    category: 'prepositions',
    description: 'Use at, on, and in to talk about when events happen.',
    formula: { structure: 'at + exact time | on + day/date | in + longer period', breakdown: 'at 7:00; on Monday; in July' },
    explanation: 'Use at for precise times, on for days and dates, and in for months, years, seasons, and longer periods.',
    examples: [
      { sentence: 'The meeting starts at nine o’clock.' },
      { sentence: 'We have class on Tuesday.' },
      { sentence: 'She moved here in 2022.' },
    ],
    commonMistakes: [
      { incorrect: 'I was born on 1998.', correct: 'I was born in 1998.', explanation: 'Use in with years.' },
      { incorrect: 'The train arrives in 6:30.', correct: 'The train arrives at 6:30.', explanation: 'Use at with exact clock times.' },
    ],
  },
  {
    id: 'prepositions-of-place',
    title: 'Prepositions of Place',
    category: 'prepositions',
    description: 'Describe where people and things are located.',
    formula: { structure: 'subject + be + preposition + place', breakdown: 'The keys are on the table.' },
    explanation: 'Use in for an enclosed space, on for a surface, and at for a general point or location.',
    examples: [
      { sentence: 'Your phone is on the desk.' },
      { sentence: 'The children are in the garden.' },
      { sentence: 'I’ll meet you at the station.' },
    ],
    commonMistakes: [
      { incorrect: 'She is in the bus stop.', correct: 'She is at the bus stop.', explanation: 'Use at for a meeting point or location.' },
      { incorrect: 'The picture is in the wall.', correct: 'The picture is on the wall.', explanation: 'Use on for something attached to a surface.' },
    ],
  },
  {
    id: 'prepositions-of-movement',
    title: 'Prepositions of Movement',
    category: 'prepositions',
    description: 'Show direction and movement from one place to another.',
    formula: { structure: 'subject + verb + movement preposition + destination', breakdown: 'They walked through the park.' },
    explanation: 'Common movement prepositions include to, from, into, out of, through, across, over, and toward.',
    examples: [
      { sentence: 'The cat jumped onto the sofa.' },
      { sentence: 'We walked across the bridge.' },
      { sentence: 'He ran out of the room.' },
    ],
    commonMistakes: [
      { incorrect: 'She entered into the room.', correct: 'She entered the room.', explanation: 'Enter already includes the idea of movement into a place.' },
      { incorrect: 'They walked in the street to the park.', correct: 'They walked along the street to the park.', explanation: 'Use along for movement following a line or route.' },
    ],
  },
  {
    id: 'prepositions-with-verbs',
    title: 'Prepositions with Verbs',
    category: 'prepositions',
    description: 'Learn common verb and preposition combinations.',
    formula: { structure: 'verb + preposition + object', breakdown: 'listen to music; depend on someone' },
    explanation: 'Many verbs naturally combine with a particular preposition. Learn these combinations as complete expressions.',
    examples: [
      { sentence: 'Please listen to the instructions.' },
      { sentence: 'This decision depends on the weather.' },
      { sentence: 'I’m waiting for the bus.' },
    ],
    commonMistakes: [
      { incorrect: 'We discussed about the plan.', correct: 'We discussed the plan.', explanation: 'Discuss takes a direct object without about.' },
      { incorrect: 'She explained me the problem.', correct: 'She explained the problem to me.', explanation: 'Explain uses to before the person receiving the explanation.' },
    ],
  },
  {
    id: 'prepositions-with-adjectives',
    title: 'Prepositions with Adjectives',
    category: 'prepositions',
    description: 'Use fixed adjective and preposition combinations naturally.',
    formula: { structure: 'adjective + preposition + object', breakdown: 'proud of; interested in; good at' },
    explanation: 'Some adjectives are commonly followed by a specific preposition. The preposition can change the meaning, so learn the full phrase.',
    examples: [
      { sentence: 'She is interested in photography.' },
      { sentence: 'He is proud of his progress.' },
      { sentence: 'They are good at solving problems.' },
    ],
    commonMistakes: [
      { incorrect: 'I’m good in math.', correct: 'I’m good at math.', explanation: 'Use good at for an ability or skill.' },
      { incorrect: 'He is afraid from spiders.', correct: 'He is afraid of spiders.', explanation: 'The fixed expression is afraid of.' },
    ],
  },
  {
    id: 'prepositional-phrases',
    title: 'Prepositional Phrases',
    category: 'prepositions',
    description: 'Build phrases that add information about time, place, manner, and reason.',
    formula: { structure: 'preposition + noun/pronoun/gerund', breakdown: 'after lunch; with care; because of traffic' },
    explanation: 'A prepositional phrase begins with a preposition and ends with its object. It can modify a noun or add context to a verb.',
    examples: [
      { sentence: 'The book on the shelf is mine.' },
      { sentence: 'We arrived before sunset.' },
      { sentence: 'She completed the task with great care.' },
    ],
    commonMistakes: [
      { incorrect: 'Because of he was tired, he left.', correct: 'Because he was tired, he left.', explanation: 'Because introduces a clause; because of introduces a noun phrase.' },
      { incorrect: 'Despite of the rain, we went out.', correct: 'Despite the rain, we went out.', explanation: 'Despite is not followed by of.' },
    ],
  },
]

export function getPrepositionLessonBySlug(slug: string) {
  return prepositionLessons.find((lesson) => lesson.id === slug)
}

export function getLessonsByCategory(categoryId: string): GrammarLesson[] {
  return prepositionLessons.filter((lesson) => lesson.category === categoryId)
}