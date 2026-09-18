'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VocabularyWord } from '@/types/vocabulary'
import { Flashcard } from './flashcard'

interface FlashcardDeckProps {
    words: VocabularyWord[]
    round: number
    onComplete: () => void
}

export function FlashcardDeck({ words, round, onComplete }: FlashcardDeckProps) {
    const [index, setIndex] = useState(0)
    const isLast = index === words.length - 1
    const word = words[index]

    const goNext = () => {
        if (isLast) {
            onComplete()
        } else {
            setIndex((i) => i + 1)
        }
    }

    const goPrev = () => {
        setIndex((i) => Math.max(0, i - 1))
    }

    if (!word) return null

    return (
        <div className="mx-auto max-w-xl">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">{`Round ${round} \u00B7 Flashcards`}</span>
                <span className="text-sm font-medium text-foreground/60">
                    {index + 1} / {words.length}
                </span>
            </div>

            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${((index + 1) / words.length) * 100}%` }}
                />
            </div>

            <Flashcard key={word.id} word={word} />

            <div className="mt-6 flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                    {isLast ? 'Start Quiz' : 'Next'}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
