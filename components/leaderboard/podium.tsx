import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { LeaderboardEntry } from "@/lib/leaderboard/config"
import { RankBadge } from "./rank-badge"
import { UserAvatar } from "./user-avatar"

interface Props {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export function Podium({ entries, currentUserId }: Props) {
  if (entries.length === 0) return null

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {entries.slice(0, 3).map((entry) => (
        <Card key={entry.id} className={entry.rank === 1 ? "border-yellow-500" : ""}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <UserAvatar username={entry.username} src={entry.avatar_url} className="h-20 w-20" />
                <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow">
                  <RankBadge rank={entry.rank} />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium">{entry.username}</h3>
              <p className="text-sm text-muted-foreground">Rank #{entry.rank}</p>
              {entry.id === currentUserId && (
                <Badge variant="outline" className="mt-1">
                  You
                </Badge>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Score" value={entry.score} />
                <Stat label="Exercises" value={entry.exercises} />
                <Stat label="Accuracy" value={`${entry.accuracy}%`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}