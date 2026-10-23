export type ReadingLevel = "Elementary" | "Intermediate" | "Advanced"
export type ReadingQuestionType = "true_false" | "fill_blank"

export interface ReadingPassageSummary {
  id: string
  title: string
  description: string | null
  level: ReadingLevel
  estimated_reading_minutes: number
}

export interface ReadingPassage extends ReadingPassageSummary {
  content: string
}

export interface ReadingWord {
  id: string
  word: string
  definition: string
  example_sentence: string | null
}

/** What the learner sees before submitting. No answers, no explanations. */
export interface ReadingQuestion {
  id: string
  question_type: ReadingQuestionType
  question_text: string
  sort_order: number
}

/** Row from reading_attempts (learners can only read their own) */
export interface ReadingAttemptRow {
  id: string
  passage_id: string
  status: "in_progress" | "completed"
  score_percentage: number | null
  total_correct: number
  total_questions: number
  completed_at: string | null
}

/** Payload for submit_reading_attempt: question id -> typed/selected answer */
export type ReadingAnswers = Record<string, string>

export interface ReadingResultQuestion {
  id: string
  question_type: ReadingQuestionType
  question_text: string
  sort_order: number
  user_answer: string | null
  is_correct: boolean
  correct_answer: string
  explanation: string | null
}

export interface ReadingResults {
  attempt: {
    id: string
    passage_id: string
    passage_title: string
    passage_level: ReadingLevel
    true_false_correct: number
    true_false_total: number
    fill_blank_correct: number
    fill_blank_total: number
    total_correct: number
    total_questions: number
    score_percentage: number
    completed_at: string
  }
  questions: ReadingResultQuestion[]
  vocabulary: ReadingWord[]
}
