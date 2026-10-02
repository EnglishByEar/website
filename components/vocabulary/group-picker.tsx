'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, BookOpen } from 'lucide-react'
import type { VocabularyGroup, VocabularyLevel } from '@/types/vocabulary'
import { useVocabularyProgress } from '@/hooks/use-vocab-progress'

interface GroupPickerProps {
    level: VocabularyLevel
    groups: VocabularyGroup[]
}

export function GroupPicker({ level, groups }: GroupPickerProps) {
    const { isLoaded, getGroupProgress } = useVocabularyProgress()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => {
                const progress = isLoaded ? getGroupProgress(level, group.groupNumber) : undefined
                const masteredCount = progress
                    ? Object.values(progress.words).filter((w) => w.mastered).length
                    : 0
                const isCompleted = progress?.completed ?? false

                return (
                    <Link key={group.groupNumber} href={`${level}/${group.groupNumber}`}>
                        <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                    <BookOpen className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    Group {group.groupNumber}
                                </h3>
                                <p className="mt-1 text-sm text-foreground/60">
                                    {group.words.length} words
                                    {isLoaded && masteredCount > 0
                                        ? ` \u00B7 ${masteredCount}/${group.words.length} learned`
                                        : ''}
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 flex-shrink-0 text-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
