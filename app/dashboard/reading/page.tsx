"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, BookOpen, ChevronRight, Clock, Play, RotateCcw, Trophy } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { READING_LEVELS, READING_PATH, levelTone } from "@/lib/reading"
import type { ReadingAttemptRow, ReadingLevel, ReadingPassageSummary } from "@/types/reading"

type Filter = "All" | ReadingLevel

export default function ReadingPage() {
  const { supabase, user } = useSupabase()
  const [passages, setPassages] = useState<ReadingPassageSummary[]>([])
  const [attempts, setAttempts] = useState<ReadingAttemptRow[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [filter, setFilter] = useState<Filter>("All")

  const load = useCallback(async () => {
    if (!supabase) return
    setStatus("loading")
    try {
      const [p, a] = await Promise.all([
        supabase
          .from("reading_passages")
          .select("id, title, description, level, estimated_reading_minutes")
          .eq("is_published", true)
          .order("created_at", { ascending: true }),
        supabase
          .from("reading_attempts")
          .select("id, passage_id, status, score_percentage, total_correct, total_questions, completed_at")
          .eq("status", "completed")
          .order("completed_at", { ascending: false })
          .limit(200),
      ])
      if (p.error) throw p.error
      if (a.error) throw a.error
      setPassages((p.data ?? []) as ReadingPassageSummary[])
      setAttempts((a.data ?? []).map((r: any) => ({ ...r, score_percentage: Number(r.score_percentage) })) as ReadingAttemptRow[])
      setStatus("ready")
    } catch (e) {
      console.error("Error loading reading section:", e)
      setStatus("error")
    }
  }, [supabase])

  useEffect(() => {
    load()
  }, [load, user?.id])

  const passageById = useMemo(() => new Map(passages.map((p) => [p.id, p])), [passages])

  const stats = useMemo(() => {
    const scores = attempts.map((a) => a.score_percentage ?? 0)
    const bestByPassage = new Map<string, number>()
    attempts.forEach((a) => bestByPassage.set(a.passage_id, Math.max(bestByPassage.get(a.passage_id) ?? 0, a.score_percentage ?? 0)))
    const perLevel = READING_LEVELS.map((l) => {
      const s = attempts.filter((a) => passageById.get(a.passage_id)?.level === l.value).map((a) => a.score_percentage ?? 0)
      return { ...l, count: s.length, avg: s.length ? Math.round(s.reduce((x, y) => x + y, 0) / s.length) : null }
    })
    return {
      completedPassages: bestByPassage.size,
      average: scores.length ? Math.round(scores.reduce((x, y) => x + y, 0) / scores.length) : null,
      latest: scores.length ? Math.round(scores[0]) : null,
      best: scores.length ? Math.round(Math.max(...scores)) : null,
      bestByPassage,
      perLevel,
    }
  }, [attempts, passageById])

  const visible = passages.filter((p) => filter === "All" || p.level === filter)
  const countFor = (f: Filter) => (f === "All" ? passages.length : passages.filter((p) => p.level === f).length)

  if (status === "loading") {
    return (
      <div className="grid gap-4 px-2 py-4" aria-busy="true" aria-label="Loading reading section">
        <div className="h-40 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
          ))}
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">We couldn't load the reading section</h2>
          <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
        </div>
        <Button onClick={load}>Try again</Button>
      </div>
    )
  }

  return (
    <main className="grid w-full min-w-0 gap-4 px-2 py-3 sm:gap-6 sm:py-4 [&>*]:min-w-0">
      {/* Hero + progress */}
      <section className="rounded-3xl bg-primary p-5 text-primary-foreground sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">Reading</h1>
            <p className="text-sm text-primary-foreground/80 sm:text-base">
              Read short passages, check your understanding, and learn new words in context.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[28rem]">
            {[
              { label: "Completed", value: stats.completedPassages },
              { label: "Average", value: stats.average === null ? "—" : `${stats.average}%` },
              { label: "Latest", value: stats.latest === null ? "—" : `${stats.latest}%` },
              { label: "Best", value: stats.best === null ? "—" : `${stats.best}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-primary-foreground/15 p-3 text-center">
                <dd className="text-xl font-bold sm:text-2xl">{s.value}</dd>
                <dt className="text-xs text-primary-foreground/80">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Level selector */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
        {(["All", ...READING_LEVELS.map((l) => l.value)] as Filter[]).map((f) => {
          const meta = READING_LEVELS.find((l) => l.value === f)
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              {f === "All" ? "All levels" : `${meta?.code} · ${f}`}
              <span className="ml-2 opacity-70">{countFor(f)}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Passage cards */}
        <section className="lg:col-span-2" aria-label="Reading passages">
          {visible.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No readings here yet</p>
              <p className="text-sm text-muted-foreground">
                {filter === "All" ? "New passages are on the way." : "Try another level, or check back soon."}
              </p>
              {filter !== "All" && (
                <Button variant="ghost" size="sm" onClick={() => setFilter("All")}>
                  Show all levels
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visible.map((p) => {
                const best = stats.bestByPassage.get(p.id)
                const done = best !== undefined
                return (
                  <Card key={p.id} className="transition-colors hover:border-primary/50">
                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className={`border-transparent ${levelTone[p.level]}`}>
                          {p.level}
                        </Badge>
                        {done && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            Best {Math.round(best)}%
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="break-words text-lg font-semibold leading-tight">{p.title}</h3>
                        {p.description && <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {p.estimated_reading_minutes} min read
                        </span>
                        <Link href={`${READING_PATH}/${p.id}`}>
                          <Button size="sm" variant={done ? "outline" : "default"}>
                            {done ? (
                              <>
                                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Read again
                              </>
                            ) : (
                              <>
                                <Play className="mr-1.5 h-3.5 w-3.5" /> Start
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Progress by level + recent activity */}
        <aside className="grid content-start gap-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <Trophy className="h-4 w-4 text-primary" /> Performance by level
              </h2>
              {stats.perLevel.map((l) => (
                <div key={l.value} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{l.value}</span>
                    <span className="text-muted-foreground">{l.avg === null ? "No attempts" : `${l.avg}% avg`}</span>
                  </div>
                  <Progress value={l.avg ?? 0} className="h-1.5" aria-label={`${l.value} average score`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="font-semibold">Recent activity</h2>
              {attempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Finish a reading and your results will show up here.</p>
              ) : (
                <ul className="space-y-1">
                  {attempts.slice(0, 5).map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`${READING_PATH}/attempts/${a.id}`}
                        className="flex items-center justify-between gap-3 rounded-xl p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{passageById.get(a.passage_id)?.title ?? "Reading"}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : ""}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold">
                          {Math.round(a.score_percentage ?? 0)}%
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
