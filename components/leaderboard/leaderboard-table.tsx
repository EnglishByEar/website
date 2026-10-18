import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LeaderboardEntry } from "@/lib/leaderboard/config"
import { RankBadge } from "./rank-badge"
import { UserAvatar } from "./user-avatar"

interface Props {
  entries: LeaderboardEntry[]
  currentUserId?: string
  /** Signed-in user's entry; shown as an extra row when they are outside the list. */
  me?: LeaderboardEntry | null
  emptyMessage?: string
}

export function LeaderboardTable({
  entries,
  currentUserId,
  me,
  emptyMessage = "No one has completed exercises in this period yet.",
}: Props) {
  const showMeSeparately = !!me && !entries.some((e) => e.id === me.id) && me.rank > 3

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-2 border-b px-4 py-3 text-sm font-medium">
        <div className="col-span-2 text-center sm:col-span-1">Rank</div>
        <div className="col-span-6 sm:col-span-5">User</div>
        <div className="col-span-4 text-right sm:col-span-2">Score</div>
        <div className="hidden text-right sm:col-span-2 sm:block">Exercises</div>
        <div className="hidden text-right sm:col-span-2 sm:block">Accuracy</div>
      </div>

      {entries.length === 0 ? (
        <div className="px-4 py-8 text-center text-muted-foreground">{emptyMessage}</div>
      ) : (
        entries.map((entry) => <Row key={entry.id} entry={entry} isMe={entry.id === currentUserId} />)
      )}

      {showMeSeparately && me && (
        <>
          <div className="border-t px-4 py-1 text-center text-xs text-muted-foreground">•••</div>
          <Row entry={me} isMe />
        </>
      )}
    </div>
  )
}

function Row({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center gap-2 border-b px-4 py-3 last:border-0 hover:bg-muted/50",
        isMe && "bg-primary/5",
      )}
    >
      <div className="col-span-2 flex justify-center sm:col-span-1">
        <RankBadge rank={entry.rank} />
      </div>
      <div className="col-span-6 flex items-center gap-2 sm:col-span-5">
        <UserAvatar username={entry.username} src={entry.avatar_url} />
        <span className="truncate">{entry.username}</span>
        {isMe && (
          <Badge variant="outline" className="text-xs">
            You
          </Badge>
        )}
      </div>
      <div className="col-span-4 text-right font-medium sm:col-span-2">{entry.score}</div>
      <div className="hidden text-right sm:col-span-2 sm:block">{entry.exercises}</div>
      <div className="hidden text-right sm:col-span-2 sm:block">{entry.accuracy}%</div>
    </div>
  )
}