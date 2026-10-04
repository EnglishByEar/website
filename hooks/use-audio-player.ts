"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface Options {
  onPlayError?: () => void
}

export function useAudioPlayer(src?: string | null, { onPlayError }: Options = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [available, setAvailable] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [muted, setMuted] = useState(false)

  // Create the audio element for the current source.
  useEffect(() => {
    setAvailable(false)
    setIsPlaying(false)
    setProgress(0)
    if (!src) return

    const audio = new Audio(src)

    const onCanPlay = () => {
      audioRef.current = audio
      setAvailable(true)
    }
    const onError = () => {
      console.error("Failed to load audio:", src)
      setAvailable(false)
    }
    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener("canplaythrough", onCanPlay)
    audio.addEventListener("error", onError)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay)
      audio.removeEventListener("error", onError)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.pause()
      audio.removeAttribute("src")
      audio.load()
      audioRef.current = null
    }
  }, [src])

  // Keep the element in sync with settings (also re-applied once audio becomes available).
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume, available])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate
  }, [playbackRate, available])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted, available])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => onPlayError?.())
    } else {
      audio.pause()
    }
  }, [onPlayError])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  const reset = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setIsPlaying(false)
    setProgress(0)
  }, [])

  return {
    available,
    isPlaying,
    progress,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    muted,
    toggle,
    toggleMute,
    reset,
  }
}

export type AudioPlayerState = ReturnType<typeof useAudioPlayer>