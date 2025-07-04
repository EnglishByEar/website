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
  const [audioAvailable, setAudioAvailable] = useState(false)

  useEffect(() => {
    const fetchExercise = async () => {
      if (!supabase) return

      try {
        const { data, error } = await supabase.from("exercises").select("*").eq("id", params.id).single()

        if (error) {
          // Table missing, bad id syntax, or no row -- fall back to mock content.
          const safeToMock =
            error.code === "42P01" ||
            error.code === "22P02" ||
            error.code === "PGRST116" ||
            error.message?.includes("does not exist")

          if (!safeToMock) {
            throw error
          }
        }

        if (data) {
          setExercise(data)
          return
        }

        // ---- MOCK EXERCISE FALLBACK ----
        const mockExercises = {
          "1": {
            id: 1,
            title: "Travel Vocabulary",
            difficulty: "Simple",
            category: "Travel",
            duration: "3-4 min",
            text: "I'm planning a trip to Japan next month. I've already booked my flight and hotel. I'll be staying in Tokyo for a week, and then I'll visit Kyoto for three days. I'm really excited about trying the local food and visiting some temples. I need to pack light because I'll be using public transportation a lot. Do you have any recommendations for places to visit in Japan?",
          },
          "2": {
            id: 2,
            title: "Science Documentary",
            difficulty: "Advanced",
            category: "Science",
            duration: "6-8 min",
            text: "Climate change represents one of the most significant challenges facing humanity in the twenty-first century. The scientific consensus indicates that global temperatures have risen by approximately 1.1 degrees Celsius since pre-industrial times, primarily due to increased concentrations of greenhouse gases in the atmosphere. These gases, including carbon dioxide, methane, and nitrous oxide, trap heat from the sun and prevent it from escaping back into space, creating what scientists call the greenhouse effect.",
          },
          "3": {
            id: 3,
            title: "Casual Conversation",
            difficulty: "Medium",
            category: "Lifestyle",
            duration: "4-5 min",
            text: "Hey Sarah, how was your weekend? I heard you went to that new restaurant downtown. Oh, it was amazing! The food was incredible, and the atmosphere was so cozy. We had to wait about thirty minutes for a table, but it was totally worth it. I ordered the salmon with roasted vegetables, and my partner had the pasta with mushroom sauce. For dessert, we shared the chocolate cake, which was absolutely divine. You should definitely try it sometime.",
          },
          daily: {
            id: "daily",
            title: "Business Communication",
            difficulty: "Medium",
            category: "Business",
            duration: "5-6 min",
            text: "Good morning everyone, and thank you for joining today's quarterly review meeting. As we can see from the presentation, our sales figures have exceeded expectations by fifteen percent this quarter. The marketing campaign we launched in September has been particularly successful, generating a twenty-three percent increase in customer engagement across all digital platforms. However, we still need to address some challenges in our supply chain management to ensure we can meet the growing demand for our products.",
          },
        }

        const mockExercise = mockExercises[params.id as keyof typeof mockExercises] || mockExercises["1"]
        setExercise(mockExercise)
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

  // Save to local storage with proper user separation
  const saveToLocalStorage = (results: any) => {
    try {
      const storageKey = `englishbyear_results_${user?.id || "anonymous"}`
      const existingResults = JSON.parse(localStorage.getItem(storageKey) || "[]")

      const newResult = {
        id: Date.now(),
        user_id: user?.id || "anonymous",
        exercise_id: exercise.id,
        exercise_title: exercise.title,
        exercise_difficulty: exercise.difficulty,
        exercise_category: exercise.category,
        user_text: userText,
        accuracy: results.accuracy,
        mistakes: results.mistakes,
        completed_at: new Date().toISOString(),
      }

      existingResults.unshift(newResult) // Add to beginning

      // Keep only last 50 results per user
      if (existingResults.length > 50) {
        existingResults.splice(50)
      }

      localStorage.setItem(storageKey, JSON.stringify(existingResults))

      // Also update the global storage for backward compatibility
      const globalResults = JSON.parse(localStorage.getItem("englishbyear_results") || "[]")
      globalResults.unshift(newResult)
      if (globalResults.length > 200) {
        // Keep more in global storage
        globalResults.splice(200)
      }
      localStorage.setItem("englishbyear_results", JSON.stringify(globalResults))

      console.log(`Saved result for user ${user?.id?.substring(0, 8)}... to both storages`)
      return true
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      return false
    }
  }

  // Create / update the audio element whenever we have an exercise with audio
  useEffect(() => {
    // clean-up whatever was there before
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current.load()
    }

    if (!exercise?.audio_url) {
      setAudioAvailable(false)
      return
    }

    try {
      const audio = new Audio(exercise.audio_url)
      audioRef.current = audio
      setAudioAvailable(true)

      const updateProgress = () => {
        if (audio.duration) {
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
      }
    } catch {
      // If the URL is bad we just disable audio controls
      setAudioAvailable(false)
    }
  }, [exercise])

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
    if (!audioAvailable || !audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        toast({
          title: "Audio Error",
          description: "Unable to play this audio file.",
          variant: "destructive",
        })
      })
    }
    setIsPlaying(!isPlaying)
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

  // ----- submit & persist results ------------------------------------------
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

    // Keep track of where we managed to store the data
    let savedToDatabase = false
    let savedToLocalStorage = false

    // ---------- 1) Try Supabase first --------------------------------------
    if (user && supabase && typeof exercise.id === "number") {
      try {
        const { error } = await supabase.from("exercise_results").insert({
          user_id: user.id,
          exercise_id: exercise.id,
          user_text: userText,
          accuracy: results.accuracy,
          mistakes: results.mistakes,
          completed_at: new Date().toISOString(),
        })

        if (error) {
          // Supabase PostgrestError fields are non-enumerable – log them manually.
          if (error) {
            /* eslint-disable no-console */
            console.error("Supabase insert error:", {
              code: (error as any).code,
              message: (error as any).message,
              details: (error as any).details,
              hint: (error as any).hint,
            })
            /* eslint-enable no-console */
          }

          // If the table is missing or RLS blocks us, switch to local storage
          const missingTable = error.code === "42P01" || error.message?.includes("does not exist") // relation missing
          const rlsDenied = error.code === "42501" || /permission|rls/i.test(error.message || "")

          if (!missingTable && !rlsDenied) {
            // Unknown DB error → rethrow so we hit the global catch
            throw error
          }
        } else {
          savedToDatabase = true
          console.log(`Saved exercise result to database for user ${user.id.substring(0, 8)}...`)
        }
      } catch (err) {
        // Unknown DB error, we'll still try local fallback
        console.error("Unexpected DB error when saving results:", err)
      }
    }

    // ---------- 2) Always save to localStorage as a backup ------------------
    if (!savedToDatabase) {
      savedToLocalStorage = saveToLocalStorage(results)
    }

    // ---------- 3) Show user feedback --------------------------------------
    toast({
      title: "Exercise completed!",
      description:
        `You scored ${results.accuracy}% accuracy.` +
        (savedToDatabase
          ? "  Results were saved to your profile."
          : savedToLocalStorage
            ? "  Results were saved locally on this device."
            : "  Results could not be saved."),
      variant: savedToDatabase || savedToLocalStorage ? "default" : "destructive",
    })

    // ---------- 4) Tell the dashboard to refresh ---------------------------
    window.dispatchEvent(
      new CustomEvent("exerciseCompleted", {
        detail: {
          exerciseId: exercise.id,
          accuracy: results.accuracy,
          savedToDatabase,
          savedToLocalStorage,
          userId: user?.id,
        },
      }),
    )
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
                {audioAvailable ? (
                  <>
                    <Button variant="outline" size="icon" onClick={togglePlay} disabled={submitted}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setMuted(!muted)} disabled={submitted}>
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={resetExercise}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Audio not available - read the text below after submitting</span>
                  </div>
                )}
              </div>
              {audioAvailable && (
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
              )}
            </div>
            {audioAvailable && <Progress value={progress} />}
          </div>

          {showText && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Original Text:</h3>
              <p className="leading-relaxed">{exercise.text}</p>
            </div>
          )}

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

          {submitted && results && (
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

              {/* Show comparison */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Your Answer:</h4>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">{userText}</p>
                </div>
              </div>
            </div>
          )}
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
