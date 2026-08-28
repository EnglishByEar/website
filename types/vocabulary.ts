export type VocabularyLevel = 'elementary' | 'intermediate' | 'advanced'

export interface VocabularyWord {
  id: string
  word: string
  partOfSpeech: string
  pronunciation: string
  meaning: string
  synonyms: string[]
  example: string
  translation?: string
}

export interface VocabularyLevelInfo {
  level: VocabularyLevel
  title: string
  description: string
  color: string
}

export interface VocabularyGroup {
  level: VocabularyLevel
  groupIndex: number
  groupNumber: number
  words: VocabularyWord[]
}

export type QuizQuestionType = 'meaning' | 'synonym' | 'word-from-meaning'

export interface QuizQuestion {
  id: string
  type: QuizQuestionType
  word: VocabularyWord
  prompt: string
  options: string[]
  correctAnswer: string
}

export interface WordProgress {
  wordId: string
  streak: number
  mastered: boolean
  attempts: number
  correct: number
}

export interface GroupProgress {
  level: VocabularyLevel
  groupNumber: number
  words: Record<string, WordProgress>
  completed: boolean
  lastPlayedAt: string
}

export type VocabularyProgressState = Record<string, GroupProgress>

export type SessionPhase = 'flashcards' | 'quiz' | 'round-result' | 'group-complete'

export interface RoundResultSummary {
  round: number
  totalWords: number
  correctCount: number
  masteredThisRound: string[]
  stillLearning: string[]
}
