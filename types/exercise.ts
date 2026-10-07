export interface Exercise {
  id: number | string
  title: string
  difficulty: "Simple" | "Medium" | "Advanced" | string
  category: string
  duration: string
  text: string
  audio_url?: string | null
}

/**
 * correct: typed word matches
 * wrong:   typed a different word (typed + expected)
 * missing: word was in the audio but not typed (expected)
 * extra:   word was typed but not in the audio (typed)
 */
export type DiffType = "correct" | "wrong" | "missing" | "extra"

export interface DiffToken {
  type: DiffType
  typed?: string
  expected?: string
}

export interface ExerciseScore {
  accuracy: number
  mistakes: number
  totalWords: number
  diff: DiffToken[]
}

export interface StoredExerciseResult {
  id: number
  user_id: string
  exercise_id: number | string
  exercise_title: string
  exercise_difficulty: string
  exercise_category: string
  user_text: string
  accuracy: number
  mistakes: number
  completed_at: string
}