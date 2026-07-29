import { Check } from 'lucide-react'
import type { Example } from '@/types/grammar'

interface ExampleCardProps {
    examples: Example[]
}

export function ExampleCard({ examples }: ExampleCardProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Examples</h3>
            <div className="space-y-3">
                {examples.map((example, index) => (
                    <div
                        key={index}
                        className="flex gap-3 rounded-lg border border-border bg-card p-4 hover:border-accent transition-colors"
                    >
                        <Check className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                        <div className="flex-1">
                            <p className="text-foreground font-medium">{example.sentence}</p>
                            {example.translation && (
                                <p className="mt-1 text-sm text-foreground/60 italic">{example.translation}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
