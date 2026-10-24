"use client"

import { use } from "react"
import { ReadingExercise } from "@/components/reading/reading-exercise"

export default function ReadingExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ReadingExercise key={id} passageId={id} />
}
