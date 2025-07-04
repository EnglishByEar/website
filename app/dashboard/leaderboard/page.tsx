"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Trophy, Medal, Users, UserPlus, RefreshCw } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  id: string
  username: string
  email: string
  score: number
  exercises: number
  accuracy: number
  rank: number
  avatar_url?: string
}

export default function LeaderboardPage() {
  const { supabase, user } = useSupabase()
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [leaderboardData, setLeaderboardData] = useState<{
    weekly: LeaderboardUser[]
    monthly: LeaderboardUser[]
    allTime: LeaderboardUser[]
  }>({
    weekly: [],
    monthly: [],
    allTime: [],
  })

  // Function to load results from localStorage for a specific user
  const loadFromLocalStorage = (userId?: string) => {
    try {
      const stored = localStorage.getItem("englishbyear_results")
      const allResults = stored ? JSON.parse(stored) : []

      // If userId is provided, filter for that user, otherwise return all
      if (userId) {
        return allResults.filter((r: any) => r.user_id === userId || (r.user_id === "anonymous" && userId === user?.id))
      }

      return allResults
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return []
    }
  }

  // Calculate score based on accuracy and number of exercises
  const calculateScore = (exercises: number, averageAccuracy: number) => {
    let accuracyMultiplier = 0
    if (averageAccuracy > 95) accuracyMultiplier = 20
    else if (averageAccuracy > 85) accuracyMultiplier = 15
    else if (averageAccuracy > 70) accuracyMultiplier = 10
    else if (averageAccuracy > 50) accuracyMultiplier = 5

    return exercises * 10 + exercises * accuracyMultiplier
  }

  // Get date range for filtering
  const getDateRange = (period: "weekly" | "monthly" | "allTime") => {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "weekly":
        startDate.setDate(now.getDate() - 7)
        break
      case "monthly":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "allTime":
      default:
        startDate.setFullYear(2020)
        break
    }

    return { startDate, endDate: now }
  }

  const fetchLeaderboardData = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const debug: any = {
      profilesFound: 0,
      resultsFound: 0,
      currentUserId: user?.id,
      errors: [],
      profilesList: [],
      resultsBreakdown: {},
      localStorageResults: 0,
    }

    try {
      // First, try to get all users with profiles
      let profiles: any[] = []
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, email, avatar_url, created_at")

        if (profilesError) {
          if (!(profilesError.code === "42P01" || profilesError.message?.includes("does not exist"))) {
            throw profilesError
          }
          debug.errors.push("Profiles table not found - creating fallback profiles")
          console.warn("Profiles table not found")
        } else {
          profiles = profilesData || []
          debug.profilesFound = profiles.length
          debug.profilesList = profiles.map((p) => ({
            id: p.id.substring(0, 8) + "...",
            username: p.username,
            email: p.email,
          }))
          console.log(`Found ${profiles.length} profiles:`, debug.profilesList)
        }
      } catch (error) {
        debug.errors.push(`Profile fetch error: ${error}`)
        console.warn("Error fetching profiles")
      }

      // If no profiles found, create fallback for current user
      if (profiles.length === 0 && user) {
        profiles = [
          {
            id: user.id,
            username: user.user_metadata?.username || user.email?.split("@")[0] || "User",
            email: user.email || "",
            avatar_url: null,
            created_at: new Date().toISOString(),
          },
        ]
        debug.profilesFound = 1
        debug.errors.push("Using fallback profile for current user only")
      }

      if (profiles.length === 0) {
        debug.errors.push("No profiles found at all")
        setLeaderboardData({ weekly: [], monthly: [], allTime: [] })
        setDebugInfo(debug)
        setLoading(false)
        return
      }

      // Get exercise results for all users
      let allResults: any[] = []
      try {
        const { data: resultsData, error: resultsError } = await supabase
          .from("exercise_results")
          .select("user_id, accuracy, completed_at, exercise_id")

        if (resultsError) {
          if (!(resultsError.code === "42P01" || resultsError.message?.includes("does not exist"))) {
            throw resultsError
          }
          debug.errors.push("Exercise results table not found - using localStorage")
          console.warn("Exercise results table not found, using localStorage")
        } else {
          allResults = resultsData || []
          debug.resultsFound = allResults.length

          // Count results per user
          const userResultCounts: { [key: string]: number } = {}
          allResults.forEach((r) => {
            const shortId = r.user_id.substring(0, 8) + "..."
            userResultCounts[shortId] = (userResultCounts[shortId] || 0) + 1
          })
          debug.resultsBreakdown = userResultCounts

          console.log(`Found ${allResults.length} exercise results:`, userResultCounts)
        }
      } catch (error) {
        debug.errors.push(`Results fetch error: ${error}`)
        console.warn("Error fetching exercise results")
      }

      // If no database results, try to get localStorage data for all known users
      if (allResults.length === 0) {
        const localResults = loadFromLocalStorage()
        debug.localStorageResults = localResults.length

        // Group localStorage results by user
        const localUserResults: { [key: string]: any[] } = {}
        localResults.forEach((r: any) => {
          const userId = r.user_id === "anonymous" ? user?.id || "anonymous" : r.user_id
          if (!localUserResults[userId]) {
            localUserResults[userId] = []
          }
          localUserResults[userId].push({
            user_id: userId,
            accuracy: r.accuracy,
            completed_at: r.completed_at,
            exercise_id: r.exercise_id,
          })
        })

        // Flatten back to single array
        allResults = Object.values(localUserResults).flat()
        debug.resultsFound = allResults.length
        debug.errors.push(
          `Using ${localResults.length} localStorage results for ${Object.keys(localUserResults).length} users`,
        )

        const localUserCounts: { [key: string]: number } = {}
        Object.entries(localUserResults).forEach(([userId, results]) => {
          const shortId = userId.substring(0, 8) + "..."
          localUserCounts[shortId] = results.length
        })
        debug.resultsBreakdown = localUserCounts

        console.log("localStorage results breakdown:", localUserCounts)
      }

      // Calculate leaderboard for each period
      const periods: Array<"weekly" | "monthly" | "allTime"> = ["weekly", "monthly", "allTime"]
      const newLeaderboardData: any = {}

      periods.forEach((period) => {
        const { startDate } = getDateRange(period)

        // Filter results by date range
        const periodResults = allResults.filter((result) => new Date(result.completed_at) >= startDate)

        // Group results by user
        const userStats: { [userId: string]: { exercises: number; totalAccuracy: number } } = {}

        periodResults.forEach((result) => {
          if (!userStats[result.user_id]) {
            userStats[result.user_id] = { exercises: 0, totalAccuracy: 0 }
          }
          userStats[result.user_id].exercises += 1
          userStats[result.user_id].totalAccuracy += result.accuracy
        })

        // Create leaderboard entries
        const leaderboardUsers: LeaderboardUser[] = profiles
          .map((profile) => {
            const stats = userStats[profile.id] || { exercises: 0, totalAccuracy: 0 }
            const averageAccuracy = stats.exercises > 0 ? Math.round(stats.totalAccuracy / stats.exercises) : 0
            const score = calculateScore(stats.exercises, averageAccuracy)

            return {
              id: profile.id,
              username: profile.username || profile.email?.split("@")[0] || "User",
              email: profile.email || "",
              avatar_url: profile.avatar_url,
              score,
              exercises: stats.exercises,
              accuracy: averageAccuracy,
              rank: 0, // Will be set after sorting
            }
          })
          .filter((user) => user.exercises > 0) // Only include users with exercises
          .sort((a, b) => b.score - a.score) // Sort by score descending
          .map((user, index) => ({ ...user, rank: index + 1 })) // Add rank

        newLeaderboardData[period] = leaderboardUsers
        debug[`${period}Users`] = leaderboardUsers.length
      })

      setLeaderboardData(newLeaderboardData)
      setDebugInfo(debug)
      console.log("Final leaderboard debug info:", debug)
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
      debug.errors.push(`General error: ${error}`)
      setLeaderboardData({ weekly: [], monthly: [], allTime: [] })
      setDebugInfo(debug)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [supabase, user])

  // Filter leaderboard data based on search query
  const filterLeaderboard = (data: LeaderboardUser[]) => {
    if (!searchQuery) return data
    return data.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const filteredLeaderboard = {
    weekly: filterLeaderboard(leaderboardData.weekly),
    monthly: filterLeaderboard(leaderboardData.monthly),
    allTime: filterLeaderboard(leaderboardData.allTime),
  }

  // Get rank badge component based on position
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />
    return <span className="font-medium">{rank}</span>
  }

  // Get current user's rank in each period
  const getCurrentUserRank = (period: "weekly" | "monthly" | "allTime") => {
    if (!user) return null
    const userData = leaderboardData[period].find((u) => u.id === user.id)
    return userData ? userData.rank : null
  }

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading leaderboard...</div>
  }

  const hasAnyData =
    leaderboardData.weekly.length > 0 || leaderboardData.monthly.length > 0 || leaderboardData.allTime.length > 0

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            {hasAnyData ? "See how you rank against other users" : "Complete exercises to appear on the leaderboard"}
          </p>
          {debugInfo && (
            <details className="mt-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                🔍 Debug Info - Click to see why only {debugInfo.allTimeUsers || 0} user(s) appear
              </summary>
              <div className="mt-2 p-3 bg-muted rounded text-xs space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Database Status:</p>
                    <p>• Profiles found: {debugInfo.profilesFound}</p>
                    <p>• Exercise results found: {debugInfo.resultsFound}</p>
                    <p>• localStorage results: {debugInfo.localStorageResults}</p>
                    <p>• All-time leaderboard users: {debugInfo.allTimeUsers || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium">Current Session:</p>
                    <p>• Your user ID: {debugInfo.currentUserId?.substring(0, 8)}...</p>
                    <p>• Profiles in DB: {debugInfo.profilesList?.length || 0}</p>
                  </div>
                </div>

                {debugInfo.profilesList && debugInfo.profilesList.length > 0 && (
                  <div>
                    <p className="font-medium">Found Profiles:</p>
                    {debugInfo.profilesList.map((profile: any, i: number) => (
                      <p key={i}>
                        • {profile.username} ({profile.email}) - ID: {profile.id}
                      </p>
                    ))}
                  </div>
                )}

                {debugInfo.resultsBreakdown && Object.keys(debugInfo.resultsBreakdown).length > 0 && (
                  <div>
                    <p className="font-medium">Exercise Results by User:</p>
                    {Object.entries(debugInfo.resultsBreakdown).map(([userId, count]) => (
                      <p key={userId}>
                        • User {userId}: {count} exercises
                      </p>
                    ))}
                  </div>
                )}

                {debugInfo.errors.length > 0 && (
                  <div>
                    <p className="font-medium text-orange-600">Issues Found:</p>
                    {debugInfo.errors.map((error: string, i: number) => (
                      <p key={i} className="text-orange-600">
                        • {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="font-medium">Troubleshooting:</p>
                  <p>1. Make sure both users have completed exercises</p>
                  <p>2. Check if profiles table exists in Supabase</p>
                  <p>3. Verify exercise_results table has data for both users</p>
                  <p>4. localStorage data is per-browser, not per-user</p>
                </div>
              </div>
            </details>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchLeaderboardData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {hasAnyData && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {!hasAnyData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Leaderboard Data Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {debugInfo?.profilesFound === 1
                ? "Only one user profile found. Make sure both users have registered and completed exercises."
                : debugInfo?.profilesFound > 1
                  ? "Multiple users found but no exercise data. Each user needs to complete at least one exercise."
                  : "No user profiles found. Make sure users are registered and have completed exercises."}
            </p>
            <div className="flex gap-4 mb-4">
              <Link href="/dashboard/exercises">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Complete Exercises
                </Button>
              </Link>
              <Button variant="outline" onClick={fetchLeaderboardData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
            <Badge variant="outline" className="mb-2">
              Scoring: Exercises × 10 + Accuracy Bonus
            </Badge>
            <p className="text-xs text-muted-foreground text-center">
              Accuracy bonus: 50%+ = +5 per exercise, 70%+ = +10, 85%+ = +15, 95%+ = +20
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Users ranked by score (exercises completed × accuracy bonus)
              {user && (
                <div className="mt-2 flex gap-4 text-sm">
                  {getCurrentUserRank("weekly") && <span>Your weekly rank: #{getCurrentUserRank("weekly")}</span>}
                  {getCurrentUserRank("allTime") && <span>Your all-time rank: #{getCurrentUserRank("allTime")}</span>}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="allTime">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Weekly ({leaderboardData.weekly.length})</TabsTrigger>
                <TabsTrigger value="monthly">Monthly ({leaderboardData.monthly.length})</TabsTrigger>
                <TabsTrigger value="allTime">All Time ({leaderboardData.allTime.length})</TabsTrigger>
              </TabsList>
              {(["weekly", "monthly", "allTime"] as const).map((period) => (
                <TabsContent key={period} value={period}>
                  <div className="space-y-8">
                    {/* Top 3 users */}
                    {filteredLeaderboard[period].length > 0 && (
                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {filteredLeaderboard[period].slice(0, 3).map((leaderUser, index) => (
                          <Card key={leaderUser.id} className={index === 0 ? "border-yellow-500" : ""}>
                            <CardContent className="pt-6">
                              <div className="flex flex-col items-center text-center">
                                <div className="relative">
                                  <Avatar className="h-20 w-20">
                                    <AvatarImage
                                      src={leaderUser.avatar_url || `/placeholder.svg?height=80&width=80`}
                                      alt={leaderUser.username}
                                    />
                                    <AvatarFallback>{leaderUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow">
                                    {getRankBadge(leaderUser.rank)}
                                  </div>
                                </div>
                                <h3 className="mt-4 text-lg font-medium">{leaderUser.username}</h3>
                                <p className="text-sm text-muted-foreground">Rank #{leaderUser.rank}</p>
                                {leaderUser.id === user?.id && (
                                  <Badge variant="outline" className="mt-1">
                                    You
                                  </Badge>
                                )}
                                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                    <p className="font-medium">{leaderUser.score}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Exercises</p>
                                    <p className="font-medium">{leaderUser.exercises}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                    <p className="font-medium">{leaderUser.accuracy}%</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Leaderboard table */}
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 border-b px-4 py-3 font-medium">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-5">User</div>
                        <div className="col-span-2 text-right">Score</div>
                        <div className="col-span-2 text-right">Exercises</div>
                        <div className="col-span-2 text-right">Accuracy</div>
                      </div>
                      {filteredLeaderboard[period].length === 0 ? (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                          {searchQuery
                            ? "No users found matching your search"
                            : `No users have completed exercises in the ${period === "allTime" ? "selected" : period} period`}
                        </div>
                      ) : (
                        filteredLeaderboard[period].map((leaderUser) => (
                          <div
                            key={leaderUser.id}
                            className={`grid grid-cols-12 gap-2 border-b px-4 py-3 last:border-0 hover:bg-muted/50 ${
                              leaderUser.id === user?.id ? "bg-primary/5" : ""
                            }`}
                          >
                            <div className="col-span-1 flex items-center justify-center">
                              {getRankBadge(leaderUser.rank)}
                            </div>
                            <div className="col-span-5 flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={leaderUser.avatar_url || `/placeholder.svg?height=32&width=32`}
                                  alt={leaderUser.username}
                                />
                                <AvatarFallback>{leaderUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="flex items-center gap-2">
                                  {leaderUser.username}
                                  {leaderUser.id === user?.id && (
                                    <Badge variant="outline" className="text-xs">
                                      You
                                    </Badge>
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">{leaderUser.email}</span>
                              </div>
                              {leaderUser.rank <= 3 && (
                                <Badge variant="outline" className="ml-auto">
                                  Top {leaderUser.rank}
                                </Badge>
                              )}
                            </div>
                            <div className="col-span-2 text-right font-medium">{leaderUser.score}</div>
                            <div className="col-span-2 text-right">{leaderUser.exercises}</div>
                            <div className="col-span-2 text-right">{leaderUser.accuracy}%</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {hasAnyData && (
        <Card>
          <CardHeader>
            <CardTitle>How Scoring Works</CardTitle>
            <CardDescription>Understanding the leaderboard ranking system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Base Score</h4>
                <p className="text-sm text-muted-foreground">Each completed exercise gives you 10 points</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Accuracy Bonus</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>95%+ accuracy: +20 points per exercise</div>
                  <div>85%+ accuracy: +15 points per exercise</div>
                  <div>70%+ accuracy: +10 points per exercise</div>
                  <div>50%+ accuracy: +5 points per exercise</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Example:</strong> If you complete 10 exercises with 90% average accuracy, your score would be:
                (10 × 10) + (10 × 15) = 250 points
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
