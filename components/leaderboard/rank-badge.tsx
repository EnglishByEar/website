import { Medal, Trophy } from "lucide-react"

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" aria-label="Rank 1" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" aria-label="Rank 2" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" aria-label="Rank 3" />
  return <span className="font-medium">{rank}</span>
}