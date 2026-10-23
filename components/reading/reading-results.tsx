"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, Check, RotateCcw, X } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { READING_PATH, capitalize, levelTone, readingErrorMessage, scoreMessage } from "@/lib/reading"
import type { ReadingResultQuestion, ReadingResults } from "@/types/reading"

function QuestionReview({ q, index }: { q: ReadingResultQuestion; index: number }) {
  const isTF = q.question_type === "true_false"
  const show = (v: string | null) => (v ? (isTF ? capitalize(v) : v) : null)

  return (
    <Card className={q.is_correct ? "" : "border-destructive/40"}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              q.is_correct ? "bg-secondary text-secondary-foreground" : "bg-destructive/15 text-destructive"
            }`}
          >
            {q.is_correct ? <Check className="h-4 w-4" aria-hidden /> : <X className="h-4 w-4" aria-hidden />}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="break-words text-sm font-medium sm:text-base">
              <span className="sr-only">{q.is_correct ? "Correct. " : "Incorrect. "}</span>
              {index + 1}. {q.question_text}
            </p>
            <dl className="grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="inline text-muted-foreground">Your answer: </dt>
                <dd className="inline font-medium">{show(q.user_answer) ?? <em>No answer</em>}</dd>
              </div>
              {!q.is_correct && (
                <div>
                  <dt className="inline text-muted-foreground">Correct answer: </dt>
                  <dd className="inline font-medium">{show(q.correct_answer)}</dd>
                </div>
              )}
            </dl>
            {q.explanation && <p className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">{q.explanation}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReadingResultsView({ attemptId }: { attemptId: string }) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [results, setResults] = useState<ReadingResults | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [message, setMessage] = useState("")

  const load = useCallback(async () => {
    if (!supabase) return
    setStatus("loading")
    const { data, error } = await supabase.rpc("reading_attempt_results", { p_attempt_id: attemptId })
    if (error) {
      console.error("Error loading reading results:", error)
      setMessage(readingErrorMessage(error.message))
      setStatus("error")
      return
    }
    setResults(data as ReadingResults)
    setStatus("ready")
  }, [supabase, attemptId])

  useEffect(() => {
    load()
  }, [load])

  if (status === "loading") {
    return (
      <div className="grid gap-4 px-2 py-4" aria-busy="true" aria-label="Loading results">
        <div className="h-48 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
      </div>
    )
  }

  if (status === "error" || !results) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">{message}</h2>
        <div className="flex gap-2">
          <Button onClick={load}>Try again</Button>
          <Button variant="outline" onClick={() => router.push(READING_PATH)}>
            Back to Reading
          </Button>
        </div>
      </div>
    )
  }

  const { attempt, questions, vocabulary } = results
  const score = Math.round(Number(attempt.score_percentage))
  const tfQuestions = questions.filter((q) => q.question_type === "true_false")
  const fbQuestions = questions.filter((q) => q.question_type === "fill_blank")
  const wrong = attempt.total_questions - attempt.total_correct

  const breakdown = [
    { label: "True / False", correct: attempt.true_false_correct, total: attempt.true_false_total },
    { label: "Vocabulary", correct: attempt.fill_blank_correct, total: attempt.fill_blank_total },
  ]

  return (
    <main className="mx-auto grid w-full min-w-0 max-w-4xl gap-4 px-2 py-3 sm:gap-6 sm:px-4 sm:py-4 [&>*]:min-w-0">
      {/* Score */}
      <section className="rounded-3xl bg-primary p-5 text-primary-foreground sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div
            className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 border-primary-foreground/25"
            role="img"
            aria-label={`Score: ${score} percent`}
          >
            <span className="text-4xl font-extrabold leading-none">{score}%</span>
          </div>
          <div className="space-y-2">
            <Badge variant="outline" className={`border-transparent ${levelTone[attempt.passage_level]}`}>
              {attempt.passage_level}
            </Badge>
            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">{scoreMessage(score)}</h1>
            <p className="text-primary-foreground/80">
              {attempt.passage_title} · {attempt.total_correct} correct, {wrong} incorrect out of {attempt.total_questions}
            </p>
          </div>
        </div>
      </section>

      {/* Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {breakdown.map((b) => (
          <Card key={b.label}>
            <CardContent className="space-y-2 p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold">{b.label}</h2>
                <span className="text-sm text-muted-foreground">
                  {b.correct} / {b.total} correct
                </span>
              </div>
              <Progress value={b.total ? (b.correct / b.total) * 100 : 0} className="h-2" aria-label={`${b.label} score`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review */}
      <section className="space-y-3" aria-labelledby="tf-review">
        <h2 id="tf-review" className="text-lg font-semibold">
          Part 1 · True or False
        </h2>
        {tfQuestions.map((q, i) => (
          <QuestionReview key={q.id} q={q} index={i} />
        ))}
      </section>

      <section className="space-y-3" aria-labelledby="fb-review">
        <h2 id="fb-review" className="text-lg font-semibold">
          Part 2 · Vocabulary
        </h2>
        {fbQuestions.map((q, i) => (
          <QuestionReview key={q.id} q={q} index={i} />
        ))}
      </section>

      {/* Vocabulary review */}
      <section className="space-y-3" aria-labelledby="vocab-review">
        <h2 id="vocab-review" className="text-lg font-semibold">
          Words to remember
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {vocabulary.map((w) => (
            <Card key={w.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{w.word}</p>
                <p className="text-sm text-muted-foreground">{w.definition}</p>
                {w.example_sentence && <p className="mt-2 text-sm italic">{w.example_sentence}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={() => router.push(READING_PATH)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reading
        </Button>
        <Button size="lg" onClick={() => router.push(`${READING_PATH}/${attempt.passage_id}`)}>
          <RotateCcw className="mr-2 h-4 w-4" /> Try this reading again
        </Button>
      </div>
    </main>
  )
}
