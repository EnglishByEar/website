import type { GrammarLesson } from '@/types/grammar'

export const partsOfSpeechLessons: GrammarLesson[] = [
  {
    id: 'nouns', title: 'Nouns', category: 'parts-of-speech', description: 'Name people, places, things, and ideas.',
    formula: { structure: 'Noun = person, place, thing, or idea', breakdown: 'Nouns can be common or proper, concrete or abstract, singular or plural.' },
    explanation: 'Nouns give names to the subjects and objects we talk about. They can be the subject of a sentence, receive an action, or show ownership.',
    examples: [{ sentence: 'The student opened the book.' }, { sentence: 'Honesty builds trust.' }, { sentence: 'London is a busy city.' }],
    commonMistakes: [{ incorrect: 'She has two cat.', correct: 'She has two cats.', explanation: 'Countable plural nouns usually need -s or -es.' }], signalWords: ['person', 'place', 'thing'],
  },
  {
    id: 'pronouns', title: 'Pronouns', category: 'parts-of-speech', description: 'Replace nouns to make sentences smoother.',
    formula: { structure: 'Subject pronoun + verb / Object pronoun after a verb or preposition', breakdown: 'I, you, he, she, it, we, and they are subject pronouns.' },
    explanation: 'Pronouns refer back to nouns. Use subject pronouns for the doer of an action and object pronouns for the receiver.',
    examples: [{ sentence: 'Maria called me after she arrived.' }, { sentence: 'They invited us to dinner.' }],
    commonMistakes: [{ incorrect: 'Him and I went home.', correct: 'He and I went home.', explanation: 'Use subject pronouns when they perform the action.' }], signalWords: ['I', 'you', 'they'],
  },
  {
    id: 'verbs', title: 'Verbs', category: 'parts-of-speech', description: 'Show actions, events, and states of being.',
    formula: { structure: 'Subject + verb', breakdown: 'Verbs change for tense, person, number, and sometimes voice.' },
    explanation: 'Every complete sentence needs a verb. Action verbs show what happens, while linking verbs connect a subject to information about it.',
    examples: [{ sentence: 'The children laughed loudly.' }, { sentence: 'The soup smells delicious.' }],
    commonMistakes: [{ incorrect: 'She walk to work.', correct: 'She walks to work.', explanation: 'In the present simple, he, she, and it usually take -s.' }], signalWords: ['action', 'event', 'state'],
  },
  {
    id: 'adjectives', title: 'Adjectives', category: 'parts-of-speech', description: 'Describe or give more information about nouns.',
    formula: { structure: 'Adjective + noun / Linking verb + adjective', breakdown: 'Adjectives can describe size, color, age, opinion, and many other qualities.' },
    explanation: 'Adjectives make writing more precise by describing nouns or pronouns. They often come before a noun or after a linking verb.',
    examples: [{ sentence: 'We bought a comfortable chair.' }, { sentence: 'The sky became dark.' }],
    commonMistakes: [{ incorrect: 'She sings beautiful.', correct: 'She sings beautifully.', explanation: 'Use an adverb to describe how an action is performed.' }], signalWords: ['what kind', 'which one', 'how many'],
  },
  {
    id: 'adverbs', title: 'Adverbs', category: 'parts-of-speech', description: 'Modify verbs, adjectives, other adverbs, or whole clauses.',
    formula: { structure: 'Adverb + adjective/adverb or verb + adverb', breakdown: 'Adverbs can show manner, time, place, frequency, or degree.' },
    explanation: 'Adverbs add detail about when, where, how, or how often something happens. Many, but not all, end in -ly.',
    examples: [{ sentence: 'He carefully checked the answer.' }, { sentence: 'We often study together.' }],
    commonMistakes: [{ incorrect: 'She speaks English fluent.', correct: 'She speaks English fluently.', explanation: 'Use an adverb to modify the verb speaks.' }], signalWords: ['how', 'when', 'where'],
  },
  {
    id: 'prepositions', title: 'Prepositions', category: 'parts-of-speech', description: 'Show relationships of time, place, direction, and more.',
    formula: { structure: 'Preposition + noun/pronoun', breakdown: 'The noun or pronoun after a preposition is its object.' },
    explanation: 'Prepositions connect words and show relationships such as location, movement, time, or connection.',
    examples: [{ sentence: 'The keys are under the table.' }, { sentence: 'We met after lunch.' }],
    commonMistakes: [{ incorrect: 'She is good in math.', correct: 'She is good at math.', explanation: 'Some adjectives pair with specific prepositions.' }], signalWords: ['in', 'on', 'at'],
  },
  {
    id: 'conjunctions', title: 'Conjunctions', category: 'parts-of-speech', description: 'Connect words, phrases, and clauses.',
    formula: { structure: 'Independent clause + conjunction + independent clause', breakdown: 'Coordinating conjunctions include for, and, nor, but, or, yet, and so.' },
    explanation: 'Conjunctions help ideas flow together. Choose a conjunction based on the relationship between the ideas.',
    examples: [{ sentence: 'I wanted to go, but I was tired.' }, { sentence: 'Tea and coffee are available.' }],
    commonMistakes: [{ incorrect: 'Because I was late. I ran.', correct: 'Because I was late, I ran.', explanation: 'A dependent clause beginning with because needs a main clause.' }], signalWords: ['and', 'but', 'because'],
  },
  {
    id: 'interjections', title: 'Interjections', category: 'parts-of-speech', description: 'Express sudden feelings, reactions, or emphasis.',
    formula: { structure: 'Interjection + punctuation', breakdown: 'Interjections are often separated with a comma or an exclamation mark.' },
    explanation: 'Interjections are short expressions that show emotion or reaction. They are more common in conversation and informal writing.',
    examples: [{ sentence: 'Wow! That was an impressive performance.' }, { sentence: 'Oh, I forgot my keys.' }],
    commonMistakes: [{ incorrect: 'Wow that is amazing!', correct: 'Wow, that is amazing!', explanation: 'Use a comma when the interjection is mild and connected to the sentence.' }], signalWords: ['wow', 'oh', 'ouch'],
  },
  {
    id: 'determiners', title: 'Determiners', category: 'parts-of-speech', description: 'Introduce nouns and show quantity or ownership.',
    formula: { structure: 'Determiner + noun', breakdown: 'Articles, demonstratives, possessives, and quantifiers can act as determiners.' },
    explanation: 'Determiners help listeners understand which noun you mean and whether it is specific, general, singular, plural, or owned by someone.',
    examples: [{ sentence: 'I need an umbrella.' }, { sentence: 'Those books are mine.' }],
    commonMistakes: [{ incorrect: 'She is teacher.', correct: 'She is a teacher.', explanation: 'Singular countable nouns usually need a determiner.' }], signalWords: ['a', 'the', 'this'],
  },
  {
    id: 'word-classes-review', title: 'Parts of Speech Review', category: 'parts-of-speech', description: 'Practice identifying how words work in complete sentences.',
    formula: { structure: 'Context determines a word’s part of speech', breakdown: 'The same word can serve different roles in different sentences.' },
    explanation: 'Reviewing parts of speech in context helps you understand sentence meaning and write with greater accuracy.',
    examples: [{ sentence: 'I clean the room every day. The room is clean.' }, { sentence: 'They work hard. Their hard work paid off.' }],
    commonMistakes: [{ incorrect: 'Label every word by its dictionary definition.', correct: 'Identify each word by its role in the sentence.', explanation: 'A word’s function can change depending on how it is used.' }], signalWords: ['review', 'context', 'practice'],
  },
]

export function getPartsLessonBySlug(slug: string) {
  return partsOfSpeechLessons.find((lesson) => lesson.id === slug)
}

export function getLessonsByCategory(categoryId: string): GrammarLesson[] {
  return partsOfSpeechLessons.filter((lesson) => lesson.category === categoryId)
}