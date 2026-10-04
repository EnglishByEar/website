import { Progress } from "@/components/ui/progress"
import type { ExerciseScore } from "@/types/exercise"

interface ResultsPanelProps {
  score: ExerciseScore
  userText: string
}

export function ResultsPanel({ score, userText }: ResultsPanelProps) {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h3 className="font-medium">Your Results:</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Accuracy</p>
          <div className="flex items-center gap-2">
            <Progress value={score.accuracy} className="h-2" />
            <span className="font-medium">{score.accuracy}%</span>
          </div>
        </div>
        <Stat label="Mistakes" value={score.mistakes} />
        <Stat label="Words" value={score.totalWords} />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Your Answer:</h4>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">{userText}</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}