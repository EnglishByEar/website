import { AlertCircle, CheckCircle } from 'lucide-react'
import type { CommonMistake } from '@/types/grammar'

interface MistakeCardProps {
    mistakes: CommonMistake[]
}

export function MistakeCard({ mistakes }: MistakeCardProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Common Mistakes</h3>
            <div className="space-y-4">
                {mistakes.map((mistake, index) => (
                    <div key={index} className="space-y-3 rounded-lg border border-border bg-card p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
                            <div>
                                <p className="font-medium text-destructive">Incorrect:</p>
                                <p className="mt-1 font-mono text-sm text-foreground line-through opacity-75">
                                    {mistake.incorrect}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 border-t border-border pt-3">
                            <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                            <div className="flex-1">
                                <p className="font-medium text-accent">Correct:</p>
                                <p className="mt-1 font-mono text-sm text-foreground">{mistake.correct}</p>
                                <p className="mt-2 text-xs text-foreground/70">{mistake.explanation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
