"use client"

import { useState } from "react"
import { Check, Clock, Headphones, Keyboard, PartyPopper, RotateCcw, ArrowRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

const difficultyTone = (difficulty: string) =>
  difficulty === "Simple"
    ? "bg-secondary text-secondary-foreground"
    : difficulty === "Medium"
      ? "bg-primary/10 text-primary"
      : "bg-accent text-accent-foreground"

function Step({ n, label, done, active }: { n: number; label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-2.5">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
          done
            ? "border-primary bg-primary text-primary-foreground"
            : active
              ? "border-primary text-primary"
              : "border-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : n}
      </div>
      <span className={`text-xs sm:text-sm ${done || active ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
    </div>
  )
}

export function ListeningExercise({ exercise, onNext, nextLabel = "Next Exercise" }: ListeningExerciseProps) {
  const { toast } = useToast()
  const { submitResult } = useExerciseSubmission()

  const [userText, setUserText] = useState("")
  const [score, setScore] = useState<ExerciseScore | null>(null)
  const submitted = score !== null
  const hasText = userText.trim() !== ""
  const wordCount = userText.trim().split(/\s+/).filter(Boolean).length

  const audio = useAudioPlayer(exercise.audio_url, {
    onPlayError: () =>
      toast({
        title: "Audio Error",
        description: "Unable to play this audio file.",
        variant: "destructive",
      }),
  })

  const hasListened = audio.isPlaying || Number(audio.progress) > 0

  const handleSubmit = async () => {
    if (!hasText) {
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
    <Card className="w-full min-w-0 overflow-hidden">
      {/* Title band */}
      <CardHeader className="gap-3 bg-primary p-4 text-primary-foreground sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`border-transparent ${difficultyTone(exercise.difficulty)}`}>
            {exercise.difficulty}
          </Badge>
          <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground">
            {exercise.category}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-primary-foreground/80">
            <Clock className="h-3.5 w-3.5" />
            {exercise.duration}
          </span>
        </div>
        <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">{exercise.title}</h1>
        <p className="text-sm text-primary-foreground/80 sm:text-base">
          Listen to the audio and type what you hear. You can play it as many times as you like.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-8">
        {/* Step tracker */}
        <div className="flex items-start justify-between gap-1 rounded-2xl bg-muted/40 p-2 sm:gap-2 sm:p-3">
          <Step n={1} label="Listen" done={hasListened} active={!hasListened} />
          <Step n={2} label="Type" done={hasText} active={hasListened && !hasText} />
          <Step n={3} label="Check" done={submitted} active={hasText && !submitted} />
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Headphones className="h-4 w-4 text-primary" />
            Audio
          </div>
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
          {!submitted && (
            <p className="mt-3 text-xs text-muted-foreground">
              Tip: slow the speed down to catch tricky words, then try again at normal speed.
            </p>
          )}
        </div>

        {/* Answer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="answer" className="flex items-center gap-2 text-sm font-medium">
              <Keyboard className="h-4 w-4 text-primary" />
              Your answer
            </label>
            <span className="text-xs text-muted-foreground">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          </div>
          <Textarea
            id="answer"
            placeholder="Type what you hear..."
            className="min-h-[140px] w-full text-base leading-relaxed sm:min-h-[160px]"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !submitted) handleSubmit()
            }}
            disabled={submitted}
          />
          {!submitted && (
            <p className="text-xs text-muted-foreground">
              The original text stays hidden until you submit. Press Ctrl/⌘ + Enter to submit quickly.
            </p>
          )}
        </div>

        {/* After submitting */}
        {submitted && (
          <>
            <div className="flex items-center gap-3 rounded-2xl border border-accent bg-accent/40 p-3 sm:p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <PartyPopper className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Answer checked! Compare your text with the original below.</p>
            </div>

            <div className="rounded-2xl border bg-secondary/40 p-3 sm:p-4">
              <h3 className="mb-2 text-sm font-semibold">Original text</h3>
              <p className="break-words leading-relaxed">{exercise.text}</p>
            </div>

            {score && <ResultsPanel score={score} />}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col-reverse gap-3 border-t p-4 sm:flex-row sm:justify-between sm:p-6 sm:px-8">
        {submitted ? (
          <>
            <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" /> Try again
            </Button>
            {onNext && (
              <Button onClick={onNext} size="lg" className="w-full sm:w-auto">
                {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={!hasText} size="lg" className="w-full sm:ml-auto sm:w-auto">
            <Send className="mr-2 h-4 w-4" /> Submit answer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}