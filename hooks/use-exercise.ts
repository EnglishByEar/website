"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import type { Exercise } from "@/types/exercise"

// Postgres / PostgREST codes meaning: table missing, bad id syntax, no row found.
const NOT_FOUND_ERROR_CODES = ["42P01", "22P02", "PGRST116"]

export function useExercise(id: string) {
  const supabase = useSupabase()?.supabase ?? null
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    const load = async () => {
      try {
        const { data, error } = await supabase.from("exercises").select("*").eq("id", id).single()

        if (error) {
          const notFound =
            NOT_FOUND_ERROR_CODES.includes(error.code) || error.message?.includes("does not exist")
          if (!notFound) throw error
        }

        if (!cancelled) setExercise((data as Exercise | null) ?? null)
      } catch (err) {
        console.error("Failed to load exercise:", err)
        if (!cancelled) setExercise(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [supabase, id])

  return { exercise, loading }
}