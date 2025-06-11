"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Trophy, Medal } from "lucide-react"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock leaderboard data - in a real app, this would be fetched from an API
  const leaderboardData = {
    weekly: [
      { id: 1, username: "language_master", score: 2450, exercises: 18, accuracy: 97, rank: 1 },
      { id: 2, username: "english_pro", score: 2320, exercises: 15, accuracy: 95, rank: 2 },
      { id: 3, username: "word_wizard", score: 2180, exercises: 14, accuracy: 92, rank: 3 },
      { id: 4, username: "listening_guru", score: 2050, exercises: 16, accuracy: 89, rank: 4 },
      { id: 5, username: "vocab_king", score: 1980, exercises: 12, accuracy: 91, rank: 5 },
      { id: 6, username: "grammar_geek", score: 1850, exercises: 11, accuracy: 88, rank: 6 },
      { id: 7, username: "fluent_speaker", score: 1720, exercises: 10, accuracy: 86, rank: 7 },
      { id: 8, username: "english_learner", score: 1650, exercises: 9, accuracy: 84, rank: 8 },
      { id: 9, username: "practice_daily", score: 1520, exercises: 8, accuracy: 82, rank: 9 },
      { id: 10, username: "word_enthusiast", score: 1450, exercises: 7, accuracy: 80, rank: 10 },
    ],
    monthly: [
      { id: 1, username: "language_master", score: 9850, exercises: 72, accuracy: 96, rank: 1 },
      { id: 2, username: "vocab_king", score: 9320, exercises: 68, accuracy: 94, rank: 2 },
      { id: 3, username: "english_pro", score: 8750, exercises: 65, accuracy: 93, rank: 3 },
      { id: 4, username: "word_wizard", score: 8320, exercises: 62, accuracy: 91, rank: 4 },
      { id: 5, username: "listening_guru", score: 7980, exercises: 59, accuracy: 90, rank: 5 },
      { id: 6, username: "grammar_geek", score: 7650, exercises: 56, accuracy: 89, rank: 6 },
      { id: 7, username: "fluent_speaker", score: 7320, exercises: 54, accuracy: 87, rank: 7 },
      { id: 8, username: "english_learner", score: 6980, exercises: 51, accuracy: 85, rank: 8 },
      { id: 9, username: "practice_daily", score: 6650, exercises: 49, accuracy: 83, rank: 9 },
      { id: 10, username: "word_enthusiast", score: 6320, exercises: 47, accuracy: 82, rank: 10 },
    ],
    allTime: [
      { id: 2, username: "vocab_king", score: 42500, exercises: 320, accuracy: 95, rank: 1 },
      { id: 1, username: "language_master", score: 38750, exercises: 295, accuracy: 94, rank: 2 },
      { id: 3, username: "english_pro", score: 35200, exercises: 270, accuracy: 93, rank: 3 },
      { id: 4, username: "word_wizard", score: 32800, exercises: 250, accuracy: 92, rank: 4 },
      { id: 5, username: "listening_guru", score: 29500, exercises: 230, accuracy: 91, rank: 5 },
      { id: 6, username: "grammar_geek", score: 27200, exercises: 210, accuracy: 90, rank: 6 },
      { id: 7, username: "fluent_speaker", score: 24800, exercises: 195, accuracy: 89, rank: 7 },
      { id: 8, username: "english_learner", score: 22500, exercises: 180, accuracy: 88, rank: 8 },
      { id: 9, username: "practice_daily", score: 19800, exercises: 165, accuracy: 87, rank: 9 },
      { id: 10, username: "word_enthusiast", score: 17500, exercises: 150, accuracy: 86, rank: 10 },
    ],
  }

  // Filter leaderboard data based on search query
  const filterLeaderboard = (data: any[]) => {
    if (!searchQuery) return data
    return data.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
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

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other users</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Users with the highest scores based on accuracy and exercises completed</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
            {["weekly", "monthly", "allTime"].map((period) => (
              <TabsContent key={period} value={period}>
                <div className="space-y-8">
                  {/* Top 3 users */}
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {filteredLeaderboard[period as keyof typeof filteredLeaderboard].slice(0, 3).map((user, index) => (
                      <Card key={user.id} className={index === 0 ? "border-yellow-500" : ""}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="relative">
                              <Avatar className="h-20 w-20">
                                <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow">
                                {getRankBadge(user.rank)}
                              </div>
                            </div>
                            <h3 className="mt-4 text-lg font-medium">{user.username}</h3>
                            <p className="text-sm text-muted-foreground">Rank #{user.rank}</p>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className="font-medium">{user.score}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Exercises</p>
                                <p className="font-medium">{user.exercises}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                                <p className="font-medium">{user.accuracy}%</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Leaderboard table */}
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 border-b px-4 py-3 font-medium">
                      <div className="col-span-1 text-center">Rank</div>
                      <div className="col-span-5">User</div>
                      <div className="col-span-2 text-right">Score</div>
                      <div className="col-span-2 text-right">Exercises</div>
                      <div className="col-span-2 text-right">Accuracy</div>
                    </div>
                    {filteredLeaderboard[period as keyof typeof filteredLeaderboard].length === 0 ? (
                      <div className="px-4 py-8 text-center text-muted-foreground">
                        No users found matching your search
                      </div>
                    ) : (
                      filteredLeaderboard[period as keyof typeof filteredLeaderboard].map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-12 gap-2 border-b px-4 py-3 last:border-0 hover:bg-muted/50"
                        >
                          <div className="col-span-1 flex items-center justify-center">{getRankBadge(user.rank)}</div>
                          <div className="col-span-5 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.username} />
                              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{user.username}</span>
                            {user.rank <= 3 && (
                              <Badge variant="outline" className="ml-2">
                                Top {user.rank}
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-2 text-right font-medium">{user.score}</div>
                          <div className="col-span-2 text-right">{user.exercises}</div>
                          <div className="col-span-2 text-right">{user.accuracy}%</div>
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
    </div>
  )
}
