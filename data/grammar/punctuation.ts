import type { GrammarLesson } from '@/types/grammar'

export const punctuationLessons: GrammarLesson[] = [
  {
    id: 'periods-question-exclamation',
    title: 'End Marks',
    category: 'punctuation',
    description: 'Use periods, question marks, and exclamation points correctly.',
    formula: { structure: 'Statement + . / Question + ? / Strong feeling + !', breakdown: 'Every complete sentence ends with one closing mark that matches its purpose.' },
    explanation: 'End marks show where a sentence stops and signal its purpose. A period ends a statement or command, a question mark ends a direct question, and an exclamation point shows strong emotion or emphasis.',
    examples: [
      { sentence: 'The library closes at nine.' },
      { sentence: 'Where did you put my notebook?' },
      { sentence: 'Watch out for that step!' },
    ],
    commonMistakes: [
      { incorrect: 'I asked where she was going?', correct: 'I asked where she was going.', explanation: 'An indirect question is a statement, so it ends with a period.' },
    ],
    signalWords: ['period', 'question mark', 'exclamation'],
  },
  {
    id: 'commas',
    title: 'Commas',
    category: 'punctuation',
    description: 'Separate items, clauses, and introductory phrases.',
    formula: { structure: 'Item, item, and item / Introductory phrase, main clause', breakdown: 'Commas create short pauses that keep ideas clear and readable.' },
    explanation: 'Commas separate items in a list, set off introductory words, and divide clauses. They prevent confusion by grouping related words and marking natural pauses.',
    examples: [
      { sentence: 'We bought apples, bread, and cheese.' },
      { sentence: 'After the meeting, we went for lunch.' },
      { sentence: 'My brother, who lives in Rome, is visiting.' },
    ],
    commonMistakes: [
      { incorrect: 'I like tea he likes coffee.', correct: 'I like tea, and he likes coffee.', explanation: 'Join two independent clauses with a comma plus a coordinating conjunction.' },
    ],
    signalWords: ['list', 'pause', 'clause'],
  },
  {
    id: 'apostrophes',
    title: 'Apostrophes',
    category: 'punctuation',
    description: 'Show possession and form contractions.',
    formula: { structure: "Noun + 's (possession) / verb contraction (it's = it is)", breakdown: 'Apostrophes mark ownership or replace missing letters.' },
    explanation: 'Apostrophes have two main jobs: showing that something belongs to someone and marking where letters are left out in contractions.',
    examples: [
      { sentence: "Sara's bag is on the table." },
      { sentence: "It's going to rain later." },
      { sentence: "The students' projects were excellent." },
    ],
    commonMistakes: [
      { incorrect: 'Its raining outside.', correct: "It's raining outside.", explanation: "It's means it is, while its shows possession." },
    ],
    signalWords: ['possession', 'contraction', 'ownership'],
  },
  {
    id: 'quotation-marks',
    title: 'Quotation Marks',
    category: 'punctuation',
    description: 'Mark direct speech and quoted material.',
    formula: { structure: 'Speaker said, "Exact words."', breakdown: 'Quotation marks surround the exact words someone speaks or writes.' },
    explanation: 'Quotation marks show the precise words of a speaker or a quoted source. In American style, periods and commas go inside the closing quotation marks.',
    examples: [
      { sentence: 'She said, "I will be there soon."' },
      { sentence: '"Let\'s begin," the teacher announced.' },
    ],
    commonMistakes: [
      { incorrect: 'He said that "he was tired".', correct: 'He said, "I am tired."', explanation: 'Use quotation marks only for exact words, not for reported speech.' },
    ],
    signalWords: ['said', 'quote', 'speech'],
  },
  {
    id: 'colons-semicolons',
    title: 'Colons and Semicolons',
    category: 'punctuation',
    description: 'Introduce lists and link related clauses.',
    formula: { structure: 'Clause: list / Independent clause; independent clause', breakdown: 'A colon introduces, while a semicolon connects closely related ideas.' },
    explanation: 'A colon introduces a list, explanation, or example after a complete sentence. A semicolon joins two closely related independent clauses without a conjunction.',
    examples: [
      { sentence: 'Bring three things: a pen, paper, and an idea.' },
      { sentence: 'The train was late; we missed the meeting.' },
    ],
    commonMistakes: [
      { incorrect: 'I need: milk and eggs.', correct: 'I need two items: milk and eggs.', explanation: 'Use a colon only after a complete independent clause.' },
    ],
    signalWords: ['colon', 'semicolon', 'list'],
  },
  {
    id: 'hyphens-dashes',
    title: 'Hyphens and Dashes',
    category: 'punctuation',
    description: 'Join words and set off extra information.',
    formula: { structure: 'well-known (hyphen) / clause — extra detail — clause (dash)', breakdown: 'A hyphen links words; a dash adds emphasis or a break.' },
    explanation: 'Hyphens connect compound words and prefixes, keeping meaning clear. Dashes are longer and set off extra information or create a strong pause.',
    examples: [
      { sentence: 'She is a well-known author.' },
      { sentence: 'The results — surprising as they were — changed our plan.' },
    ],
    commonMistakes: [
      { incorrect: 'a five year old child', correct: 'a five-year-old child', explanation: 'Hyphenate compound adjectives before a noun.' },
    ],
    signalWords: ['hyphen', 'dash', 'compound'],
  },
  {
    id: 'punctuation-review',
    title: 'Punctuation Review',
    category: 'punctuation',
    description: 'Practice combining punctuation marks accurately.',
    formula: { structure: 'Match each mark to its purpose', breakdown: 'Clear punctuation guides readers through your ideas smoothly.' },
    explanation: 'Reviewing punctuation together helps you edit your writing with confidence. Read sentences aloud to hear where pauses and stops belong.',
    examples: [
      { sentence: '"Are you ready?" she asked, smiling.' },
      { sentence: 'We packed everything: food, water, and maps; then we left.' },
    ],
    commonMistakes: [
      { incorrect: 'Guess punctuation by feel alone.', correct: 'Match each mark to the rule it follows.', explanation: 'Punctuation follows patterns, so apply the rule that fits the sentence.' },
    ],
    signalWords: ['review', 'edit', 'clarity'],
  },
]

export function getPunctuationLessonBySlug(slug: string) {
  return punctuationLessons.find((lesson) => lesson.id === slug)
}

export function getLessonsByCategory(categoryId: string): GrammarLesson[] {
  return punctuationLessons.filter((lesson) => lesson.category === categoryId)
}