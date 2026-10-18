"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import {
  DEFAULT_LEADERBOARD_LIMIT,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "@/lib/leaderboard/config"

interface Options {
  period: LeaderboardPeriod
  limit?: number
}

interface State {
  entries: LeaderboardEntry[]
  me: LeaderboardEntry | null
  loading: boolean
  error: string | null
}

export function useLeaderboard({ period, limit = DEFAULT_LEADERBOARD_LIMIT }: Options) {
  const { supabase, user } = useSupabase()
  const userId = user?.id
  const [state, setState] = useState<State>({ entries: [], me: null, loading: true, error: null })
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    if (!supabase) return
    const id = ++requestId.current // ignore stale responses when the period changes quickly
    setState((s) => ({ ...s, loading: true, error: null }))

    const [top, mine] = await Promise.all([
      supabase.rpc("get_leaderboard", { p_period: period, p_limit: limit }),
      userId
        ? supabase.rpc("get_my_leaderboard_entry", { p_period: period }).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ])

    if (id !== requestId.current) return

    if (top.error) {
      setState({ entries: [], me: null, loading: false, error: top.error.message })
      return
    }

    setState({
      entries: (top.data ?? []) as LeaderboardEntry[],
      me: (mine.data ?? null) as LeaderboardEntry | null,
      loading: false,
      error: null,
    })
  }, [supabase, userId, period, limit])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { ...state, currentUserId: userId, refresh }
}