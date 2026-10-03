import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FormulaCard } from '@/components/formula-card'
import { ExampleCard } from '@/components/example-card'
import { MistakeCard } from '@/components/mistake-card'
import { getCategoryBySlug } from '@/data/grammar/categories'
import { sentenceStructureLessons } from '@/data/grammar/sentence-structure'
import { getLessonBySlug, getLessonsByCategory } from '@/data/grammar/sentence-structure'

interface LessonPageProps {
    params: Promise<{ slug: string }>
}

export function generateStaticParams() {
    return sentenceStructureLessons.map((lesson) => ({ slug: lesson.id }))
}

export async function generateMetadata({ params }: LessonPageProps) {
    const { slug } = await params
    const lesson = getLessonBySlug(slug)

    if (!lesson) {
        return {
            title: 'Lesson Not Found',
            description: 'The requested grammar lesson could not be found.',
        }
    }

    return {
        title: `${lesson.title} - English By Ear`,
        description: lesson.description,
    }
}

export default async function SentenceLessonPage({ params }: LessonPageProps) {
    const { slug } = await params
    const lesson = getLessonBySlug(slug)
    const category = getCategoryBySlug('sentence-structure')
    if (!lesson || !category) notFound()

    const allLessons = getLessonsByCategory('sentence-structure')
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null


    return (
        <>
            <main className="min-h-screen bg-background">
                <article className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl">
                        <Link href="/dashboard/grammar/sentence-structure" className="mb-8 inline-flex items-center text-sm font-medium text-primary hover:opacity-80">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sentence Structure
                        </Link>

                        <div className="mb-8 flex items-center gap-2 text-sm text-foreground/60">
                            <Link href="/dashboard/grammar" className="hover:text-foreground transition-colors">
                                Grammar
                            </Link>
                            <span>/</span>
                            <Link
                                href={`/dashboard/grammar/${category.slug}`}
                                className="hover:text-foreground transition-colors"
                            >
                                {category.title}
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">{lesson.title}</span>
                        </div>

                        <header className="mb-10">
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
                        <div className="mt-16 border-t border-border pt-8">
                            <div className="grid grid-cols-2 gap-4">
                                {previousLesson ? (
                                    <Link href={`/dashboard/grammar/sentence-structure/${previousLesson.id}`}>
                                        <button className="w-full flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary hover:text-primary transition-colors">
                                            <ArrowLeft className="h-5 w-5" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-foreground/60 mb-1">Previous</div>
                                                <div className="font-semibold line-clamp-1">{previousLesson.title}</div>
                                            </div>
                                        </button>
                                    </Link>
                                ) : (
                                    <div />
                                )}

                                {nextLesson ? (
                                    <Link href={`/dashboard/grammar/sentence-structure/${nextLesson.id}`}>
                                        <button className="w-full flex items-center justify-end gap-2 rounded-lg border border-border bg-card p-4 text-right hover:border-primary hover:text-primary transition-colors">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-foreground/60 mb-1">Next</div>
                                                <div className="font-semibold line-clamp-1">{nextLesson.title}</div>
                                            </div>
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </>
    )
}
