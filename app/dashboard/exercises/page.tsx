"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Clock, Check, Play, RotateCcw, ChevronRight } from "lucide-react"

type Level = "simple" | "medium" | "advanced"

const LEVELS: { key: Level; code: string; name: string; blurb: string; tone: string }[] = [
  { key: "simple", code: "A1 - A2", name: "Beginner", blurb: "Short, slow clips about everyday life.", tone: "bg-secondary text-secondary-foreground" },
  { key: "medium", code: "B1 - B2", name: "Intermediate", blurb: "Natural speed with real-world topics.", tone: "bg-primary/10 text-primary" },
  { key: "advanced", code: "C1 - C2", name: "Advanced", blurb: "Fast, complex speech and specialist vocabulary.", tone: "bg-accent text-accent-foreground" },
]

const CATEGORY_EMOJI: Record<string, string> = {
  Lifestyle: "☕",
  Travel: "✈️",
  Food: "🍽️",
  News: "📰",
  Business: "💼",
  Entertainment: "🎬",
  Science: "🔬",
  Literature: "📖",
}

const MOCK_EXERCISES = {
  simple: [
    { id: 1, title: "Daily Routines", description: "Practice listening to descriptions of everyday activities", duration: "2-3 min", category: "Lifestyle" },
    { id: 2, title: "Travel Vocabulary", description: "Learn common phrases used when traveling", duration: "3-4 min", category: "Travel" },
    { id: 3, title: "Food and Restaurants", description: "Practice ordering food and discussing preferences", duration: "2-3 min", category: "Food" },
  ],
  medium: [
    { id: 4, title: "News Headlines", description: "Listen to current news stories and identify key information", duration: "4-5 min", category: "News" },
    { id: 5, title: "Job Interviews", description: "Practice understanding common interview questions and responses", duration: "5-6 min", category: "Business" },
    { id: 6, title: "Movie Reviews", description: "Listen to people discussing films and their opinions", duration: "4-5 min", category: "Entertainment" },
  ],
  advanced: [
    { id: 7, title: "Scientific Discussions", description: "Complex vocabulary and concepts from scientific fields", duration: "6-8 min", category: "Science" },
    { id: 8, title: "Business Negotiations", description: "Advanced business terminology and persuasive language", duration: "7-9 min", category: "Business" },
    { id: 9, title: "Literary Analysis", description: "Discussions about books, themes, and literary techniques", duration: "6-8 min", category: "Literature" },
  ],
}

