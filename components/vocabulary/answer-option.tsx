'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerOptionProps {
    label: string
    isSelected: boolean
    isCorrectAnswer: boolean
    isRevealed: boolean
    disabled: boolean
    onSelect: () => void
}

export function AnswerOption({
    label,
    isSelected,
    isCorrectAnswer,
    isRevealed,
    disabled,
    onSelect,
}: AnswerOptionProps) {
    const showCorrect = isRevealed && isCorrectAnswer
    const showIncorrect = isRevealed && isSelected && !isCorrectAnswer

    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn(
                'flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all',
                'border-border bg-card text-foreground hover:border-primary/50',
                isSelected && !isRevealed && 'border-primary bg-primary/5',
                showCorrect && 'border-primary bg-primary/10 text-foreground',
                showIncorrect && 'border-destructive bg-destructive/10 text-foreground',
                disabled && !isSelected && !showCorrect && 'opacity-60'
            )}
        >
            <span className="text-pretty">{label}</span>
            {showCorrect && <Check className="h-4 w-4 flex-shrink-0 text-primary" />}
            {showIncorrect && <X className="h-4 w-4 flex-shrink-0 text-destructive" />}
        </button>
    )
}
