import { Leaderboard } from "@/components/leaderboard/leaderboard"
import { ScoringInfo } from "@/components/leaderboard/scoring-info"

export default function LeaderboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other users</p>
      </div>
      <Leaderboard limit={10} />
      <ScoringInfo />
    </div>
  )
}