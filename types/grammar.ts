export interface Example {
  sentence: string
  translation?: string
}

export interface CommonMistake {
  incorrect: string
  correct: string
  explanation: string
}

export interface Formula {
  structure: string
  breakdown?: string
}

export interface GrammarLesson {
  id: string
  title: string
  category: string
  description: string
  formula: Formula
  explanation: string
  examples: Example[]
  commonMistakes: CommonMistake[]
  signalWords?: string[]
  usage?: string
  relatedTopics?: string[]
}

export interface GrammarCategory {
  id: string
  title: string
  description: string
  slug: string
  icon?: string
  lessonCount: number
}
