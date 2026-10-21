import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Exercise } from "@/types/exercise"

interface ExerciseHeaderProps {
  onBack: () => void
  backLabel?: string
}

export function ExerciseHeader({  onBack, backLabel = "Back to Exercises" }: ExerciseHeaderProps) {
  return (
    <div className=" flex-col gap-4 md:flex-row mt-2">
      <Button variant="outline" onClick={onBack}>
        {backLabel}
      </Button>
    </div>
  )
}