export default function ExercisesPage() {
  const { supabase, user } = useSupabase()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [exercises, setExercises] = useState<Record<Level, any[]>>({ simple: [], medium: [], advanced: [] })
  const [bestScores, setBestScores] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("exercises").select("*").order("id", { ascending: true })

        if (error) {
          if (error.code === "42P01" || error.message?.includes("does not exist")) {
            console.warn("exercises table not found. Using mock data while prototyping.")
            throw { handled: true }
          }
          throw error
        }

        setExercises({
          simple: data.filter((ex) => ex.difficulty === "Simple"),
          medium: data.filter((ex) => ex.difficulty === "Medium"),
          advanced: data.filter((ex) => ex.difficulty === "Advanced"),
        })
      } catch (error: any) {
        if (!error?.handled) console.error("Error fetching exercises:", error)
        setExercises(MOCK_EXERCISES)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [supabase])

  useEffect(() => {
    const loadScores = async () => {
      if (!user) return
      let results: any[] = []

      if (supabase) {
        try {
          const { data, error } = await supabase.from("exercise_results").select("exercise_id, accuracy").eq("user_id", user.id)
          if (!error && data) results = data
        } catch {
        }
      }

      if (results.length === 0) {
        try {
          const stored = localStorage.getItem("englishbyear_results")
          const local = stored ? JSON.parse(stored) : []
          results = local.filter((r: any) => r.user_id === user.id || r.user_id === "anonymous")
        } catch {
          results = []
        }
      }

      const best: Record<string, number> = {}
      results.forEach((r) => {
        const id = String(r.exercise_id)
        best[id] = Math.max(best[id] ?? 0, r.accuracy ?? 0)
      })
      setBestScores(best)
    }

    loadScores()
  }, [supabase, user])

  const allCategories = useMemo(() => {
    const set = new Set<string>()
    Object.values(exercises).forEach((list) => list.forEach((ex) => ex.category && set.add(ex.category)))
    return ["All", ...Array.from(set)]
  }, [exercises])

  const filterList = (list: any[]) => {
    const q = searchQuery.toLowerCase()
    return list.filter(
      (ex) =>
        (category === "All" || ex.category === category) &&
        (ex.title.toLowerCase().includes(q) ||
          (ex.description && ex.description.toLowerCase().includes(q)) ||
          ex.category?.toLowerCase().includes(q)),
    )
  }

  const upNext = useMemo(() => {
    for (const level of LEVELS) {
      const found = exercises[level.key].find((ex) => bestScores[String(ex.id)] === undefined)
      if (found) return found
    }
    return null
  }, [exercises, bestScores])

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading exercises...</div>
  }

  const totalCount = LEVELS.reduce((n, l) => n + exercises[l.key].length, 0)
  const totalDone = LEVELS.reduce((n, l) => n + exercises[l.key].filter((ex) => bestScores[String(ex.id)] !== undefined).length, 0)

  return (
    <main className="bg-background">
      <div className="grid gap-6 px-2 py-4">
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Listening exercises</h1>
              <p className="text-primary-foreground/80">
                {totalDone === 0
                  ? "Pick a level and press play. Each exercise takes just a few minutes."
                  : `You've tried ${totalDone} of ${totalCount} exercises. Keep going!`}
              </p>
            </div>
            <div className="w-full md:w-72">
              <div className="mb-1.5 flex justify-between text-sm text-primary-foreground/80">
                <span>Your progress</span>
                <span>
                  {totalDone} / {totalCount}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-primary-foreground/20">
                <div
                  className="h-full rounded-full bg-primary-foreground transition-[width] duration-700 motion-reduce:transition-none"
                  style={{ width: totalCount ? `${(totalDone / totalCount) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {upNext && (
          <Link href={`/dashboard/exercises/${upNext.id}`} className="group">
            <Card className="border-accent bg-accent/40 transition-colors hover:bg-accent/60">
              <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl">
                  {CATEGORY_EMOJI[upNext.category] ?? "🎧"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">Up next for you</p>
                  <p className="truncate font-semibold">{upNext.title}</p>
                </div>
                <span className="hidden items-center gap-1 text-sm font-medium sm:flex">
                  Start now <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <ChevronRight className="h-5 w-5 sm:hidden" />
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Levels */}
        <Tabs defaultValue="simple">
          <TabsList className="grid h-auto w-full grid-cols-3">
            {LEVELS.map((l) => (
              <TabsTrigger key={l.key} value={l.key} className="flex flex-col gap-0.5 py-2">
                <span className="font-semibold">{l.code}</span>
                <span className="text-xs font-normal opacity-80">{l.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {LEVELS.map((level) => {
            const list = filterList(exercises[level.key])
            const done = exercises[level.key].filter((ex) => bestScores[String(ex.id)] !== undefined).length
            const total = exercises[level.key].length

            return (
              <TabsContent key={level.key} value={level.key} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">{level.blurb}</p>
                  {total > 0 && (
                    <div className="flex items-center gap-2 sm:w-52">
                      <Progress value={(done / total) * 100} className="h-1.5" />
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {done} / {total} done
                      </span>
                    </div>
                  )}
                </div>

                {list.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed">
                    <p className="text-center text-muted-foreground">No exercises match your search</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setCategory("All")
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {list.map((exercise) => {
                      const best = bestScores[String(exercise.id)]
                      const completed = best !== undefined
                      return (
                        <Card key={exercise.id} className="transition-colors hover:border-primary/50">
                          <CardContent className="flex h-full flex-col gap-4 p-5">
                            <div className="flex items-start gap-4">
                              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${level.tone}`}>
                                {CATEGORY_EMOJI[exercise.category] ?? "🎧"}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1.5">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold leading-tight">{exercise.title}</h3>
                                  {completed && (
                                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                      <Check className="h-3 w-3" /> {best}%
                                    </span>
                                  )}
                                </div>
                                {exercise.description && (
                                  <p className="line-clamp-2 text-sm text-muted-foreground">{exercise.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Badge variant="outline">{exercise.category}</Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {exercise.duration}
                                </span>
                              </div>
                              <Link href={`/dashboard/exercises/${exercise.id}`}>
                                <Button size="sm" variant={completed ? "outline" : "default"}>
                                  {completed ? (
                                    <>
                                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Practice again
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
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </main>
  )
}