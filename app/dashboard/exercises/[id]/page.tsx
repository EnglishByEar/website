"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Volume2, VolumeX, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [userText, setUserText] = useState("")
  const [showText, setShowText] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [exercise, setExercise] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchExercise = async () => {
      if (!supabase) return

      try {
        const { data, error } = await supabase.from("exercises").select("*").eq("id", params.id).single()

        if (error) throw error

        setExercise(data)
      } catch (error) {
        console.error("Error fetching exercise:", error)
        // Fallback to mock data if fetch fails
        setExercise({
          id: params.id,
          title: "Travel Vocabulary",
          difficulty: "Simple",
          category: "Travel",
          duration: "3-4 min",
          text: "I'm planning a trip to Japan next month. I've already booked my flight and hotel. I'll be staying in Tokyo for a week, and then I'll visit Kyoto for three days. I'm really excited about trying the local food and visiting some temples. I need to pack light because I'll be using public transportation a lot. Do you have any recommendations for places to visit in Japan?",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [supabase, params.id])

  // Results calculation
  const calculateResults = () => {
    if (!exercise) return { accuracy: 0, mistakes: 0, totalWords: 0 }

    const originalWords = exercise.text.toLowerCase().split(/\s+/)
    const userWords = userText.toLowerCase().split(/\s+/)

    let correctWords = 0
    const totalWords = originalWords.length

    for (let i = 0; i < Math.min(originalWords.length, userWords.length); i++) {
      if (originalWords[i] === userWords[i]) {
        correctWords++
      }
    }

    const accuracy = Math.round((correctWords / totalWords) * 100)
    const mistakes = totalWords - correctWords

    return { accuracy, mistakes, totalWords }
  }

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/placeholder.mp3") // This would be a real audio file in production

    // Set up event listeners
    const audio = audioRef.current

    const updateProgress = () => {
      if (audio && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setProgress(0)
    })

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("ended", () => {
        setIsPlaying(false)
        setProgress(0)
      })

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          toast({
            title: "Audio Error",
            description: "There was a problem playing the audio. Please try again.",
            variant: "destructive",
          })
          console.error("Audio playback error:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const resetExercise = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setUserText("")
    setShowText(false)
    setSubmitted(false)
    setProgress(0)
  }

  const handleSubmit = async () => {
    if (userText.trim() === "") {
      toast({
        title: "Empty submission",
        description: "Please type what you heard before submitting.",
        variant: "destructive",
      })
      return
    }

    setSubmitted(true)
    setShowText(true)

    const results = calculateResults()

    // Save results to database if user is logged in and supabase is available
    if (user && supabase && exercise) {
      try {
        const { error } = await supabase.from("exercise_results").insert({
          user_id: user.id,
          exercise_id: exercise.id,
          user_text: userText,
          accuracy: results.accuracy,
          mistakes: results.mistakes,
          completed_at: new Date().toISOString(),
        })

        if (error) throw error

        toast({
          title: "Exercise completed!",
          description: `You scored ${results.accuracy}% accuracy. Results saved.`,
        })
      } catch (error) {
        console.error("Error saving results:", error)
        toast({
          title: "Exercise completed!",
          description: `You scored ${results.accuracy}% accuracy. Results could not be saved.`,
        })
      }
    } else {
      toast({
        title: "Exercise completed!",
        description: `You scored ${results.accuracy}% accuracy.`,
      })
    }
  }

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading exercise...</div>
  }

  if (!exercise) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center flex-col gap-4">
        <h2 className="text-xl">Exercise not found</h2>
        <Button onClick={() => router.push("/dashboard/exercises")}>Back to Exercises</Button>
      </div>
    )
  }

  const results = submitted ? calculateResults() : null

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exercise.title}</h1>
          <div className="flex items-center gap-2 mt-1">
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
            <Badge variant="outline">{exercise.category}</Badge>
            <span className="text-sm text-muted-foreground">{exercise.duration}</span>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/exercises")}>
          Back to Exercises
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listening Exercise</CardTitle>
          <CardDescription>
            Listen to the audio and type what you hear. You can play the audio multiple times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={togglePlay} disabled={submitted}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setMuted(!muted)} disabled={submitted}>
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={resetExercise}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <div className="w-32">
                  <Slider
                    value={[playbackRate * 100]}
                    min={50}
                    max={150}
                    step={25}
                    onValueChange={(value) => setPlaybackRate(value[0] / 100)}
                    disabled={submitted}
                  />
                </div>
                <span className="text-sm">{playbackRate}x</span>
              </div>
            </div>
            <Progress value={progress} />
          </div>

          {showText ? (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Original Text:</h3>
              <p>{exercise.text}</p>
            </div>
          ) : null}

          <div>
            <Textarea
              placeholder="Type what you hear..."
              className="min-h-[150px]"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              disabled={submitted}
            />
            {!submitted && (
              <p className="mt-2 text-sm text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                The text will remain hidden until you submit your answer
              </p>
            )}
          </div>

          {submitted && results ? (
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Your Results:</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <div className="flex items-center gap-2">
                    <Progress value={results.accuracy} className="h-2" />
                    <span className="font-medium">{results.accuracy}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mistakes</p>
                  <p className="text-2xl font-bold">{results.mistakes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Words</p>
                  <p className="text-2xl font-bold">{results.totalWords}</p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={userText.trim() === ""}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={resetExercise} variant="outline">
              Try Again
            </Button>
          )}
          {submitted && <Button onClick={() => router.push("/dashboard/exercises")}>Next Exercise</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}
