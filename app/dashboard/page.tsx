"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Award, Clock, BarChart2, Trophy, Headphones } from "lucide-react"

export default function DashboardPage() {
  const { supabase, user } = useSupabase()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    exercisesCompleted: 0,
    averageAccuracy: 0,
    streak: 0,
    level: 1,
  })
  const [recentExercises, setRecentExercises] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Function to load results from localStorage
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("englishbyear_results")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return []
    }
  }

  // Function to refresh dashboard data
  const refreshDashboardData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Try to fetch profile
      let profileData = null
      if (supabase) {
        try {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          if (error && !(error.code === "42P01" || error.message?.includes("does not exist"))) {
            throw error
          }
          profileData = data
        } catch (error) {
          console.warn("Profile table not found, using fallback data")
        }
      }

      setProfile(profileData)

      // Try to fetch exercise results from database
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
            if (!(resultsError.code === "42P01" || resultsError.message?.includes("does not exist"))) {
              throw resultsError
            }
          } else {
            exerciseResults = results || []
          }
        } catch (error) {
          console.warn("Exercise results table not found, using localStorage data")
        }
      }

      // If no database results, load from localStorage
      if (exerciseResults.length === 0) {
        const localResults = loadFromLocalStorage()
        exerciseResults = localResults.filter((r: any) => r.user_id === user.id || r.user_id === "anonymous")
      }

      // Process recent exercises
      const processedExercises = exerciseResults.slice(0, 3).map((result) => ({
        id: result.exercise_id,
        title: result.exercise_title || `Exercise #${result.exercise_id}`,
        difficulty: result.exercise_difficulty || "Unknown",
        category: result.exercise_category || "Unknown",
        accuracy: result.accuracy,
        date: new Date(result.completed_at).toLocaleDateString(),
        timeAgo: getTimeAgo(new Date(result.completed_at)),
      }))

      setRecentExercises(processedExercises)

      // Calculate stats from real data
      if (exerciseResults.length > 0) {
        const totalAccuracy = exerciseResults.reduce((sum, result) => sum + result.accuracy, 0)
        const averageAccuracy = Math.round(totalAccuracy / exerciseResults.length)

        // Calculate streak (simplified version)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let streak = 0
        const sortedDates = exerciseResults
          .map((r) => {
            const date = new Date(r.completed_at)
            date.setHours(0, 0, 0, 0)
            return date.getTime()
          })
          .filter((date, index, arr) => arr.indexOf(date) === index) // Remove duplicates
          .sort((a, b) => b - a) // Sort descending

        // Check if most recent exercise was today or yesterday
        if (sortedDates.length > 0) {
          const mostRecent = sortedDates[0]
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          if (mostRecent === today.getTime()) {
            streak = 1
            // Count consecutive days
            for (let i = 1; i < sortedDates.length; i++) {
              const expectedDate = new Date(today)
              expectedDate.setDate(expectedDate.getDate() - i)
              if (sortedDates[i] === expectedDate.getTime()) {
                streak++
              } else {
                break
              }
            }
          } else if (mostRecent === yesterday.getTime()) {
            // Start counting from yesterday
            streak = 1
            for (let i = 1; i < sortedDates.length; i++) {
              const expectedDate = new Date(yesterday)
              expectedDate.setDate(expectedDate.getDate() - (i - 1))
              if (sortedDates[i] === expectedDate.getTime()) {
                streak++
              } else {
                break
              }
            }
          }
        }

        setStats({
          exercisesCompleted: exerciseResults.length,
          averageAccuracy,
          streak,
          level: Math.floor(exerciseResults.length / 10) + 1,
        })
      } else {
        // Reset stats if no data
        setStats({
          exercisesCompleted: 0,
          averageAccuracy: 0,
          streak: 0,
          level: 1,
        })
        setRecentExercises([])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshDashboardData()

    // Listen for exercise completion events
    const handleExerciseCompleted = () => {
      console.log("Exercise completed, refreshing dashboard...")
      refreshDashboardData()
    }

    window.addEventListener("exerciseCompleted", handleExerciseCompleted)

    return () => {
      window.removeEventListener("exerciseCompleted", handleExerciseCompleted)
    }
  }, [supabase, user])

  // Helper function to get time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const dailyChallenge = {
    title: "Business Communication",
    difficulty: "Medium",
    description: "Practice listening to a business meeting conversation",
    xp: 50,
  }

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first exercise",
      unlocked: stats.exercisesCompleted > 0,
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Achieve 100% accuracy on any exercise",
      unlocked: recentExercises.some((ex) => ex.accuracy === 100),
    },
    {
      id: 3,
      title: "Week Streak",
      description: "Complete exercises for 7 days in a row",
      unlocked: stats.streak >= 7,
    },
    {
      id: 4,
      title: "Dedicated Learner",
      description: "Complete 10 exercises",
      unlocked: stats.exercisesCompleted >= 10,
    },
    {
      id: 5,
      title: "Accuracy Master",
      description: "Maintain 90%+ average accuracy",
      unlocked: stats.averageAccuracy >= 90 && stats.exercisesCompleted >= 5,
    },
  ]

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading...</div>
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{profile?.username ? `, ${profile.username}` : ""}!
          </h1>
          <p className="text-muted-foreground">Here's your learning progress</p>
        </div>
        <Link href="/dashboard/exercises">
          <Button>
            <Play className="mr-2 h-4 w-4" /> Start New Exercise
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises Completed</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exercisesCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {stats.exercisesCompleted === 0 ? "Start your first exercise!" : `Level ${stats.level} learner`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exercisesCompleted > 0 ? `${stats.averageAccuracy}%` : "—"}</div>
            {stats.exercisesCompleted > 0 && <Progress value={stats.averageAccuracy} className="mt-2" />}
            <p className="text-xs text-muted-foreground mt-1">
              {stats.exercisesCompleted === 0 ? "Complete exercises to see accuracy" : "Keep practicing!"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">
              {stats.streak === 0 ? "Start practicing daily!" : "Keep it up!"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {stats.level}</div>
            <Progress value={(stats.exercisesCompleted % 10) * 10} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {10 - (stats.exercisesCompleted % 10)} more to level {stats.level + 1}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
            <CardDescription>
              {recentExercises.length > 0 ? "Your last completed exercises" : "No exercises completed yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentExercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Headphones className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No exercises yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first listening exercise to see your progress here
                </p>
                <Link href="/dashboard/exercises">
                  <Button>Browse Exercises</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExercises.map((exercise, index) => (
                  <div key={`${exercise.id}-${index}`} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{exercise.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            exercise.difficulty === "Simple"
                              ? "outline"
                              : exercise.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {exercise.difficulty}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{exercise.timeAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`text-sm font-medium ${
                          exercise.accuracy >= 90
                            ? "text-green-500"
                            : exercise.accuracy >= 70
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {exercise.accuracy}%
                      </div>
                      <Link href={`/dashboard/exercises/${exercise.id}`}>
                        <Button variant="ghost" size="sm">
                          Retry
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {recentExercises.length > 0 && (
            <CardFooter>
              <Link href="/dashboard/progress">
                <Button variant="outline">View All History</Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Challenge</CardTitle>
            <CardDescription>Complete for bonus XP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-sm font-medium">{dailyChallenge.title}</div>
              </div>
              <Badge variant="secondary">{dailyChallenge.difficulty}</Badge>
              <p className="text-sm text-muted-foreground">{dailyChallenge.description}</p>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{dailyChallenge.xp} XP</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/exercises/daily">
              <Button className="w-full">Start Challenge</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Track your progress and unlock rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked">
            <TabsList className="mb-4">
              <TabsTrigger value="unlocked">Unlocked ({achievements.filter((a) => a.unlocked).length})</TabsTrigger>
              <TabsTrigger value="locked">Locked ({achievements.filter((a) => !a.unlocked).length})</TabsTrigger>
            </TabsList>
            <TabsContent value="unlocked" className="space-y-4">
              {achievements.filter((a) => a.unlocked).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete exercises to unlock achievements!</p>
                </div>
              ) : (
                achievements
                  .filter((a) => a.unlocked)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
            <TabsContent value="locked" className="space-y-4">
              {achievements
                .filter((a) => !a.unlocked)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 opacity-70">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
