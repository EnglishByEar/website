import type { GrammarLesson } from '@/types/grammar'

export const sentenceStructureLessons: GrammarLesson[] = [
    {
        id: 'sentence-basics',
        title: 'Sentence Basics',
        category: 'sentence-structure',
        description: 'Understand what makes a complete English sentence.',
        formula: { structure: 'Subject + Verb (+ Object or Complement)', breakdown: 'A complete sentence needs a subject and a finite verb.' },
        explanation: 'Every complete sentence communicates a complete thought. Start by identifying who or what the sentence is about, then find the action or state that completes the idea.',
        examples: [
            { sentence: 'Birds fly.' },
            { sentence: 'The students opened their books.' },
            { sentence: 'My sister is a doctor.' },
        ],
        commonMistakes: [
            { incorrect: 'Because I was tired.', correct: 'I went home because I was tired.', explanation: 'The first example is a dependent fragment, not a complete thought.' },
            { incorrect: 'The children playing outside.', correct: 'The children are playing outside.', explanation: 'Add the helping verb are to complete the verb phrase.' },
        ],
        usage: 'Building clear, complete sentences',
    },
]