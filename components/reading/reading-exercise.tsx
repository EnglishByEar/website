"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, Clock, Lightbulb, Loader2, Send } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { READING_PATH, levelTone } from "@/lib/reading"
import type { ReadingAnswers, ReadingPassage, ReadingQuestion, ReadingWord } from "@/types/reading"

type Status = "loading" | "ready" | "notfound" | "error"

export function ReadingExercise({ passageId }: { passageId: string }) {
  const { supabase } = useSupabase()
  const router = useRouter()

  const [status, setStatus] = useState<Status>("loading")
  const [passage, setPassage] = useState<ReadingPassage | null>(null)
  const [words, setWords] = useState<ReadingWord[]>([])
  const [questions, setQuestions] = useState<ReadingQuestion[]>([])
  const [attemptId, setAttemptId] = useState<string | null>(null)

  const [answers, setAnswers] = useState<ReadingAnswers>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)
  const [showMissing, setShowMissing] = useState(false)
  const [showWordBank, setShowWordBank] = useState(false)
  const [mobileTab, setMobileTab] = useState<"passage" | "questions">("passage")

  const load = useCallback(async () => {
    if (!supabase) return
    setStatus("loading")
    try {
      const [p, v, q] = await Promise.all([
        supabase
          .from("reading_passages")
          .select("id, title, description, level, content, estimated_reading_minutes")
          .eq("id", passageId)
          .eq("is_published", true)
          .maybeSingle(),
        supabase.from("reading_vocabulary").select("id, word, definition, example_sentence").eq("passage_id", passageId),
        supabase.from("reading_questions").select("id, question_type, question_text, sort_order").eq("passage_id", passageId),
      ])
      if (p.error) throw p.error
      if (!p.data) return setStatus("notfound")
      if (v.error) throw v.error
      if (q.error) throw q.error

      const { data: attempt, error: startError } = await supabase.rpc("start_reading_attempt", { p_passage_id: passageId })
      if (startError) throw startError

      setPassage(p.data as ReadingPassage)
      setWords((v.data ?? []) as ReadingWord[])
      setQuestions(
        ((q.data ?? []) as ReadingQuestion[]).sort(
          (a, b) => (a.question_type === b.question_type ? a.sort_order - b.sort_order : a.question_type === "true_false" ? -1 : 1),
        ),
      )
      setAttemptId(attempt as string)
      setStatus("ready")
    } catch (e) {
      console.error("Error loading reading exercise:", e)
      setStatus("error")
    }
  }, [supabase, passageId])

  useEffect(() => {
    load()
  }, [load])

  const trueFalse = questions.filter((q) => q.question_type === "true_false")
  const fillBlank = questions.filter((q) => q.question_type === "fill_blank")
  const isAnswered = (id: string) => (answers[id] ?? "").trim() !== ""
  const answeredCount = questions.filter((q) => isAnswered(q.id)).length
  const missing = questions.filter((q) => !isAnswered(q.id))
  const wordBank = useMemo(() => words.map((w) => w.word).sort((a, b) => a.localeCompare(b)), [words])
  const paragraphs = useMemo(() => (passage?.content ?? "").split(/\n{2,}/).filter(Boolean), [passage])

  const setAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setSubmitFailed(false)
  }

  const handleSubmit = async () => {
    if (submitting || !attemptId || !supabase) return

    if (missing.length > 0) {
      setShowMissing(true)
      setMobileTab("questions")
      requestAnimationFrame(() => document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ block: "center" }))
      return
    }

    setSubmitting(true)
    setSubmitFailed(false)
    // The RPC is idempotent: retrying after a network error can't create duplicates or change a saved score.
    const { error } = await supabase.rpc("submit_reading_attempt", { p_attempt_id: attemptId, p_answers: answers })
    if (error) {
      console.error("Error submitting reading attempt:", error)
      setSubmitFailed(true)
      setSubmitting(false)
      return
    }
    router.push(`${READING_PATH}/attempts/${attemptId}`)
  }

  if (status === "loading") {
    return (
      <div className="grid gap-4 px-2 py-4" aria-busy="true" aria-label="Loading reading">
        <div className="h-24 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
          <div className="h-96 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
        </div>
      </div>
    )
  }

  if (status === "notfound" || status === "error" || !passage) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            {status === "notfound" ? "We couldn't find that reading" : "We couldn't load this reading"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {status === "notfound" ? "It may have been removed." : "Check your connection and try again."}
          </p>
        </div>
        <div className="flex gap-2">
          {status === "error" && <Button onClick={load}>Try again</Button>}
          <Button variant="outline" onClick={() => router.push(READING_PATH)}>
            Back to Reading
          </Button>
        </div>
      </div>
    )
  }

  const passagePanel = (
    <Card className={`${mobileTab === "passage" ? "block" : "hidden"} lg:block lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto`}>
      <CardContent className="p-5 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold sm:text-2xl">{passage.title}</h2>
        <div className="max-w-prose space-y-5 text-base leading-8 sm:text-lg sm:leading-9">
          {paragraphs.map((para, i) => (
            <p key={i} className="break-words">
              {para}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className="mx-auto grid w-full min-w-0 max-w-6xl gap-4 px-2 py-3 sm:gap-6 sm:px-4 sm:py-4 [&>*]:min-w-0">
      <section className="rounded-3xl bg-primary p-4 text-primary-foreground sm:p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(READING_PATH)}
          className="-ml-2 mb-2 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Reading
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`border-transparent ${levelTone[passage.level]}`}>
            {passage.level}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-primary-foreground/80">
            <Clock className="h-3.5 w-3.5" /> {passage.estimated_reading_minutes} min read
          </span>
        </div>
        <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">{passage.title}</h1>
        {passage.description && <p className="mt-1 text-sm text-primary-foreground/80">{passage.description}</p>}
      </section>

      {/* Mobile: switch between passage and questions */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border bg-card p-1 lg:hidden" role="group" aria-label="Switch view">
        {(["passage", "questions"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={mobileTab === t}
            onClick={() => setMobileTab(t)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mobileTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t === "passage" ? "Passage" : `Questions (${answeredCount}/${questions.length})`}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {passagePanel}

        <div className={`${mobileTab === "questions" ? "grid" : "hidden"} gap-5 lg:grid`}>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Your progress</span>
              <span className="text-muted-foreground">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <Progress value={questions.length ? (answeredCount / questions.length) * 100 : 0} className="h-2" aria-label="Answered questions" />
          </div>

          {questions.length === 0 && (
            <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              This reading has no questions yet.
            </div>
          )}

          {trueFalse.length > 0 && (
            <section className="space-y-3" aria-labelledby="tf-heading">
              <div>
                <h2 id="tf-heading" className="text-lg font-semibold">
                  Part 1 · True or False
                </h2>
                <p className="text-sm text-muted-foreground">Decide if each statement matches the passage.</p>
              </div>
              {trueFalse.map((q, i) => {
                const unanswered = showMissing && !isAnswered(q.id)
                return (
                  <Card key={q.id} id={`q-${q.id}`} className={unanswered ? "border-destructive" : ""}>
                    <CardContent className="space-y-3 p-4">
                      <fieldset>
                        <legend className="mb-3 break-words text-sm font-medium sm:text-base">
                          {i + 1}. {q.question_text}
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          {(["true", "false"] as const).map((v) => (
                            <label key={v} className="cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={v}
                                checked={answers[q.id] === v}
                                onChange={() => setAnswer(q.id, v)}
                                className="peer sr-only"
                              />
                              <span className="flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition-colors hover:bg-muted peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                                {v === "true" ? "True" : "False"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      {unanswered && <p className="text-xs text-destructive">Choose True or False.</p>}
                    </CardContent>
                  </Card>
                )
              })}
            </section>
          )}

          {fillBlank.length > 0 && (
            <section className="space-y-3" aria-labelledby="fb-heading">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 id="fb-heading" className="text-lg font-semibold">
                    Part 2 · Vocabulary
                  </h2>
                  <p className="text-sm text-muted-foreground">Type the missing word. Use a word from the passage.</p>
                </div>
                <Button type="button" variant="outline" size="sm" aria-expanded={showWordBank} onClick={() => setShowWordBank((s) => !s)}>
                  <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
                  {showWordBank ? "Hide word bank" : "Need a hint?"}
                </Button>
              </div>

              {showWordBank && (
                <div className="flex flex-wrap gap-2 rounded-2xl border border-accent bg-accent/40 p-3" aria-label="Word bank">
                  {wordBank.map((w) => (
                    <span key={w} className="rounded-full bg-card px-3 py-1 text-sm font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              )}

              {fillBlank.map((q, i) => {
                const unanswered = showMissing && !isAnswered(q.id)
                return (
                  <Card key={q.id} id={`q-${q.id}`} className={unanswered ? "border-destructive" : ""}>
                    <CardContent className="space-y-3 p-4">
                      <label htmlFor={`in-${q.id}`} className="block break-words text-sm font-medium sm:text-base">
                        {i + 1}. {q.question_text}
                      </label>
                      <Input
                        id={`in-${q.id}`}
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        placeholder="Type the missing word"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={100}
                        aria-invalid={unanswered}
                      />
                      {unanswered && <p className="text-xs text-destructive">Type your answer.</p>}
                    </CardContent>
                  </Card>
                )
              })}
            </section>
          )}

          <div role="alert" aria-live="polite">
            {showMissing && missing.length > 0 && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {missing.length} {missing.length === 1 ? "question is" : "questions are"} still unanswered. Please complete them to submit.
              </p>
            )}
            {submitFailed && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                We couldn't save your answers. They're still here, so you can safely try again.
              </p>
            )}
          </div>

          <div className="sticky bottom-0 -mx-2 border-t bg-background/95 p-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
            <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting || questions.length === 0}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" /> Checking your answers...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> {submitFailed ? "Try again" : "Submit answers"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
