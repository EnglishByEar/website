'use client'

import { useCallback, useEffect, useState } from 'react'
import type { GroupProgress, VocabularyLevel, VocabularyProgressState, WordProgress } from '@/types/vocabulary'
import { createInitialWordProgress } from '@/lib/vocabulary/vocabularyBrain'

const STORAGE_KEY = 'vocab-progress-v1'

function groupKey(level: VocabularyLevel, groupNumber: number) {
  return `${level}-${groupNumber}`
}

function readFromStorage(): VocabularyProgressState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as VocabularyProgressState
  } catch {
    return {}
  }
}

function writeToStorage(state: VocabularyProgressState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage write failures (e.g. quota exceeded or private mode).
  }
}

export function useVocabularyProgress() {
  const [state, setState] = useState<VocabularyProgressState>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setState(readFromStorage())
    setIsLoaded(true)
  }, [])

  const getGroupProgress = useCallback(
    (level: VocabularyLevel, groupNumber: number): GroupProgress | undefined => {
      return state[groupKey(level, groupNumber)]
    },
    [state]
  )

  const getWordProgress = useCallback(
    (level: VocabularyLevel, groupNumber: number, wordId: string): WordProgress => {
      const group = state[groupKey(level, groupNumber)]
      return group?.words[wordId] ?? createInitialWordProgress(wordId)
    },
    [state]
  )

  const updateWordProgress = useCallback(
    (level: VocabularyLevel, groupNumber: number, wordId: string, next: WordProgress) => {
      setState((prev) => {
        const key = groupKey(level, groupNumber)
        const existingGroup: GroupProgress =
          prev[key] ?? { level, groupNumber, words: {}, completed: false, lastPlayedAt: new Date().toISOString() }
        const updatedGroup: GroupProgress = {
          ...existingGroup,
          words: { ...existingGroup.words, [wordId]: next },
          lastPlayedAt: new Date().toISOString(),
        }
        const nextState = { ...prev, [key]: updatedGroup }
        writeToStorage(nextState)
        return nextState
      })
    },
    []
  )

  const markGroupCompleted = useCallback((level: VocabularyLevel, groupNumber: number) => {
    setState((prev) => {
      const key = groupKey(level, groupNumber)
      const existingGroup: GroupProgress =
        prev[key] ?? { level, groupNumber, words: {}, completed: false, lastPlayedAt: new Date().toISOString() }
      const updatedGroup: GroupProgress = { ...existingGroup, completed: true, lastPlayedAt: new Date().toISOString() }
      const nextState = { ...prev, [key]: updatedGroup }
      writeToStorage(nextState)
      return nextState
    })
  }, [])

  const resetGroupProgress = useCallback((level: VocabularyLevel, groupNumber: number) => {
    setState((prev) => {
      const key = groupKey(level, groupNumber)
      const nextState = { ...prev }
      delete nextState[key]
      writeToStorage(nextState)
      return nextState
    })
  }, [])

  return {
    isLoaded,
    getGroupProgress,
    getWordProgress,
    updateWordProgress,
    markGroupCompleted,
    resetGroupProgress,
  }
}
