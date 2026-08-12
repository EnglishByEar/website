import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
// import { Navbar } from '@/components/navbar'
import { FormulaCard } from '@/components/formula-card'
import { ExampleCard } from '@/components/example-card'
import { MistakeCard } from '@/components/mistake-card'
import { getCategoryBySlug } from '@/data/grammar/categories'
import { getSentenceLessonBySlug, sentenceStructureLessons } from '@/data/grammar/sentence-structure'

interface LessonPageProps {
    params: Promise<{ slug: string }>
}

export function generateStaticParams() {
    return sentenceStructureLessons.map((lesson) => ({ slug: lesson.id }))
}

export async function generateMetadata({ params }: LessonPageProps) {
    const { slug } = await params
    const lesson = getSentenceLessonBySlug(slug)
    return lesson
        ? { title: `${lesson.title} - Grammar Hub`, description: lesson.description }
        : { title: 'Lesson Not Found' }
}

export default async function SentenceLessonPage({ params }: LessonPageProps) {
    const { slug } = await params
    const lesson = getSentenceLessonBySlug(slug)
    const category = getCategoryBySlug('sentence-structure')
    if (!lesson || !category) notFound()

    return (
        <>
            {/* <Navbar /> */}
            <main className="min-h-screen bg-background">
                <article className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl">
                        <Link href="/grammar/sentence-structure" className="mb-8 inline-flex items-center text-sm font-medium text-primary hover:opacity-80">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sentence Structure
                        </Link>
                        <header className="mb-10">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Sentence Structure</p>
                            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">{lesson.title}</h1>
                            <p className="mt-4 text-lg leading-7 text-foreground/70">{lesson.description}</p>
                        </header>

                        <div className="space-y-8">
                            <section>
                                <h2 className="mb-4 text-2xl font-bold text-foreground">Formula</h2>
                                <FormulaCard formula={lesson.formula} />
                            </section>
                            <section>
                                <h2 className="mb-4 text-2xl font-bold text-foreground">How it works</h2>
                                <p className="rounded-lg border border-border bg-card p-6 text-base leading-7 text-foreground/80">{lesson.explanation}</p>
                            </section>
                            <section>
                                <ExampleCard examples={lesson.examples} />
                            </section>
                            <section>
                                <MistakeCard mistakes={lesson.commonMistakes} />
                            </section>
                        </div>
                    </div>
                </article>
            </main>
        </>
    )
}
