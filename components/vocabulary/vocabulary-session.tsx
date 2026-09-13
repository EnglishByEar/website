'use client'

import { useEffect, useMemo, useState } from 'react'
import type { QuizQuestion as QuizQuestionType, RoundResultSummary, SessionPhase, VocabularyGroup } from '@/types/vocabulary'
import { applyAnswer, buildQuizQuestions, getUnmasteredWords } from '@/lib/vocabulary/vocabularyBrain'
import { useVocabularyProgress } from '@/hooks/use-vocab-progress'
import { FlashcardDeck } from './flashcard-deck'
import { QuizProgress } from './quiz-progress'
import { QuizQuestion } from './quiz-question'
import { RoundResult } from './round-result'
import { GroupComplete } from './group-complete'

interface VocabularySessionProps {
    group: VocabularyGroup
    hasNextGroup: boolean
}

export function VocabularySession({ group, hasNextGroup }: VocabularySessionProps) {
    const { level, groupNumber, words } = group
    const { isLoaded, getWordProgress, updateWordProgress, markGroupCompleted } = useVocabularyProgress()

    const [phase, setPhase] = useState<SessionPhase>('flashcards')
    const [round, setRound] = useState(1)
    const [roundWords, setRoundWords] = useState(words)
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestionType[]>([])
    const [questionIndex, setQuestionIndex] = useState(0)
    const [correctCount, setCorrectCount] = useState(0)
    const [masteredThisRound, setMasteredThisRound] = useState<string[]>([])
    const [roundSummary, setRoundSummary] = useState<RoundResultSummary | null>(null)

    // Reset session state whenever a new group is loaded, resuming from any
    // previously saved progress so already-mastered words aren't re-queued.
    useEffect(() => {
        if (!isLoaded) return
        const progressByWordId = Object.fromEntries(words.map((w) => [w.id, getWordProgress(level, groupNumber, w.id)]))
        const unmastered = getUnmasteredWords(words, progressByWordId)
        setRound(1)
        setQuestionIndex(0)
        setCorrectCount(0)
        setMasteredThisRound([])
        setRoundSummary(null)
        if (unmastered.length === 0) {
            markGroupCompleted(level, groupNumber)
            setPhase('group-complete')
            setRoundWords(words)
        } else {
            setPhase('flashcards')
            setRoundWords(unmastered)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.level, group.groupNumber, words, isLoaded])

    const startQuiz = () => {
        setQuizQuestions(buildQuizQuestions(roundWords, words))
        setQuestionIndex(0)
        setCorrectCount(0)
        setMasteredThisRound([])
        setPhase('quiz')
    }

    const handleAnswer = (isCorrect: boolean) => {
        const question = quizQuestions[questionIndex]
        if (!isLoaded || !question) return

        const prevProgress = getWordProgress(level, groupNumber, question.word.id)
        const nextProgress = applyAnswer(prevProgress, isCorrect)
        updateWordProgress(level, groupNumber, question.word.id, nextProgress)

        if (isCorrect) setCorrectCount((c) => c + 1)
        if (nextProgress.mastered && !prevProgress.mastered) {
            setMasteredThisRound((m) => [...m, question.word.word])
        }

        const isLastQuestion = questionIndex === quizQuestions.length - 1
        if (isLastQuestion) {
            const stillLearning = roundWords.filter((w) => {
                const wasJustAnswered = w.id === question.word.id
                const finalProgress = wasJustAnswered ? nextProgress : getWordProgress(level, groupNumber, w.id)
                return !finalProgress.mastered
            })
            setRoundSummary({
                round,
                totalWords: roundWords.length,
                correctCount: correctCount + (isCorrect ? 1 : 0),
                masteredThisRound: isCorrect && nextProgress.mastered && !prevProgress.mastered
                    ? [...masteredThisRound, question.word.word]
                    : masteredThisRound,
                stillLearning: stillLearning.map((w) => w.word),
            })
            setPhase('round-result')
        } else {
            setQuestionIndex((i) => i + 1)
        }
    }

    const handleContinueFromRound = () => {
        if (!roundSummary) return
        if (roundSummary.stillLearning.length === 0) {
            markGroupCompleted(level, groupNumber)
            setPhase('group-complete')
            return
        }
        const nextRoundWords = roundWords.filter((w) => roundSummary.stillLearning.includes(w.word))
        setRoundWords(nextRoundWords)
        setRound((r) => r + 1)
        setPhase('flashcards')
    }

    const currentQuestion = quizQuestions[questionIndex]

    const totalRoundsCompleted = phase === 'group-complete' ? round : round - 1

    const content = useMemo(() => {
        switch (phase) {
            case 'flashcards':
                return <FlashcardDeck words={roundWords} round={round} onComplete={startQuiz} />
            case 'quiz':
                if (!currentQuestion) return null
                return (
                    <div className="mx-auto max-w-xl">
                        <QuizProgress round={round} current={questionIndex + 1} total={quizQuestions.length} />
                        <QuizQuestion key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} />
                    </div>
                )
            case 'round-result':
                return roundSummary ? <RoundResult summary={roundSummary} onContinue={handleContinueFromRound} /> : null
            case 'group-complete':
                return (
                    <GroupComplete
                        level={level}
                        groupNumber={groupNumber}
                        totalWords={words.length}
                        totalRounds={Math.max(totalRoundsCompleted, 1)}
                        hasNextGroup={hasNextGroup}
                    />
                )
            default:
                return null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, roundWords, round, currentQuestion, questionIndex, quizQuestions.length, roundSummary])

    if (!isLoaded) {
        return <div className="text-center text-foreground/60 py-16">Loading your progress...</div>
    }

    return <div className="py-4">{content}</div>
}
