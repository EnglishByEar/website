import type { DiffToken, ExerciseScore } from "@/types/exercise"

/** Lowercases, strips apostrophes and punctuation, and splits into words. */
export const normalizeWords = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[’‘']/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)

/**
 * Word-level alignment (Levenshtein with backtrace) between the original and typed text.
 * Returns the tokens in reading order so the UI can highlight each mistake.
 */
export function diffWords(originalText: string, typedText: string): DiffToken[] {
  const original = normalizeWords(originalText)
  const typed = normalizeWords(typedText)
  const m = original.length
  const n = typed.length

  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array<number>(n + 1).fill(0)
    row[0] = i
    return row
  })
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = original[i - 1] === typed[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // missing word
        dp[i][j - 1] + 1, // extra word
        dp[i - 1][j - 1] + cost, // match / wrong word
      )
    }
  }

  const tokens: DiffToken[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const same = original[i - 1] === typed[j - 1]
      if (dp[i][j] === dp[i - 1][j - 1] + (same ? 0 : 1)) {
        tokens.push(
          same
            ? { type: "correct", typed: typed[j - 1], expected: original[i - 1] }
            : { type: "wrong", typed: typed[j - 1], expected: original[i - 1] },
        )
        i--
        j--
        continue
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      tokens.push({ type: "missing", expected: original[i - 1] })
      i--
    } else {
      tokens.push({ type: "extra", typed: typed[j - 1] })
      j--
    }
  }

  return tokens.reverse()
}

export function calculateScore(originalText: string, typedText: string): ExerciseScore {
  const diff = diffWords(originalText, typedText)

  const mistakes = diff.filter((t) => t.type !== "correct").length
  const totalWords = diff.filter((t) => t.type !== "extra").length // words in the original
  const accuracy = totalWords ? Math.max(0, Math.round((1 - mistakes / totalWords) * 100)) : 0

  return { accuracy, mistakes, totalWords, diff }
}