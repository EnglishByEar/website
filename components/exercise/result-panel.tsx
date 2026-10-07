import { Progress } from "@/components/ui/progress"
import type { DiffToken, ExerciseScore } from "@/types/exercise"

interface ResultsPanelProps {
  score: ExerciseScore
}

const wrongTyped = "rounded px-1 bg-red-500/15 text-red-600 dark:text-red-400 line-through decoration-red-500"
const expectedWord = "rounded px-1 bg-green-500/15 text-green-700 dark:text-green-400 font-medium"
const missingWord =
  "rounded px-1 border border-dashed border-green-600 text-green-700 dark:text-green-400 font-medium"

export function ResultsPanel({ score }: ResultsPanelProps) {
  const perfect = score.mistakes === 0

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
        <h4 className="text-sm font-medium">{perfect ? "Your Answer:" : "Review your answer:"}</h4>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm leading-8">
            {score.diff.map((token, index) => (
              <span key={index}>
                <Word token={token} />{" "}
              </span>
            ))}
          </p>
        </div>

        {perfect ? (
          <p className="text-sm text-green-700 dark:text-green-400">Perfect! You didn&apos;t make any mistakes.</p>
        ) : (
          <Legend />
        )}
      </div>
    </div>
  )
}

function Word({ token }: { token: DiffToken }) {
  switch (token.type) {
    case "correct":
      return <span>{token.typed}</span>

    case "wrong":
      return (
        <>
          <span className={wrongTyped} title={`You typed "${token.typed}"`}>
            {token.typed}
          </span>{" "}
          <span className={expectedWord} title={`Correct word: "${token.expected}"`}>
            {token.expected}
          </span>
        </>
      )

    case "missing":
      return (
        <span className={missingWord} title={`You missed "${token.expected}"`}>
          {token.expected}
        </span>
      )

    case "extra":
      return (
        <span className={wrongTyped} title={`"${token.typed}" was not in the audio`}>
          {token.typed}
        </span>
      )
  }
}

function Legend() {
  return (
    <div className="space-y-1 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1">
          <span className={wrongTyped}>word</span> wrong or extra word
        </span>
        <span className="flex items-center gap-1">
          <span className={expectedWord}>word</span> correct word
        </span>
        <span className="flex items-center gap-1">
          <span className={missingWord}>word</span> missed word
        </span>
      </div>
      <p>Capitalization and punctuation are ignored.</p>
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