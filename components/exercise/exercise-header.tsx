import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Exercise } from "@/types/exercise"

const difficultyVariant = (difficulty: string) =>
  difficulty === "Simple" ? "outline" : difficulty === "Medium" ? "secondary" : "destructive"

interface ExerciseHeaderProps {
  exercise: Pick<Exercise, "title" | "difficulty" | "category" | "duration">
  onBack: () => void
  backLabel?: string
}

export function ExerciseHeader({ exercise, onBack, backLabel = "Back to Exercises" }: ExerciseHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-col gap-4 md:flex-row">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{exercise.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={difficultyVariant(exercise.difficulty)}>{exercise.difficulty}</Badge>
          <Badge variant="outline">{exercise.category}</Badge>
          <span className="text-sm text-muted-foreground">{exercise.duration}</span>
        </div>
      </div>
      <Button variant="outline" onClick={onBack}>
        {backLabel}
      </Button>
    </div>
  )
}