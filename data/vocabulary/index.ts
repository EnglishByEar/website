import type { VocabularyGroup, VocabularyLevel, VocabularyLevelInfo, VocabularyWord } from '@/types/vocabulary'
import { elementaryWords } from './elementary'
import { intermediateWords } from './intermediate'
import { advancedWords } from './advanced'

export const WORDS_PER_GROUP = 10

export const vocabularyLevels: VocabularyLevelInfo[] = [
  {
    level: 'elementary',
    title: 'Elementary',
    description: 'Everyday words to build a strong foundation for beginners.',
    color: 'chart-3',
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    description: 'Common words used in daily conversation and writing.',
    color: 'chart-2',
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: 'Sophisticated vocabulary for fluent, precise communication.',
    color: 'chart-1',
  },
]

const wordsByLevel: Record<VocabularyLevel, VocabularyWord[]> = {
  elementary: elementaryWords,
  intermediate: intermediateWords,
  advanced: advancedWords,
}

export function getLevelInfo(level: string): VocabularyLevelInfo | undefined {
  return vocabularyLevels.find((l) => l.level === level)
}

export function getWordsForLevel(level: VocabularyLevel): VocabularyWord[] {
  return wordsByLevel[level] ?? []
}

export function getGroupsForLevel(level: VocabularyLevel): VocabularyGroup[] {
  const words = getWordsForLevel(level)
  const groups: VocabularyGroup[] = []

  for (let i = 0; i < words.length; i += WORDS_PER_GROUP) {
    const groupWords = words.slice(i, i + WORDS_PER_GROUP)
    if (groupWords.length === 0) continue
    groups.push({
      level,
      groupIndex: i / WORDS_PER_GROUP,
      groupNumber: i / WORDS_PER_GROUP + 1,
      words: groupWords,
    })
  }

  return groups
}

export function getGroup(level: VocabularyLevel, groupNumber: number): VocabularyGroup | undefined {
  const groups = getGroupsForLevel(level)
  return groups.find((g) => g.groupNumber === groupNumber)
}

export function isValidLevel(level: string): level is VocabularyLevel {
  return level === 'elementary' || level === 'intermediate' || level === 'advanced'
}
