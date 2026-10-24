"use client"

import { use } from "react"
import { ReadingResultsView } from "@/components/reading/reading-results"

export default function ReadingResultsPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params)
  return <ReadingResultsView attemptId={attemptId} />
}
