"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeaderboard } from "@/hooks/use-leaderboard"
import {
  DEFAULT_LEADERBOARD_LIMIT,
  LEADERBOARD_PERIODS,
  type LeaderboardPeriod,
} from "@/lib/leaderboard/config"
import { LeaderboardTable } from "./leaderboard-table"
import { Podium } from "./podium"

interface Props {
  title?: string
  description?: string
  limit?: number
  periods?: LeaderboardPeriod[]
  defaultPeriod?: LeaderboardPeriod
  showPodium?: boolean
}

export function Leaderboard({
  title = `Top ${DEFAULT_LEADERBOARD_LIMIT} performers`,
  description = "Ranked by score (exercises completed + accuracy bonus)",
  limit = DEFAULT_LEADERBOARD_LIMIT,
  periods = LEADERBOARD_PERIODS.map((p) => p.value),
  defaultPeriod = "allTime",
  showPodium = true,
}: Props) {
  const availablePeriods = LEADERBOARD_PERIODS.filter((p) => periods.includes(p.value))
  const [period, setPeriod] = useState<LeaderboardPeriod>(
    periods.includes(defaultPeriod) ? defaultPeriod : availablePeriods[0].value,
  )
  const { entries, me, loading, error, currentUserId, refresh } = useLeaderboard({ period, limit })

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
            {me && <span className="mt-2 block text-sm">Your rank: #{me.rank}</span>}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {availablePeriods.length > 1 && (
          <Tabs value={period} onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}>
            <TabsList className="flex w-full">
              {availablePeriods.map((p) => (
                <TabsTrigger key={p.value} value={p.value} className="flex-1">
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {error ? (
          <p className="py-8 text-center text-sm text-destructive">Couldn’t load the leaderboard: {error}</p>
        ) : loading && entries.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">Loading leaderboard…</p>
        ) : (
          <>
            {showPodium && <Podium entries={entries} currentUserId={currentUserId} />}
            <LeaderboardTable
              entries={showPodium ? entries.slice(3) : entries}
              currentUserId={currentUserId}
              me={me}
              emptyMessage={
                entries.length === 0
                  ? "No one has completed exercises in this period yet."
                  : "Everyone on this leaderboard is on the podium."
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}