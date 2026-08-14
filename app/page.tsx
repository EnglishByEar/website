"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import SplashScreen from "@/components/SplashScreen"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import GrammarSection from "@/components/grammar-section"

export default function Home() {
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    initialize();
  }, []);


  const goToExercise = () => {
    if (user) {
      router.push("/dashboard/exercise")
    } else {
      router.push("/login")
    }
  }

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <span className="text-base md:text-xl font-bold ">EnglishByEar</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/podcast" className="hidden md:block">
              <Button variant="outline">Podcast</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">

        <HeroSection />

        <FeatureSection />

        <GrammarSection />

        <section className="container relative py-12 md:py-24 lg:py-32">
          <div className="w-[550px] h-[550px] absolute right-[70px] top-60 origin-top-left rotate-[-33.39deg] rounded-full bg-primary/20 blur-2xl z-0" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Three Difficulty Levels</h2>
              <p className="text-muted-foreground">
                Choose from Simple, Medium, or Advanced exercises to match your current skill level and gradually
                increase the challenge as you improve.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Simple: Short sentences and common vocabulary</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Medium: Longer paragraphs with more complex structures</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Advanced: Native-speed content with specialized vocabulary</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-end items-center">
              <div className="relative h-[350px] w-full max-w-[400px] overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background/50" />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Daily Challenge</span>
                  </div>
                  <div className="flex-1 rounded-lg bg-muted/50 p-4">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-full rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-5/6 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-2/3 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="h-4 w-full rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <Button onClick={goToExercise} className="w-full">Start Exercise</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

