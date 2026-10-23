import type { ReadingLevel } from "@/types/reading"

export const READING_PATH = "/dashboard/reading"

export const READING_LEVELS: { value: ReadingLevel; code: string; blurb: string }[] = [
  { value: "Elementary", code: "A1 - A2", blurb: "Short texts about everyday life" },
  { value: "Intermediate", code: "B1 - B2", blurb: "Real-world topics at natural pace" },
  { value: "Advanced", code: "C1 - C2", blurb: "Complex ideas and richer vocabulary" },
]

/** Badge colors that follow the theme tokens */
export const levelTone: Record<ReadingLevel, string> = {
  Elementary: "bg-secondary text-secondary-foreground",
  Intermediate: "bg-primary/10 text-primary",
  Advanced: "bg-accent text-accent-foreground",
}

export const scoreMessage = (score: number) =>
  score >= 90 ? "Excellent work!" : score >= 70 ? "Great job!" : score >= 50 ? "Good effort!" : "Keep practicing, you'll get there."

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Map a Supabase/Postgres error to a short message a learner can understand */
export function readingErrorMessage(message?: string) {
  if (message?.includes("attempt_not_completed")) return "This attempt hasn't been submitted yet."
  if (message?.includes("attempt_not_found") || message?.includes("passage_not_found")) return "We couldn't find that reading."
  if (message?.includes("not_authenticated")) return "Please sign in again to continue."
  return "Something went wrong. Please try again."
}
