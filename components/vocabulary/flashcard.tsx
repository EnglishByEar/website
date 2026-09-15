'use client'

import { useState } from 'react'
import { Volume2, RotateCw } from 'lucide-react'
import type { VocabularyWord } from '@/types/vocabulary'

interface FlashcardProps {
    word: VocabularyWord
}

export function Flashcard({ word }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    const speak = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (typeof window === 'undefined' || !window.speechSynthesis) return
        const utterance = new SpeechSynthesisUtterance(word.word)
        utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
    }

    return (
        <button
            type="button"
            onClick={() => setIsFlipped((f) => !f)}
            className="w-full min-h-[320px] rounded-xl border border-border bg-card p-8 text-left transition-all hover:border-primary hover:shadow-md"
            aria-pressed={isFlipped}
        >
            {!isFlipped ? (
                <div className="flex h-full min-h-[264px] flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {word.partOfSpeech}
                    </span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
                        {word.word}
                    </h2>
                    <div className="mt-3 flex items-center gap-2 text-foreground/60">
                        <span
                            className="text-sm"
                            style={{ fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", Arial, sans-serif' }}
                        >
                            {word.pronunciation}
                        </span>
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={speak}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') speak(e as unknown as React.MouseEvent)
                            }}
                            aria-label={`Listen to pronunciation of ${word.word}`}
                            className="rounded-full p-1.5 hover:bg-secondary transition-colors"
                        >
                            <Volume2 className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-6 text-sm text-foreground/50 inline-flex items-center gap-1.5">
                        <RotateCw className="h-3.5 w-3.5" />
                        Tap to reveal meaning
                    </p>
                </div>
            ) : (
                <div className="flex h-full min-h-[264px] flex-col justify-center gap-4">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Meaning
                        </h3>
                        <p className="mt-1 text-lg text-foreground text-pretty">{word.meaning}</p>
                    </div>
                    <div className="border-t border-border pt-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Synonyms
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {word.synonyms.map((syn) => (
                                <span
                                    key={syn}
                                    className="rounded bg-secondary/50 px-2 py-1 text-sm text-secondary-foreground"
                                >
                                    {syn}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-border pt-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Example
                        </h3>
                        <p className="mt-1 text-sm text-foreground/70 italic text-pretty">
                            &ldquo;{word.example}&rdquo;
                        </p>
                    </div>
                </div>
            )}
        </button>
    )
}
