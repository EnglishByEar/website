"use client"

import { useCallback } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { saveResultToLocalStorage } from "@/lib/local-result"
import type { Exercise, ExerciseScore } from "@/types/exercise"

interface SubmitParams {
  exercise: Exercise
  userText: string
  score: ExerciseScore
}

/** Persists a result (Supabase first, localStorage fallback), shows a toast and notifies the dashboard. */
export function useExerciseSubmission() {
  const ctx = useSupabase()
  const supabase = ctx?.supabase ?? null
  const user = ctx?.user ?? null
  const { toast } = useToast()

  const submitResult = useCallback(
    async ({ exercise, userText, score }: SubmitParams) => {
      let savedToDatabase = false
      let savedToLocalStorage = false

      if (user && supabase && typeof exercise.id === "number") {
        try {
          const { error } = await supabase.from("exercise_results").insert({
            user_id: user.id,
            exercise_id: exercise.id,
            user_text: userText,
            accuracy: score.accuracy,
            mistakes: score.mistakes,
            completed_at: new Date().toISOString(),
          })

          if (error) {
            console.error("Supabase insert error:", {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            })
          } else {
            savedToDatabase = true
          }
        } catch (err) {
          console.error("Unexpected DB error when saving results:", err)
        }
      }

      if (!savedToDatabase) {
        savedToLocalStorage = saveResultToLocalStorage({ userId: user?.id, exercise, userText, score })
      }

      const where = savedToDatabase
        ? " Results were saved to your profile."
        : savedToLocalStorage
          ? " Results were saved locally on this device."
          : " Results could not be saved."

      toast({
        title: "Exercise completed!",
        description: `You scored ${score.accuracy}% accuracy.${where}`,
        variant: savedToDatabase || savedToLocalStorage ? "default" : "destructive",
      })

      window.dispatchEvent(
        new CustomEvent("exerciseCompleted", {
          detail: {
            exerciseId: exercise.id,
            accuracy: score.accuracy,
            savedToDatabase,
            savedToLocalStorage,
            userId: user?.id,
          },
        }),
      )

      return { savedToDatabase, savedToLocalStorage }
    },
    [supabase, user, toast],
  )

  return { submitResult }
}