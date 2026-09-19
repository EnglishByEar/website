'use client'

import { useState } from 'react'
import type { QuizQuestion as QuizQuestionType } from '@/types/vocabulary'
import { AnswerOption } from './answer-option'

interface QuizQuestionProps {
    question: QuizQuestionType
    onAnswer: (isCorrect: boolean) => void
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
    const [selected, setSelected] = useState<string | null>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    const handleSelect = (option: string) => {
        if (isRevealed) return
        setSelected(option)
        setIsRevealed(true)
        const isCorrect = option === question.correctAnswer
        window.setTimeout(() => {
            onAnswer(isCorrect)
        }, 900)
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {question.word.word}
            </span>
            <h2 className="mt-2 text-xl font-semibold text-foreground text-pretty">{question.prompt}</h2>
            <div className="mt-6 space-y-3">
                {question.options.map((option) => (
                    <AnswerOption
                        key={option}
                        label={option}
                        isSelected={selected === option}
                        isCorrectAnswer={option === question.correctAnswer}
                        isRevealed={isRevealed}
                        disabled={isRevealed}
                        onSelect={() => handleSelect(option)}
                    />
                ))}
            </div>
        </div>
    )
}
