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
    {
        id: 'simple-sentences',
        title: 'Simple Sentences',
        category: 'sentence-structure',
        description: 'Build clear sentences with one independent clause.',
        formula: { structure: 'One independent clause', breakdown: 'Subject + predicate = one complete thought.' },
        explanation: 'A simple sentence has one independent clause. It can have a compound subject or verb, but it still expresses one main idea.',
        examples: [{ sentence: 'Maya and Leo study together.' }, { sentence: 'The dog barked and ran.' }],
        commonMistakes: [{ incorrect: 'Running through the park.', correct: 'The children are running through the park.', explanation: 'Include a subject and a complete verb.' }],
        usage: 'Direct statements and strong, readable writing',
    },
    {
        id: 'compound-sentences',
        title: 'Compound Sentences',
        category: 'sentence-structure',
        description: 'Join two complete ideas with coordinating conjunctions.',
        formula: { structure: 'Independent clause + comma + coordinating conjunction + independent clause', breakdown: 'Use FANBOYS: for, and, nor, but, or, yet, so.' },
        explanation: 'Compound sentences connect two independent clauses that are related in meaning. Use a comma before the coordinating conjunction.',
        examples: [{ sentence: 'I wanted to walk, but it started raining.' }, { sentence: 'She practiced daily, so she improved quickly.' }],
        commonMistakes: [{ incorrect: 'I was hungry I made a sandwich.', correct: 'I was hungry, so I made a sandwich.', explanation: 'Use punctuation and a conjunction to avoid a run-on sentence.' }],
        usage: 'Connecting equal ideas and showing relationships',
    },
    {
        id: 'complex-sentences',
        title: 'Complex Sentences',
        category: 'sentence-structure',
        description: 'Combine a main clause with a dependent clause.',
        formula: { structure: 'Independent clause + dependent clause', breakdown: 'Subordinating conjunctions include because, although, when, if, and while.' },
        explanation: 'Complex sentences show relationships such as time, cause, contrast, or condition by combining one complete idea with a dependent clause.',
        examples: [{ sentence: 'I stayed inside because it was cold.' }, { sentence: 'Although she was nervous, she gave a great presentation.' }],
        commonMistakes: [{ incorrect: 'Although it was late. We continued.', correct: 'Although it was late, we continued.', explanation: 'Keep the dependent clause connected to the main clause.' }],
        usage: 'Explaining reasons, conditions, time, and contrast',
    },
    {
        id: 'questions-and-negatives',
        title: 'Questions and Negatives',
        category: 'sentence-structure',
        description: 'Form natural questions and negative statements.',
        formula: { structure: 'Auxiliary + subject + main verb?', breakdown: 'Use do, does, or did when there is no other auxiliary verb.' },
        explanation: 'English questions often change the word order by placing an auxiliary verb before the subject. Negative sentences usually add not after the auxiliary.',
        examples: [{ sentence: 'Do you like this book?' }, { sentence: 'She does not live nearby.' }, { sentence: 'Were they ready?' }],
        commonMistakes: [{ incorrect: 'You like coffee?', correct: 'Do you like coffee?', explanation: 'Use do to form a present simple question.' }],
        usage: 'Asking for information and expressing disagreement or absence',
    },
]


export function getSentenceLessonBySlug(slug: string) {
  return sentenceStructureLessons.find((lesson) => lesson.id === slug)
}