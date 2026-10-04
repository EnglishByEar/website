import type { Exercise, ExerciseScore, StoredExerciseResult } from "@/types/exercise"

const USER_LIMIT = 50
const GLOBAL_LIMIT = 200
const GLOBAL_KEY = "englishbyear_results"

const readList = (key: string): StoredExerciseResult[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}

const prependAndTrim = (key: string, item: StoredExerciseResult, limit: number) => {
  const list = [item, ...readList(key)].slice(0, limit)
  localStorage.setItem(key, JSON.stringify(list))
}

interface SaveParams {
  userId?: string | null
  exercise: Exercise
  userText: string
  score: ExerciseScore
}

/** Saves a result per user and to the shared global list. Returns true on success. */
export function saveResultToLocalStorage({ userId, exercise, userText, score }: SaveParams): boolean {
  try {
    const uid = userId || "anonymous"
    const result: StoredExerciseResult = {
      id: Date.now(),
      user_id: uid,
      exercise_id: exercise.id,
      exercise_title: exercise.title,
      exercise_difficulty: exercise.difficulty,
      exercise_category: exercise.category,
      user_text: userText,
      accuracy: score.accuracy,
      mistakes: score.mistakes,
      completed_at: new Date().toISOString(),
    }

    prependAndTrim(`${GLOBAL_KEY}_${uid}`, result, USER_LIMIT)
    prependAndTrim(GLOBAL_KEY, result, GLOBAL_LIMIT) // backward compatibility
    return true
  } catch (error) {
    console.error("Error saving to localStorage:", error)
    return false
  }
}