"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { SearchX, Headphones } from "lucide-react"
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
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center text-muted-foreground">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Headphones className="h-8 w-8 animate-pulse motion-reduce:animate-none" />
        </div>
        <p>Getting your exercise ready...</p>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <SearchX className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">We couldn't find that exercise</h2>
          <p className="text-sm text-muted-foreground">It may have been moved or removed. Pick another one to keep practicing.</p>
        </div>
        <Button onClick={() => router.push(EXERCISES_PATH)}>Back to exercises</Button>
      </div>
    )
  }

  return (
    <main className="w-full min-w-0 bg-background">
      <div className="mx-auto grid w-full min-w-0 max-w-4xl grid-cols-1 gap-4 px-2 py-3 sm:gap-6 sm:px-4 sm:py-4 [&>*]:min-w-0">
        <ExerciseHeader onBack={() => router.push(EXERCISES_PATH)} />
        <ListeningExercise key={exercise.id} exercise={exercise} onNext={() => router.push(EXERCISES_PATH)} />
      </div>
    </main>
  )
}