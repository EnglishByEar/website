import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
// import { Navbar } from '@/components/navbar'
import { VocabularySession } from '@/components/vocabulary/vocabulary-session'
import { getGroup, getGroupsForLevel, getLevelInfo, isValidLevel, vocabularyLevels } from '@/data/vocabulary'

interface VocabularyGroupPageProps {
    params: Promise<{ level: string; group: string }>
}

export function generateStaticParams() {
    return vocabularyLevels.flatMap((l) =>
        getGroupsForLevel(l.level).map((g) => ({ level: l.level, group: String(g.groupNumber) }))
    )
}

export async function generateMetadata({ params }: VocabularyGroupPageProps) {
    const { level, group } = await params
    if (!isValidLevel(level)) return {}
    const info = getLevelInfo(level)
    return {
        title: `${info?.title ?? 'Vocabulary'} - Group ${group} - EnglishByEar`,
    }
}

export default async function VocabularyGroupPage({ params }: VocabularyGroupPageProps) {
    const { level, group: groupParam } = await params
    const groupNumber = Number(groupParam)

    if (!isValidLevel(level) || !Number.isInteger(groupNumber) || groupNumber < 1) {
        notFound()
    }

    const group = getGroup(level, groupNumber)
    const info = getLevelInfo(level)

    if (!group || !info) {
        notFound()
    }

    const allGroups = getGroupsForLevel(level)
    const hasNextGroup = allGroups.some((g) => g.groupNumber === groupNumber + 1)

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="px-4 py-8 sm:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link
                            href={`/dashboard/vocabulary/${level}`}
                            className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to {info.title} groups
                        </Link>

                        <div className="mt-4 mb-2 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {info.title} &middot; Group {group.groupNumber}
                            </h1>
                        </div>

                        <VocabularySession group={group} hasNextGroup={hasNextGroup} />
                    </div>
                </div>
            </main>
        </>
    )
}
