import { CheckCircle2, RotateCw, Sparkles } from 'lucide-react'
import type { RoundResultSummary } from '@/types/vocabulary'

interface RoundResultProps {
    summary: RoundResultSummary
    onContinue: () => void
}

export function RoundResult({ summary, onContinue }: RoundResultProps) {
    const hasRemaining = summary.stillLearning.length > 0

    return (
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Round {summary.round} Complete</h2>
            <p className="mt-2 text-foreground/60">
                You answered {summary.correctCount} of {summary.totalWords} correctly.
            </p>

            {summary.masteredThisRound.length > 0 && (
                <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        Newly Learned
                    </div>
                    <p className="mt-1 text-sm text-foreground/70">
                        {summary.masteredThisRound.join(', ')}
                    </p>
                </div>
            )}

            {hasRemaining && (
                <div className="mt-4 rounded-lg bg-secondary/30 border border-border p-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                        <RotateCw className="h-4 w-4" />
                        Still Practicing
                    </div>
                    <p className="mt-1 text-sm text-foreground/60">{summary.stillLearning.join(', ')}</p>
                </div>
            )}

            <button
                type="button"
                onClick={onContinue}
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
                {hasRemaining ? `Continue to Round ${summary.round + 1}` : 'Finish Group'}
            </button>
        </div>
    )
}
