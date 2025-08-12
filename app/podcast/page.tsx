import React from 'react'
import Head from "next/head";
import podcastJsonLd from "@/data/podcastData";
import { Headphones } from 'lucide-react';
import podcastData from '@/lib/podcast.json'
import Link from 'next/link';
import PodcastCard from '@/components/podcastCard';

export default function Podcast() {
  const episodes = podcastData.episodes;
  return (
    <>
      <Head>
        <title>{podcastJsonLd.name}</title>
        <meta name="description" content={podcastJsonLd.description} />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastJsonLd) }}
        />
      </Head>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EnglishByEar</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.1]">
              Improve Your Skills Every Week
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Every week for practical tips, engaging conversations, and cultural insights to help you speak English confidently.
            </p>
            
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            {episodes.map((episode) => (
              <PodcastCard key={episode.id} episode={episode} />
            ))}
          </div>
        </section>

        
      </main>
    </>
  )
}
