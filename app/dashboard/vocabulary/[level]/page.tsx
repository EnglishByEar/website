import { notFound } from 'next/navigation'
// import { Navbar } from '@/components/navbar'
import { GroupPicker } from '@/components/vocabulary/group-picker'
import { getGroupsForLevel, getLevelInfo, isValidLevel, vocabularyLevels } from '@/data/vocabulary'

interface VocabularyLevelPageProps {
    params: Promise<{ level: string }>
}

export function generateStaticParams() {
    return vocabularyLevels.map((l) => ({ level: l.level }))
}

export async function generateMetadata({ params }: VocabularyLevelPageProps) {
    const { level } = await params
    const info = getLevelInfo(level)
    if (!info) return {}
    return {
        title: `${info.title} Vocabulary - EnglishByEar`,
        description: info.description,
    }
}

export default async function VocabularyLevelPage({ params }: VocabularyLevelPageProps) {
    const { level } = await params

    if (!isValidLevel(level)) {
        notFound()
    }

    const info = getLevelInfo(level)
    const groups = getGroupsForLevel(level)

    if (!info || groups.length === 0) {
        notFound()
    }

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-foreground mb-4">{info.title} Vocabulary</h1>
                            <p className="text-lg text-foreground/70 mb-6">{info.description}</p>
                            <div className="inline-flex items-center rounded-full bg-secondary/50 px-4 py-2">
                                <span className="text-sm font-medium text-secondary-foreground">
                                    {groups.length} groups
                                </span>
                            </div>
                        </div>

                        <GroupPicker level={level} groups={groups} />
                    </div>
                </div>

            </main>
        </>
    )
}
