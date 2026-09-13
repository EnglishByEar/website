import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/reveal'
import { LevelSelector } from '@/components/vocabulary/level-selector'
import { vocabularyLevels, getGroupsForLevel } from '@/data/vocabulary'

export default function VocabularySection() {
    const groupCounts = Object.fromEntries(
        vocabularyLevels.map((l) => [l.level, getGroupsForLevel(l.level).length])
    )

    return (
        <section id="featured" className="container border-t border-border py-20 md:py-28">
            <Reveal className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div className="max-w-lg">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Vocabulary</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                        Learn new words with flashcards, then test yourself with quizzes. Choose a level to
                        get started.
                    </p>
                </div>
                <Link
                    href="dashboard/vocabulary"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                >
                    View all
                    <ArrowRight className="arrow-nudge h-4 w-4" />
                </Link>
            </Reveal>

            <LevelSelector levels={vocabularyLevels} groupCounts={groupCounts} />

        </section>
    )
}
