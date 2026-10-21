import { LevelSelector } from '@/components/vocabulary/level-selector'
import { vocabularyLevels, getGroupsForLevel } from '@/data/vocabulary'

export const metadata = {
    title: 'Vocabulary - EnglishByEar',
    description: 'Build your English vocabulary with flashcards and quizzes across elementary, intermediate, and advanced levels.',
}

export default function VocabularyPage() {
    const groupCounts = Object.fromEntries(
        vocabularyLevels.map((l) => [l.level, getGroupsForLevel(l.level).length])
    )

    return (
        <>
            <main className="bg-background">
                <div className="px-2 py-4 sm:py-4">
                    <div className="mx-auto ">
                        <div className="mb-12">
                            <h1 className="text-3xl font-bold tracking-tight">Vocabulary</h1>
                            <p className="text-lg text-foreground/70">
                                Learn new words with flashcards, then test yourself with quizzes. Choose a level to
                                get started.
                            </p>
                        </div>

                        <LevelSelector levels={vocabularyLevels} groupCounts={groupCounts} />
                    </div>
                </div>
            </main>
        </>
    )
}
