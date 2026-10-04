import type { ExerciseScore } from "@/types/exercise"

export const normalizeWords = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[’‘']/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)

/** Word-level Levenshtein distance between the original and typed text. */
export function calculateScore(originalText: string, typedText: string): ExerciseScore {
  const original = normalizeWords(originalText)
  const typed = normalizeWords(typedText)

  const m = original.length
  const n = typed.length

  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const curr = [i]
    for (let j = 1; j <= n; j++) {
      const cost = original[i - 1] === typed[j - 1] ? 0 : 1
      curr[j] = Math.min(
        prev[j] + 1, // missing word
        curr[j - 1] + 1, // extra word
        prev[j - 1] + cost, // wrong word / match
      )
    }
    prev = curr
  }

  const mistakes = prev[n]
  const accuracy = m ? Math.max(0, Math.round((1 - mistakes / m) * 100)) : 0

  return { accuracy, mistakes, totalWords: m }
}