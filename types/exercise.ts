export interface Exercise {
  id: number | string
  title: string
  difficulty: "Simple" | "Medium" | "Advanced" | string
  category: string
  duration: string
  text: string
  audio_url?: string | null
}

export interface ExerciseScore {
  accuracy: number
  mistakes: number
  totalWords: number
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