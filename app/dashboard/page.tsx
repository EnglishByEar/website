"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Flame, Target, Headphones, Check, Lock, ChevronRight, Zap, RotateCcw } from "lucide-react"

const DAY_MS = 24 * 60 * 60 * 1000
const startOfDay = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

const getTimeAgo = (date: Date) => {
  const days = Math.floor((Date.now() - date.getTime()) / DAY_MS)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

// Circular level progress (the one "hero" visual on the page)
function LevelRing({ level, progress }: { level: number; progress: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setShown(progress), 150)
    return () => clearTimeout(t)
  }, [progress])

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-primary-foreground/20" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-primary-foreground transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
        <span className="text-xs text-primary-foreground/70">Level</span>
        <span className="text-4xl font-extrabold leading-none">{level}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { supabase, user } = useSupabase()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ exercisesCompleted: 0, averageAccuracy: 0, streak: 0, level: 1 })
  const [recentExercises, setRecentExercises] = useState<any[]>([])
  const [hasPerfectScore, setHasPerfectScore] = useState(false)
  const [activeDays, setActiveDays] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("englishbyear_results")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return []
    }
  }

  const refreshDashboardData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      let profileData = null
      if (supabase) {
        try {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          if (error && !(error.code === "42P01" || error.message?.includes("does not exist"))) throw error
          profileData = data
        } catch (error) {
          console.warn("Profile table not found, using fallback data")
        }
      }
      setProfile(profileData)

      let exerciseResults: any[] = []
      if (supabase) {
        try {
          const { data: results, error: resultsError } = await supabase
            .from("exercise_results")
            .select("*")
            .eq("user_id", user.id)
            .order("completed_at", { ascending: false })
            .limit(50)

          if (resultsError) {
            if (!(resultsError.code === "42P01" || resultsError.message?.includes("does not exist"))) throw resultsError
          } else {
            exerciseResults = results || []
          }
        } catch (error) {
          console.warn("Exercise results table not found, using localStorage data")
        }
      }

      if (exerciseResults.length === 0) {
        const localResults = loadFromLocalStorage()
        exerciseResults = localResults.filter((r: any) => r.user_id === user.id || r.user_id === "anonymous")
      }

      setRecentExercises(
        exerciseResults.slice(0, 3).map((result) => ({
          id: result.exercise_id,
          title: result.exercise_title || `Exercise #${result.exercise_id}`,
          difficulty: result.exercise_difficulty || "Unknown",
          accuracy: result.accuracy,
          timeAgo: getTimeAgo(new Date(result.completed_at)),
        })),
      )
      setHasPerfectScore(exerciseResults.some((r) => r.accuracy === 100))

      // Days with activity (used for streak + weekly row)
      const daySet = new Set<number>(exerciseResults.map((r) => startOfDay(new Date(r.completed_at)).getTime()))
      setActiveDays(Array.from(daySet))

      if (exerciseResults.length > 0) {
        const averageAccuracy = Math.round(
          exerciseResults.reduce((sum, r) => sum + r.accuracy, 0) / exerciseResults.length,
        )

        // Streak: count consecutive days back from today (or yesterday if not practiced yet today)
        const today = startOfDay(new Date())
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        let cursor: Date | null = daySet.has(today.getTime()) ? today : daySet.has(yesterday.getTime()) ? yesterday : null
        let streak = 0
        while (cursor && daySet.has(cursor.getTime())) {
          streak++
          cursor = new Date(cursor)
          cursor.setDate(cursor.getDate() - 1)
        }

        setStats({
          exercisesCompleted: exerciseResults.length,
          averageAccuracy,
          streak,
          level: Math.floor(exerciseResults.length / 10) + 1,
        })
      } else {
        setStats({ exercisesCompleted: 0, averageAccuracy: 0, streak: 0, level: 1 })
        setRecentExercises([])
        setActiveDays([])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshDashboardData()
    const handleExerciseCompleted = () => refreshDashboardData()
    window.addEventListener("exerciseCompleted", handleExerciseCompleted)
    return () => window.removeEventListener("exerciseCompleted", handleExerciseCompleted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user])

  const dailyChallenge = {
    title: "Business Communication",
    difficulty: "Medium",
    description: "Listen to a business meeting and answer questions about the key decisions.",
    xp: 50,
  }

  const achievements = [
    { id: 1, emoji: "👣", title: "First Steps", description: "Complete your first exercise", current: Math.min(stats.exercisesCompleted, 1), goal: 1 },
    { id: 2, emoji: "🎯", title: "Perfect Score", description: "Get 100% on any exercise", current: hasPerfectScore ? 1 : 0, goal: 1 },
    { id: 3, emoji: "🔥", title: "Week Streak", description: "Practice 7 days in a row", current: Math.min(stats.streak, 7), goal: 7 },
    { id: 4, emoji: "📚", title: "Dedicated Learner", description: "Complete 10 exercises", current: Math.min(stats.exercisesCompleted, 10), goal: 10 },
    {
      id: 5,
      emoji: "🏆",
      title: "Accuracy Master",
      description: "Reach 90% average over 5+ exercises",
      current: stats.exercisesCompleted >= 5 && stats.averageAccuracy >= 90 ? 1 : 0,
      goal: 1,
    },
  ].map((a) => ({ ...a, unlocked: a.current >= a.goal }))

  // Last 7 days, oldest -> today
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = startOfDay(new Date())
    d.setDate(d.getDate() - (6 - i))
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      done: activeDays.includes(d.getTime()),
      isToday: i === 6,
    }
  })
  const practicedToday = week[6].done
  const toNext = 10 - (stats.exercisesCompleted % 10)
  const levelProgress = (stats.exercisesCompleted % 10) / 10
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  const motivation =
    stats.exercisesCompleted === 0
      ? "Your first listening exercise takes about 5 minutes. Let's start."
      : practicedToday
        ? "Nice work today. One more exercise keeps your ears sharp."
        : stats.streak > 0
          ? `Practice today to keep your ${stats.streak}-day streak alive.`
          : "A short exercise today starts a new streak."

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading...</div>
  }

  return (
    <div className="grid gap-6 py-4">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-xl space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {getGreeting()}
                {profile?.username ? `, ${profile.username}` : ""}!
              </h1>
              <p className="mt-2 text-primary-foreground/80">{motivation}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link href="/dashboard/exercises">
                <Button size="lg" className="bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
                  <Play className="mr-2 h-4 w-4" />
                  {stats.exercisesCompleted === 0 ? "Start your first exercise" : "Start new exercise"}
                </Button>
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-2 text-sm">
                <Flame className="h-4 w-4" />
                {stats.streak} day streak
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <LevelRing level={stats.level} progress={levelProgress} />
            <p className="text-sm text-primary-foreground/80">
              {toNext} {toNext === 1 ? "exercise" : "exercises"} to level {stats.level + 1}
            </p>
          </div>
        </div>
      </section>

      {/* Weekly streak row + quick stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">This week</h2>
              <span className="text-sm text-muted-foreground">{week.filter((d) => d.done).length} of 7 days practiced</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {week.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors sm:h-12 sm:w-12 ${
                      d.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : d.isToday
                          ? "border-dashed border-primary text-primary"
                          : "border-muted bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {d.done ? <Check className="h-5 w-5" /> : d.isToday ? <Headphones className="h-4 w-4" /> : null}
                  </div>
                  <span className={`text-xs ${d.isToday ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {d.isToday ? "Today" : d.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.exercisesCompleted}</div>
                <p className="text-sm text-muted-foreground">Exercises done</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">{stats.exercisesCompleted > 0 ? `${stats.averageAccuracy}%` : "—"}</div>
                <p className="text-sm text-muted-foreground">Average accuracy</p>
                {stats.exercisesCompleted > 0 && <Progress value={stats.averageAccuracy} className="mt-2 h-1.5" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily challenge + recent exercises */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="overflow-hidden border-accent bg-accent/40 lg:col-span-2">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's challenge</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-sm font-semibold text-accent-foreground">
                <Zap className="h-3.5 w-3.5" />+{dailyChallenge.xp} XP
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">{dailyChallenge.title}</p>
              <Badge variant="secondary">{dailyChallenge.difficulty}</Badge>
              <p className="text-sm text-muted-foreground">{dailyChallenge.description}</p>
            </div>
            <Link href="/dashboard/exercises" className="mt-auto">
              <Button className="w-full">Start challenge</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pick up where you left off</h2>
              {recentExercises.length > 0 && (
                <Link href="/dashboard/progress" className="flex items-center text-sm text-primary hover:underline">
                  View history <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {recentExercises.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Headphones className="h-8 w-8" />
                </div>
                <h3 className="mb-1 text-lg font-medium">Your listening journey starts here</h3>
                <p className="mb-4 text-sm text-muted-foreground">Finish an exercise and your results will show up here.</p>
                <Link href="/dashboard/exercises">
                  <Button>Browse exercises</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentExercises.map((exercise, index) => {
                  const tone =
                    exercise.accuracy >= 90
                      ? "bg-secondary text-secondary-foreground"
                      : exercise.accuracy >= 70
                        ? "bg-accent text-accent-foreground"
                        : "bg-destructive/15 text-destructive"
                  return (
                    <div
                      key={`${exercise.id}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${tone}`}>
                        {exercise.accuracy}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{exercise.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant={exercise.difficulty === "Simple" ? "outline" : exercise.difficulty === "Medium" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {exercise.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{exercise.timeAgo}</span>
                        </div>
                      </div>
                      <Link href={`/dashboard/exercises/${exercise.id}`}>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          {exercise.accuracy < 90 ? "Improve" : "Retry"}
                        </Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Achievements</h2>
            <span className="text-sm text-muted-foreground">
              {unlockedCount} of {achievements.length} unlocked
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  a.unlocked ? "border-accent bg-accent/30" : "bg-muted/30"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${
                    a.unlocked ? "bg-accent" : "bg-muted grayscale"
                  }`}
                >
                  {a.unlocked ? a.emoji : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                  {!a.unlocked && a.goal > 1 && (
                    <div className="mt-2">
                      <Progress value={(a.current / a.goal) * 100} className="h-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.current} / {a.goal}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}