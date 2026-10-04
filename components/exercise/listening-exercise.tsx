"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { useExerciseSubmission } from "@/hooks/use-exercise-submission"
import { calculateScore } from "@/lib/scoring"
import type { Exercise, ExerciseScore } from "@/types/exercise"
import { AudioPlayer } from "./audio-player"
import { ResultsPanel } from "./result-panel"

interface ListeningExerciseProps {
  exercise: Exercise
  onNext?: () => void
  nextLabel?: string
}

export function ListeningExercise({ exercise, onNext, nextLabel = "Next Exercise" }: ListeningExerciseProps) {
  const { toast } = useToast()
  const { submitResult } = useExerciseSubmission()

  const [userText, setUserText] = useState("")
  const [score, setScore] = useState<ExerciseScore | null>(null)
  const submitted = score !== null

  const audio = useAudioPlayer(exercise.audio_url, {
    onPlayError: () =>
      toast({
        title: "Audio Error",
        description: "Unable to play this audio file.",
        variant: "destructive",
      }),
  })

  const handleSubmit = async () => {
    if (userText.trim() === "") {
      toast({
        title: "Empty submission",
        description: "Please type what you heard before submitting.",
        variant: "destructive",
      })
      return
    }

    const result = calculateScore(exercise.text, userText)
    setScore(result)
    await submitResult({ exercise, userText, score: result })
  }

  const handleReset = () => {
    audio.reset()
    setUserText("")
    setScore(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listening Exercise</CardTitle>
        <CardDescription>
          Listen to the audio and type what you hear. You can play the audio multiple times.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <AudioPlayer
          available={audio.available}
          isPlaying={audio.isPlaying}
          muted={audio.muted}
          progress={audio.progress}
          playbackRate={audio.playbackRate}
          disabled={submitted}
          onTogglePlay={audio.toggle}
          onToggleMute={audio.toggleMute}
          onReset={handleReset}
          onPlaybackRateChange={audio.setPlaybackRate}
        />

        {submitted && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Original Text:</h3>
            <p className="leading-relaxed">{exercise.text}</p>
          </div>
        )}

        <div>
          <Textarea
            placeholder="Type what you hear..."
            className="min-h-[150px]"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            disabled={submitted}
          />
          {!submitted && (
            <p className="mt-2 text-sm text-muted-foreground">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              The text will remain hidden until you submit your answer
            </p>
          )}
        </div>

        {score && <ResultsPanel score={score} userText={userText} />}
      </CardContent>

      <CardFooter className="flex justify-between">
        {submitted ? (
          <Button onClick={handleReset} variant="outline">
            Try Again
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={userText.trim() === ""}>
            Submit Answer
          </Button>
        )}
        {submitted && onNext && <Button onClick={onNext}>{nextLabel}</Button>}
      </CardFooter>
    </Card>
  )
}