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
import Image from "next/image"

export default function DashboardPage() {
  const { supabase, user } = useSupabase()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    exercisesCompleted: 0,
    averageAccuracy: 0,
    streak: 0,
    level: 1,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !supabase) return

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) throw error
        setProfile(data)

        // Simulate fetching stats
        setStats({
          exercisesCompleted: Math.floor(Math.random() * 50),
          averageAccuracy: Math.floor(Math.random() * 40) + 60, // 60-100%
          streak: Math.floor(Math.random() * 10),
          level: Math.floor(Math.random() * 5) + 1,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, user])

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading...</div>
  }

  const dailyChallenge = {
    title: "Business Communication",
    difficulty: "Medium",
    description: "Practice listening to a business meeting conversation",
    xp: 50,
  }

  const recentExercises = [
    {
      id: 1,
      title: "Travel Vocabulary",
      difficulty: "Simple",
      accuracy: 92,
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Science Documentary",
      difficulty: "Advanced",
      accuracy: 78,
      date: "5 days ago",
    },
    {
      id: 3,
      title: "Casual Conversation",
      difficulty: "Medium",
      accuracy: 85,
      date: "1 week ago",
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first exercise",
      unlocked: true,
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Achieve 100% accuracy on any exercise",
      unlocked: false,
    },
    {
      id: 3,
      title: "Week Streak",
      description: "Complete exercises for 7 days in a row",
      unlocked: false,
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
            <Image src={"/logo.png"} alt="logo" height={40} width={40}/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exercisesCompleted}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 5) + 1} from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <Progress value={stats.averageAccuracy} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep practicing daily!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {stats.level}</div>
            <Progress value={(stats.level % 5) * 20} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {5 - (stats.level % 5)} more to level {Math.floor(stats.level / 5) * 5 + 5}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
            <CardDescription>Your last 3 completed exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between">
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
                      <p className="text-xs text-muted-foreground">{exercise.date}</p>
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
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/progress">
              <Button variant="outline">View All History</Button>
            </Link>
          </CardFooter>
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
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>
            <TabsContent value="unlocked" className="space-y-4">
              {achievements
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
                ))}
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

