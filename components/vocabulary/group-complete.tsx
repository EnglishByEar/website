import Link from 'next/link'
import { Trophy } from 'lucide-react'
import type { VocabularyLevel } from '@/types/vocabulary'

interface GroupCompleteProps {
    level: VocabularyLevel
    groupNumber: number
    totalWords: number
    totalRounds: number
    hasNextGroup: boolean
}

export function GroupComplete({ level, groupNumber, totalWords, totalRounds, hasNextGroup }: GroupCompleteProps) {
    return (
        <div className="mx-auto max-w-xl rounded-xl border border-primary/20 bg-primary/5 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <Trophy className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">Group {groupNumber} Mastered!</h2>
            <p className="mt-2 text-foreground/70">
                You learned all {totalWords} words in {totalRounds} round{totalRounds === 1 ? '' : 's'}.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    href={`/${level}/${groupNumber}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                    Practice Again
                </Link>
                {hasNextGroup ? (
                    <Link
                        href={`/dashboard/vocabulary/${level}/${groupNumber + 1}`}
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        Next Group
                    </Link>
                ) : (
                    <Link
                        href={`/dashboard/vocabulary/${level}`}
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        Back to Groups
                    </Link>
                )}
            </div>
        </div>
    )
}
