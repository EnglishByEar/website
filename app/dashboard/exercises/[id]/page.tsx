"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExerciseHeader } from "@/components/exercise/exercise-header"
import { ListeningExercise } from "@/components/exercise/listening-exercise"
import { useExercise } from "@/hooks/use-exercise"

const EXERCISES_PATH = "/dashboard/exercises"

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { exercise, loading } = useExercise(id)

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading exercise...</div>
  }

  if (!exercise) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center flex-col gap-4">
        <h2 className="text-xl">Exercise not found</h2>
        <Button onClick={() => router.push(EXERCISES_PATH)}>Back to Exercises</Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid gap-6">
        <ExerciseHeader exercise={exercise} onBack={() => router.push(EXERCISES_PATH)} />
        
        <ListeningExercise key={exercise.id} exercise={exercise} onNext={() => router.push(EXERCISES_PATH)} />
      </div>
    </main>
  )
}