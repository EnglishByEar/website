"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import SplashScreen from "@/components/SplashScreen"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import GrammarSection from "@/components/grammar-section"
import Header from "@/components/header"
import Reveal from "@/components/reveal"
import Footer from "@/components/footer"
import VocabularySection from "@/components/vocabulary/vocabulary-section"

const difficultyLevels = [
  {
    label: "Simple",
    color: "bg-green-500",
    description: "Short sentences and common everyday vocabulary.",
  },
  {
    label: "Medium",
    color: "bg-yellow-500",
    description: "Longer paragraphs with more complex structures.",
  },
  {
    label: "Advanced",
    color: "bg-red-500",
    description: "Native-speed content with specialized vocabulary.",
  },
]

export default function Home() {
  const { user } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

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
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <GrammarSection />

        <section className="container border-t border-border py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Three difficulty levels
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Choose from Simple, Medium, or Advanced exercises to match your current
                skill level, then gradually increase the challenge as you improve.
              </p>
              <Button onClick={goToExercise} className="group mt-2 w-fit gap-2">
                Start an exercise
                <ArrowRight className="arrow-nudge h-4 w-4" />
              </Button>
            </Reveal>

            <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
              {difficultyLevels.map((level, i) => (
                <Reveal
                  as="div"
                  key={level.label}
                  delay={i * 120}
                  className="group flex items-start gap-4 p-6 transition-colors hover:bg-muted/20"
                >
                  <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125 ${level.color}`} />
                  <div>
                    <h3 className="font-semibold">{level.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <VocabularySection />


        <section className="container py-20 md:py-28">
          <Reveal className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-16 text-center transition-colors duration-300 hover:border-primary/40">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to train your ear?
            </h2>
            <p className="max-w-md text-balance text-muted-foreground leading-relaxed">
              Join EnglishByEar and start improving your listening comprehension today.
            </p>
            <Link href="/register">
              <Button size="lg" className="group gap-2">
                Get started for free
                <ArrowRight className="arrow-nudge h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}
