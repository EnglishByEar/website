import type { GrammarLesson } from '@/types/grammar'

export const tensesLessons: GrammarLesson[] = [
  {
    id: 'present-simple',
    title: 'Present Simple',
    category: 'tenses',
    description: 'Learn to express habits, routines, and general truths',
    formula: {
      structure: 'Subject + Verb (Base Form or Third Person Singular)',
      breakdown:
        'I/You/We/They + verb | He/She/It + verb+s/es',
    },
    explanation:
      'The Present Simple tense is used to describe actions that happen regularly or are generally true. It is one of the most common tenses in English and is used to talk about habits, routines, facts, and schedules.',
    examples: [
      { sentence: 'I eat breakfast every morning.', translation: 'Comé desayuno cada mañana.' },
      { sentence: 'She works in a hospital.' },
      { sentence: 'They play football on weekends.' },
      { sentence: 'Water boils at 100 degrees Celsius.' },
    ],
    commonMistakes: [
      {
        incorrect: 'He go to school every day.',
        correct: 'He goes to school every day.',
        explanation: 'Add -s to the verb for he/she/it subjects',
      },
      {
        incorrect: 'She do not like coffee.',
        correct: 'She does not like coffee.',
        explanation: 'Use "does" as auxiliary for he/she/it in questions and negatives',
      },
    ],
    signalWords: ['always', 'usually', 'often', 'sometimes', 'every day/week', 'never', 'rarely'],
    usage: 'Habits, routines, general truths, facts, scheduled events',
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    category: 'tenses',
    description: 'Describe actions happening right now or around now',
    formula: {
      structure: 'Subject + am/is/are + Verb-ing',
    },
    explanation:
      'The Present Continuous tense describes an action that is currently happening or ongoing. Use it for temporary situations or activities in progress.',
    examples: [
      { sentence: 'I am studying English right now.' },
      { sentence: 'She is cooking dinner.' },
      { sentence: 'They are playing in the park.' },
      { sentence: 'We are listening to music at the moment.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I am work on my project.',
        correct: 'I am working on my project.',
        explanation: 'Add -ing to the verb after the auxiliary',
      },
      {
        incorrect: 'He is go to school.',
        correct: 'He is going to school.',
        explanation: 'Use the correct form of "to be" (is, am, are)',
      },
    ],
    signalWords: ['now', 'at the moment', 'right now', 'today', 'this week'],
    usage: 'Actions happening now, temporary situations, future plans',
  },
  {
    id: 'past-simple',
    title: 'Past Simple',
    category: 'tenses',
    description: 'Talk about completed actions in the past',
    formula: {
      structure: 'Subject + Verb (Past Tense)',
      breakdown: 'Regular verbs: verb + ed | Irregular verbs: special forms',
    },
    explanation:
      'The Past Simple tense is used to talk about actions that were completed at a specific time in the past. These actions are completely finished and no longer happening.',
    examples: [
      { sentence: 'I watched a movie yesterday.' },
      { sentence: 'She went to Paris last summer.' },
      { sentence: 'They ate pizza for dinner.' },
      { sentence: 'I did not study yesterday.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I go to school yesterday.',
        correct: 'I went to school yesterday.',
        explanation: 'Use the past form of the verb',
      },
      {
        incorrect: 'She worked hard but not get the job.',
        correct: 'She worked hard but did not get the job.',
        explanation: 'Maintain consistent tense throughout',
      },
    ],
    signalWords: ['yesterday', 'last year/month/week', 'ago', 'in 2020', 'then'],
    usage: 'Completed past actions, past facts, historical events',
  },
  {
    id: 'past-continuous',
    title: 'Past Continuous',
    category: 'tenses',
    description: 'Describe actions in progress at a specific time in the past',
    formula: {
      structure: 'Subject + was/were + Verb-ing',
    },
    explanation:
      'The Past Continuous tense describes an action that was happening at a specific time in the past. Often used with the Past Simple to show interruptions.',
    examples: [
      { sentence: 'I was reading when you called.' },
      { sentence: 'She was sleeping at midnight.' },
      { sentence: 'They were playing when it started to rain.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I was watch TV.',
        correct: 'I was watching TV.',
        explanation: 'Add -ing to the main verb',
      },
      {
        incorrect: 'He were studying at 5 PM.',
        correct: 'He was studying at 5 PM.',
        explanation: 'Use "was" for singular subjects (he, she, it)',
      },
    ],
    signalWords: ['at that moment', 'at 5 PM', 'while', 'when', 'all day yesterday'],
    usage: 'Interrupted actions, simultaneous past actions, background events',
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect',
    category: 'tenses',
    description: 'Connect past actions to the present',
    formula: {
      structure: 'Subject + have/has + Past Participle',
    },
    explanation:
      'The Present Perfect tense connects the past and the present. It describes an action that happened at an unspecified time in the past or an action that started in the past and continues to the present.',
    examples: [
      { sentence: 'I have visited Spain three times.' },
      { sentence: 'She has lived in London for 5 years.' },
      { sentence: 'They have already finished their homework.' },
      { sentence: 'Have you ever been to Japan?' },
    ],
    commonMistakes: [
      {
        incorrect: 'I have go to that restaurant.',
        correct: 'I have been to that restaurant.',
        explanation: 'Use the past participle form',
      },
      {
        incorrect: 'She has live in this house since 2020.',
        correct: 'She has lived in this house since 2020.',
        explanation: 'Use the correct past participle',
      },
    ],
    signalWords: ['just', 'already', 'yet', 'ever', 'never', 'since', 'for'],
    usage: 'Unspecified past time, recent events, ongoing situations',
  },
  {
    id: 'present-perfect-continuous',
    title: 'Present Perfect Continuous',
    category: 'tenses',
    description: 'Show how long an action has been happening',
    formula: {
      structure: 'Subject + have/has + been + Verb-ing',
    },
    explanation:
      'The Present Perfect Continuous tense emphasizes the duration of an action that started in the past and continues to the present. Focus is on the activity rather than the result.',
    examples: [
      { sentence: 'I have been learning English for 3 years.' },
      { sentence: 'She has been working here since 2019.' },
      { sentence: 'They have been playing football all afternoon.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I have been study for hours.',
        correct: 'I have been studying for hours.',
        explanation: 'Add -ing to the main verb',
      },
      {
        incorrect: 'She have been waiting.',
        correct: 'She has been waiting.',
        explanation: 'Use "has" for singular subjects',
      },
    ],
    signalWords: ['for', 'since', 'all day', 'how long', 'recently'],
    usage: 'Ongoing activities from past to present, duration emphasis',
  },
  {
    id: 'past-perfect',
    title: 'Past Perfect',
    category: 'tenses',
    description: 'Show the order of past events',
    formula: {
      structure: 'Subject + had + Past Participle',
    },
    explanation:
      'The Past Perfect tense is used to show that one action in the past happened before another action in the past. It shows the sequence of events.',
    examples: [
      { sentence: 'She had finished dinner before I arrived.' },
      { sentence: 'They had already left when we got there.' },
      { sentence: 'I had never seen a movie like that.' },
    ],
    commonMistakes: [
      {
        incorrect: 'He had go to school.',
        correct: 'He had gone to school.',
        explanation: 'Use the past participle after "had"',
      },
      {
        incorrect: 'They had studied hard but not pass the exam.',
        correct: 'They had studied hard but did not pass the exam.',
        explanation: 'Use "did not" for the later action in past simple',
      },
    ],
    signalWords: ['before', 'after', 'by the time', 'already', 'just', 'never'],
    usage: 'Sequence of past events, showing what happened first',
  },
  {
    id: 'past-perfect-continuous',
    title: 'Past Perfect Continuous',
    category: 'tenses',
    description: 'Show how long something had been happening before another event',
    formula: {
      structure: 'Subject + had + been + Verb-ing',
    },
    explanation:
      'The Past Perfect Continuous tense emphasizes the duration of an action that had been in progress before another past action interrupted it.',
    examples: [
      { sentence: 'I had been waiting for an hour when he finally arrived.' },
      { sentence: 'She had been working on the project for months.' },
      { sentence: 'They had been playing tennis when it started to rain.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I had been wait for hours.',
        correct: 'I had been waiting for hours.',
        explanation: 'Add -ing to the main verb',
      },
    ],
    signalWords: ['for', 'by the time', 'before', 'when', 'while'],
    usage: 'Duration of past activities, showing what continued before',
  },
  {
    id: 'future-simple',
    title: 'Future Simple',
    category: 'tenses',
    description: 'Talk about actions that will happen in the future',
    formula: {
      structure: 'Subject + will + Base Verb',
      breakdown: 'Or: Subject + am/is/are + going to + Base Verb',
    },
    explanation:
      'The Future Simple tense is used to talk about actions that will happen in the future. It expresses decisions made at the moment of speaking or predictions about the future.',
    examples: [
      { sentence: 'I will visit you next week.' },
      { sentence: 'She will probably call you tomorrow.' },
      { sentence: 'They are going to buy a new house.' },
      { sentence: 'It will rain this weekend.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I will goes to school tomorrow.',
        correct: 'I will go to school tomorrow.',
        explanation: 'Use the base form after "will"',
      },
      {
        incorrect: 'She will studying tomorrow.',
        correct: 'She will study tomorrow.',
        explanation: 'Do not add -ing after "will"',
      },
    ],
    signalWords: ['tomorrow', 'next week/month/year', 'in 5 years', 'soon', 'later'],
    usage: 'Future predictions, decisions, promises, plans',
  },
  {
    id: 'future-continuous',
    title: 'Future Continuous',
    category: 'tenses',
    description: 'Describe actions that will be in progress at a specific time',
    formula: {
      structure: 'Subject + will + be + Verb-ing',
    },
    explanation:
      'The Future Continuous tense describes an action that will be happening at a specific time in the future. Use it for actions that will be in progress.',
    examples: [
      { sentence: 'I will be studying at 8 PM tomorrow.' },
      { sentence: 'She will be working when you arrive.' },
      { sentence: 'They will be traveling during the summer.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I will be study English.',
        correct: 'I will be studying English.',
        explanation: 'Add -ing to the main verb',
      },
    ],
    signalWords: ['at 5 PM', 'while', 'when', 'during'],
    usage: 'Ongoing future actions, temporary future situations',
  },
  {
    id: 'future-perfect',
    title: 'Future Perfect',
    category: 'tenses',
    description: 'Show that something will be finished before a future time',
    formula: {
      structure: 'Subject + will + have + Past Participle',
    },
    explanation:
      'The Future Perfect tense shows that an action will be completed before a specific time in the future. It emphasizes the completion of an action.',
    examples: [
      { sentence: 'I will have finished my project by Friday.' },
      { sentence: 'She will have graduated next year.' },
      { sentence: 'They will have completed the work by then.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I will have go home.',
        correct: 'I will have gone home.',
        explanation: 'Use the past participle',
      },
    ],
    signalWords: ['by', 'by then', 'before', 'by the time'],
    usage: 'Completion before a future time, future deadlines',
  },
  {
    id: 'future-perfect-continuous',
    title: 'Future Perfect Continuous',
    category: 'tenses',
    description: 'Show how long something will have been happening by a future time',
    formula: {
      structure: 'Subject + will + have + been + Verb-ing',
    },
    explanation:
      'The Future Perfect Continuous tense emphasizes the duration of an action that will be in progress until a specific time in the future.',
    examples: [
      { sentence: 'By next year, I will have been working here for 5 years.' },
      { sentence: 'She will have been studying English for 3 hours by the time she takes the test.' },
    ],
    commonMistakes: [
      {
        incorrect: 'I will have been study English.',
        correct: 'I will have been studying English.',
        explanation: 'Add -ing to the main verb',
      },
    ],
    signalWords: ['by', 'by then', 'for', 'since'],
    usage: 'Duration of future actions, future progress emphasis',
  },
]

export function getLessonBySlug(slug: string): GrammarLesson | undefined {
  return tensesLessons.find((lesson) => lesson.id === slug)
}

export function getLessonsByCategory(categoryId: string): GrammarLesson[] {
  return tensesLessons.filter((lesson) => lesson.category === categoryId)
}
