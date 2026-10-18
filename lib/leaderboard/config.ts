export type LeaderboardPeriod = "weekly" | "monthly" | "allTime"

export interface LeaderboardEntry {
  id: string
  username: string
  avatar_url: string | null
  score: number
  exercises: number
  accuracy: number
  rank: number
}

export const LEADERBOARD_PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "allTime", label: "All time" },
]

export const DEFAULT_LEADERBOARD_LIMIT = 10

// UI copy only. The real calculation lives in SQL (public.leaderboard_score).
export const BASE_POINTS_PER_EXERCISE = 10
export const ACCURACY_BONUS_TIERS = [
  { minAccuracy: 95, bonus: 20 },
  { minAccuracy: 85, bonus: 15 },
  { minAccuracy: 70, bonus: 10 },
  { minAccuracy: 50, bonus: 5 },
] as const