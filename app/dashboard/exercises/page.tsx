"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Clock } from "lucide-react"

export default function ExercisesPage() {
  const { supabase } = useSupabase()
  const [searchQuery, setSearchQuery] = useState("")
  const [exercises, setExercises] = useState<any>({
    simple: [],
    medium: [],
    advanced: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      if (!supabase) return

      try {
        const { data, error } = await supabase.from("exercises").select("*").order("id", { ascending: true })

        if (error) throw error

        // Group exercises by difficulty
        const grouped = {
          simple: data.filter((ex) => ex.difficulty === "Simple"),
          medium: data.filter((ex) => ex.difficulty === "Medium"),
          advanced: data.filter((ex) => ex.difficulty === "Advanced"),
        }

        setExercises(grouped)
      } catch (error) {
        console.error("Error fetching exercises:", error)
        // Fallback to mock data if fetch fails
        setExercises({
          simple: [
            {
              id: 1,
              title: "Daily Routines",
              description: "Practice listening to descriptions of everyday activities",
              duration: "2-3 min",
              category: "Lifestyle",
            },
            {
              id: 2,
              title: "Travel Vocabulary",
              description: "Learn common phrases used when traveling",
              duration: "3-4 min",
              category: "Travel",
            },
            {
              id: 3,
              title: "Food and Restaurants",
              description: "Practice ordering food and discussing preferences",
              duration: "2-3 min",
              category: "Food",
            },
          ],
          medium: [
            {
              id: 4,
              title: "News Headlines",
              description: "Listen to current news stories and identify key information",
              duration: "4-5 min",
              category: "News",
            },
            {
              id: 5,
              title: "Job Interviews",
              description: "Practice understanding common interview questions and responses",
              duration: "5-6 min",
              category: "Business",
            },
            {
              id: 6,
              title: "Movie Reviews",
              description: "Listen to people discussing films and their opinions",
              duration: "4-5 min",
              category: "Entertainment",
            },
          ],
          advanced: [
            {
              id: 7,
              title: "Scientific Discussions",
              description: "Complex vocabulary and concepts from scientific fields",
              duration: "6-8 min",
              category: "Science",
            },
            {
              id: 8,
              title: "Business Negotiations",
              description: "Advanced business terminology and persuasive language",
              duration: "7-9 min",
              category: "Business",
            },
            {
              id: 9,
              title: "Literary Analysis",
              description: "Discussions about books, themes, and literary techniques",
              duration: "6-8 min",
              category: "Literature",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [supabase])

  const filteredExercises = {
    simple: exercises.simple.filter(
      (ex: any) =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.description && ex.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    medium: exercises.medium.filter(
      (ex: any) =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.description && ex.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    advanced: exercises.advanced.filter(
      (ex: any) =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.description && ex.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading exercises...</div>
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
          <p className="text-muted-foreground">Choose an exercise to practice your listening skills</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Challenge</CardTitle>
                <CardDescription>Complete for bonus XP</CardDescription>
              </div>
              <Badge className="bg-primary">New</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">Business Communication</h3>
                <p className="text-sm text-muted-foreground">Practice listening to a business meeting conversation</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">Medium</Badge>
                  <span>5-6 min</span>
                </div>
              </div>
              <Link href="/dashboard/exercises/daily" className="sm:self-end">
                <Button>Start Challenge</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="simple">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          {["simple", "medium", "advanced"].map((difficulty) => (
            <TabsContent key={difficulty} value={difficulty} className="space-y-4">
              {filteredExercises[difficulty as keyof typeof filteredExercises].length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-center text-muted-foreground">No exercises found matching your search</p>
                </div>
              ) : (
                filteredExercises[difficulty as keyof typeof filteredExercises].map((exercise: any) => (
                  <Card key={exercise.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium">{exercise.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exercise.description || exercise.text.substring(0, 100) + "..."}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{exercise.category}</Badge>
                            <span>{exercise.duration}</span>
                          </div>
                        </div>
                        <Link href={`/dashboard/exercises/${exercise.id}`} className="sm:self-end">
                          <Button variant="outline">Start Exercise</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

