import type { QuizQuestion, QuizQuestionType, VocabularyWord, WordProgress } from '@/types/vocabulary'

export const MASTERY_STREAK = 3

export function createInitialWordProgress(wordId: string): WordProgress {
  return { wordId, streak: 0, mastered: false, attempts: 0, correct: 0 }
}

export function applyAnswer(progress: WordProgress, isCorrect: boolean): WordProgress {
  const attempts = progress.attempts + 1
  const correct = progress.correct + (isCorrect ? 1 : 0)
  const streak = isCorrect ? progress.streak + 1 : 0
  const mastered = streak >= MASTERY_STREAK
  return { ...progress, attempts, correct, streak, mastered }
}

export function getUnmasteredWords(
  words: VocabularyWord[],
  progressByWordId: Record<string, WordProgress>
): VocabularyWord[] {
  return words.filter((w) => !progressByWordId[w.id]?.mastered)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickDistractors(pool: VocabularyWord[], exclude: VocabularyWord, count: number, field: 'meaning' | 'word'): string[] {
  const candidates = shuffle(pool.filter((w) => w.id !== exclude.id)).map((w) => (field === 'meaning' ? w.meaning : w.word))
  return candidates.slice(0, count)
}

export function buildQuizQuestions(roundWords: VocabularyWord[], allWords: VocabularyWord[]): QuizQuestion[] {
  const types: QuizQuestionType[] = ['meaning', 'synonym', 'word-from-meaning']

  return shuffle(roundWords).map((word, idx) => {
    const type = types[idx % types.length]

    if (type === 'synonym' && word.synonyms.length > 0) {
      const correctAnswer = word.synonyms[Math.floor(Math.random() * word.synonyms.length)]
      const otherSynonyms = allWords
        .filter((w) => w.id !== word.id)
        .flatMap((w) => w.synonyms)
        .filter((s) => s.toLowerCase() !== correctAnswer.toLowerCase())
      const distractors = shuffle(Array.from(new Set(otherSynonyms))).slice(0, 3)
      const options = shuffle([correctAnswer, ...distractors])
      return {
        id: `${word.id}-${type}`,
        type,
        word,
        prompt: `Which word is a synonym of "${word.word}"?`,
        options,
        correctAnswer,
      }
    }

    if (type === 'word-from-meaning') {
      const distractors = pickDistractors(allWords, word, 3, 'word')
      const options = shuffle([word.word, ...distractors])
      return {
        id: `${word.id}-${type}`,
        type,
        word,
        prompt: `Which word means: "${word.meaning}"?`,
        options,
        correctAnswer: word.word,
      }
    }

    const distractors = pickDistractors(allWords, word, 3, 'meaning')
    const options = shuffle([word.meaning, ...distractors])
    return {
      id: `${word.id}-meaning`,
      type: 'meaning',
      word,
      prompt: `What does "${word.word}" mean?`,
      options,
      correctAnswer: word.meaning,
    }
  })
}
