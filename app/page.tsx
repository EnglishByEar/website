import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Headphones, BarChart2, Trophy, Clock } from "lucide-react"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EnglishByEar</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Master English Listening Skills with EnglishByEar
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Practice listening to English texts at your own pace and track your progress over time.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50 rounded-lg">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Listen & Type</h3>
              <p className="text-muted-foreground">
                Listen to English texts and type what you hear to improve your comprehension
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BarChart2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement with detailed statistics and performance metrics
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Compete & Achieve</h3>
              <p className="text-muted-foreground">
                Join leaderboards and complete daily challenges to earn achievements
              </p>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Three Difficulty Levels</h2>
              <p className="text-muted-foreground">
                Choose from Simple, Medium, or Advanced exercises to match your current skill level and gradually
                increase the challenge as you improve.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Simple: Short sentences and common vocabulary</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Medium: Longer paragraphs with more complex structures</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Advanced: Native-speed content with specialized vocabulary</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full max-w-[400px] overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background/50" />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Daily Challenge</span>
                  </div>
                  <div className="flex-1 rounded-lg bg-muted/50 p-4">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-full rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-5/6 rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-2/3 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="h-4 w-full rounded bg-muted-foreground/20 mb-2" />
                    <div className="h-4 w-5/6 rounded bg-muted-foreground/20" />
                  </div>
                  <Button className="w-full">Start Exercise</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
