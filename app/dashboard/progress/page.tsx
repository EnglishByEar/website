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
  const [chartData, setChartData] = useState({
    accuracyTrend: { labels: [], datasets: [] },
    difficultyDistribution: { labels: [], datasets: [] },
    categoryDistribution: { labels: [], datasets: [] },
  })

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

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Try to fetch exercise results from database
        let exerciseResults: any[] = []
        if (supabase) {
          try {
            const { data: results, error: resErr } = await supabase
              .from("exercise_results")
              .select("*")
              .eq("user_id", user.id)
              .order("completed_at", { ascending: false })

            if (resErr) {
              if (!(resErr.code === "42P01" || resErr.message?.includes("does not exist"))) {
                throw resErr
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

        // Process exercise history
        const history = exerciseResults.map((result) => ({
          id: result.id || result.exercise_id,
          title: result.exercise_title || `Exercise #${result.exercise_id}`,
          difficulty: result.exercise_difficulty || "Unknown",
          category: result.exercise_category || "Unknown",
          accuracy: result.accuracy,
          date: new Date(result.completed_at).toISOString().split("T")[0],
          completed_at: result.completed_at,
        }))

        setExerciseHistory(history)

        // Calculate real stats
        if (exerciseResults.length > 0) {
          const totalAccuracy = exerciseResults.reduce((sum, r) => sum + r.accuracy, 0)
          const averageAccuracy = Math.round(totalAccuracy / exerciseResults.length)
          const streak = calculateStreak(exerciseResults.map((r) => r.completed_at))

          setStats({
            exercisesCompleted: exerciseResults.length,
            averageAccuracy,
            streak,
          })

          // Generate chart data from real results
          generateChartData(exerciseResults)
        } else {
          // Reset stats if no data
          setStats({
            exercisesCompleted: 0,
            averageAccuracy: 0,
            streak: 0,
          })
          setChartData({
            accuracyTrend: { labels: [], datasets: [] },
            difficultyDistribution: { labels: [], datasets: [] },
            categoryDistribution: { labels: [], datasets: [] },
          })
        }
      } catch (error: any) {
        console.error("Error fetching results:", error)
        // Fallback to empty state
        setStats({
          exercisesCompleted: 0,
          averageAccuracy: 0,
          streak: 0,
        })
        setExerciseHistory([])
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

    // If most recent exercise wasn't today or yesterday, no streak
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let streak = 0
    let currentDate = new Date(today)

    if (mostRecent.getTime() === today.getTime()) {
      streak = 1
      currentDate = new Date(today)
    } else if (mostRecent.getTime() === yesterday.getTime()) {
      streak = 1
      currentDate = new Date(yesterday)
    } else {
      return 0
    }

    // Count consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i])
      prevDate.setHours(0, 0, 0, 0)

      currentDate.setDate(currentDate.getDate() - 1)

      if (prevDate.getTime() === currentDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  // Generate chart data from real results
  const generateChartData = (results: any[]) => {
    if (results.length === 0) return

    // Sort results by date
    const sortedResults = [...results].sort(
      (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime(),
    )

    // Accuracy trend - group by week
    const weeklyData: { [key: string]: { total: number; count: number } } = {}
    sortedResults.forEach((result) => {
      const date = new Date(result.completed_at)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Start of week
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { total: 0, count: 0 }
      }
      weeklyData[weekKey].total += result.accuracy
      weeklyData[weekKey].count += 1
    })

    const weekLabels = Object.keys(weeklyData)
      .sort()
      .slice(-8) // Last 8 weeks
      .map((date) => {
        const d = new Date(date)
        return `Week ${d.getMonth() + 1}/${d.getDate()}`
      })

    const weeklyAccuracies = Object.keys(weeklyData)
      .sort()
      .slice(-8)
      .map((week) => Math.round(weeklyData[week].total / weeklyData[week].count))

    // Difficulty distribution
    const difficultyCount: { [key: string]: number } = {}
    results.forEach((result) => {
      const difficulty = result.exercise_difficulty || "Unknown"
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1
    })

    // Category distribution
    const categoryCount: { [key: string]: number } = {}
    results.forEach((result) => {
      const category = result.exercise_category || "Unknown"
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    setChartData({
      accuracyTrend: {
        labels: weekLabels,
        datasets: [
          {
            label: "Average Accuracy",
            data: weeklyAccuracies,
            borderColor: "hsl(var(--primary))",
            backgroundColor: "hsl(var(--primary) / 0.2)",
            fill: true,
          },
        ],
      },
      difficultyDistribution: {
        labels: Object.keys(difficultyCount),
        datasets: [
          {
            label: "Exercises Completed",
            data: Object.values(difficultyCount),
            backgroundColor: [
              "hsl(var(--success) / 0.8)",
              "hsl(var(--warning) / 0.8)",
              "hsl(var(--destructive) / 0.8)",
              "hsl(var(--muted) / 0.8)",
            ],
          },
        ],
      },
      categoryDistribution: {
        labels: Object.keys(categoryCount),
        datasets: [
          {
            label: "Exercises by Category",
            data: Object.values(categoryCount),
            backgroundColor: "hsl(var(--primary) / 0.8)",
          },
        ],
      },
    })
  }

  // Filter exercise history based on selected period
  const getFilteredHistory = () => {
    if (exerciseHistory.length === 0) return []

    const now = new Date()
    const cutoffDate = new Date()

    switch (period) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
      default:
        return exerciseHistory
    }

    return exerciseHistory.filter((exercise) => new Date(exercise.completed_at) >= cutoffDate)
  }

  const filteredHistory = getFilteredHistory()

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
            <p className="text-xs text-muted-foreground">
              {stats.exercisesCompleted === 0 ? "Start your first exercise!" : "Keep up the great work!"}
            </p>
            {stats.exercisesCompleted > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col items-center">
                  <Badge className="bg-success mb-1">
                    {exerciseHistory.filter((e) => e.difficulty === "Simple").length}
                  </Badge>
                  <span className="text-muted-foreground">Simple</span>
                </div>
                <div className="flex flex-col items-center">
                  <Badge className="bg-warning mb-1">
                    {exerciseHistory.filter((e) => e.difficulty === "Medium").length}
                  </Badge>
                  <span className="text-muted-foreground">Medium</span>
                </div>
                <div className="flex flex-col items-center">
                  <Badge className="bg-destructive mb-1">
                    {exerciseHistory.filter((e) => e.difficulty === "Advanced").length}
                  </Badge>
                  <span className="text-muted-foreground">Advanced</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exercisesCompleted > 0 ? `${stats.averageAccuracy}%` : "—"}</div>
            <p className="text-xs text-muted-foreground">
              {stats.exercisesCompleted === 0 ? "Complete exercises to see accuracy" : "Based on all exercises"}
            </p>
            {stats.exercisesCompleted > 0 && (
              <>
                <div className="mt-4 h-1 w-full rounded-full bg-muted">
                  <div className="h-1 rounded-full bg-primary" style={{ width: `${stats.averageAccuracy}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Calendar</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">
              {stats.streak === 0 ? "Start practicing daily!" : "Current streak"}
            </p>
            <div className="mt-4">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.exercisesCompleted > 0 && chartData.accuracyTrend.labels.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Trend</CardTitle>
              <CardDescription>Your accuracy improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={chartData.accuracyTrend}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 0,
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
                  data={chartData.difficultyDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Exercise History</CardTitle>
          <CardDescription>
            {filteredHistory.length > 0
              ? `Your ${period === "all" ? "complete" : period} exercise history (${filteredHistory.length} exercises)`
              : "No exercise history found"}
          </CardDescription>
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
            {filteredHistory.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                {stats.exercisesCompleted === 0
                  ? "No exercise history found. Complete some exercises to see your progress."
                  : `No exercises found for the selected ${period} period.`}
              </div>
            ) : (
              filteredHistory.map((exercise, index) => (
                <div
                  key={`${exercise.id}-${index}`}
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
          {filteredHistory.length > 10 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {stats.exercisesCompleted > 0 && chartData.categoryDistribution.labels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Analysis</CardTitle>
            <CardDescription>Your performance across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={chartData.categoryDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
