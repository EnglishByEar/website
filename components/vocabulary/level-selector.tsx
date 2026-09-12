import Link from 'next/link'
import { ArrowRight, Layers } from 'lucide-react'
import type { VocabularyLevelInfo } from '@/types/vocabulary'

interface LevelSelectorProps {
    levels: VocabularyLevelInfo[]
    groupCounts: Record<string, number>
}

export function LevelSelector({ levels, groupCounts }: LevelSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {levels.map((level) => (
                <Link key={level.level} href={`/dashboard/vocabulary/${level.level}`}>
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary">
                        <div
                            className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `var(--${level.color})`, opacity: 0.8 }}
                        >
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {level.title}
                        </h3>
                        <p className="mt-2 text-sm text-foreground/60 flex-1">{level.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-foreground/50">
                                {groupCounts[level.level] ?? 0} groups
                            </span>
                            <ArrowRight className="h-4 w-4 text-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
