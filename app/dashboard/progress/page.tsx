"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, LineChart } from "@/components/ui/chart"
import { BarChart2, LineChartIcon, CalendarIcon } from "lucide-react"

export default function ProgressPage() {
  const { supabase, user } = useSupabase()
  const [period, setPeriod] = useState("week")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    exercisesCompleted: 0,
    averageAccuracy: 0,
    streak: 0,
  })

  useEffect(() => {
    const fetchResults = async () => {
      if (!supabase || !user) {
        setLoading(false)
        return
      }

      try {
        // Fetch exercise results
        const { data: results, error: resultsError } = await supabase
          .from("exercise_results")
          .select(`
            id,
            accuracy,
            mistakes,
            completed_at,
            exercises (
              id,
              title,
              difficulty,
              category
            )
          `)
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })

        if (resultsError) throw resultsError

        // Transform results for display
        const history = results.map((result) => ({
          id: result.id,
          title: result.exercises?.title || "Unknown Exercise",
          difficulty: result.exercises?.difficulty || "Unknown",
          category: result.exercises?.category || "Unknown",
          accuracy: result.accuracy,
          date: new Date(result.completed_at).toISOString().split("T")[0],
        }))

        setExerciseHistory(history)

        // Calculate stats
        if (results.length > 0) {
          const totalAccuracy = results.reduce((sum, result) => sum + result.accuracy, 0)
          setStats({
            exercisesCompleted: results.length,
            averageAccuracy: Math.round(totalAccuracy / results.length),
            streak: calculateStreak(results.map((r) => r.completed_at)),
          })
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        // Fallback to mock data
        setExerciseHistory([
          {
            id: 1,
            title: "Travel Vocabulary",
            difficulty: "Simple",
            accuracy: 92,
            date: "2025-03-16",
            category: "Travel",
          },
          {
            id: 2,
            title: "Science Documentary",
            difficulty: "Advanced",
            accuracy: 78,
            date: "2025-03-13",
            category: "Science",
          },
          {
            id: 3,
            title: "Casual Conversation",
            difficulty: "Medium",
            accuracy: 85,
            date: "2025-03-11",
            category: "Lifestyle",
          },
        ])

        setStats({
          exercisesCompleted: 25,
          averageAccuracy: 84,
          streak: 5,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [supabase, user])

  // Helper function to calculate streak
  const calculateStreak = (dates: string[]) => {
    if (dates.length === 0) return 0

    // Sort dates in descending order (newest first)
    const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    // Get today's date without time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if the most recent exercise was today
    const mostRecent = new Date(sortedDates[0])
    mostRecent.setHours(0, 0, 0, 0)

    // Check if the most recent exercise was today
    //const mostRecent = new Date(sortedDates[0]);s[0]);
    //mostRecent.setHours(0, 0, 0, 0);

    // If most recent exercise wasn't today, no streak
    if (mostRecent.getTime() !== today.getTime()) {
      return 0
    }

    // Count consecutive days
    let streak = 1
    const currentDate = today

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i])
      prevDate.setHours(0, 0, 0, 0)

      // Check if this date is one day before current date
      currentDate.setDate(currentDate.getDate() - 1)

      if (prevDate.getTime() === currentDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  // Mock chart data
  const accuracyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Average Accuracy",
        data: [78, 82, 85, 89],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.2)",
        fill: true,
      },
    ],
  }

  const exerciseCountData = {
    labels: ["Simple", "Medium", "Advanced"],
    datasets: [
      {
        label: "Exercises Completed",
        data: [12, 8, 5],
        backgroundColor: ["hsl(var(--success) / 0.8)", "hsl(var(--warning) / 0.8)", "hsl(var(--destructive) / 0.8)"],
      },
    ],
  }

  const categoryData = {
    labels: ["Travel", "Business", "Lifestyle", "Food", "Entertainment", "News", "Science"],
    datasets: [
      {
        label: "Exercises by Category",
        data: [5, 7, 4, 3, 6, 2, 3],
        backgroundColor: "hsl(var(--primary) / 0.8)",
      },
    ],
  }

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading progress data...</div>
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises Completed</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exercisesCompleted}</div>
            <p className="text-xs text-muted-foreground">+5 from previous period</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center">
                <Badge className="bg-success mb-1">12</Badge>
                <span className="text-muted-foreground">Simple</span>
              </div>
              <div className="flex flex-col items-center">
                <Badge className="bg-warning mb-1">8</Badge>
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex flex-col items-center">
                <Badge className="bg-destructive mb-1">5</Badge>
                <span className="text-muted-foreground">Advanced</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">+2% from previous period</p>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 rounded-full bg-primary" style={{ width: `${stats.averageAccuracy}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Calendar</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">Current streak</p>
            <div className="mt-4">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Trend</CardTitle>
            <CardDescription>Your accuracy improvement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={accuracyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 50,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exercise Distribution</CardTitle>
            <CardDescription>Breakdown by difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={exerciseCountData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise History</CardTitle>
          <CardDescription>Your recent listening exercises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 border-b px-4 py-3 font-medium">
              <div className="col-span-4">Exercise</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2 text-right">Accuracy</div>
              <div className="col-span-2 text-right">Date</div>
            </div>
            {exerciseHistory.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No exercise history found. Complete some exercises to see your progress.
              </div>
            ) : (
              exerciseHistory.map((exercise) => (
                <div
                  key={exercise.id}
                  className="grid grid-cols-12 gap-2 border-b px-4 py-3 last:border-0 hover:bg-muted/50"
                >
                  <div className="col-span-4">{exercise.title}</div>
                  <div className="col-span-2">
                    <Badge
                      variant={
                        exercise.difficulty === "Simple"
                          ? "outline"
                          : exercise.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                  <div
                    className={`col-span-2 text-right font-medium ${
                      exercise.accuracy >= 90
                        ? "text-green-500"
                        : exercise.accuracy >= 70
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {exercise.accuracy}%
                  </div>
                  <div className="col-span-2 text-right text-muted-foreground">
                    {new Date(exercise.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>Your performance across different topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

