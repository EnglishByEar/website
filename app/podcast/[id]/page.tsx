import React from 'react'
import { getPodcast, getAllPodcastIds } from "@/lib/podcast"
import { notFound } from 'next/navigation';
import Image from "next/image"
import defualtCover from "@/public/placeholder.svg"


export async function generateStaticParams() {
    const podcastIds = await getAllPodcastIds();
    return podcastIds.map((id: string) => ({id}));
}

export async function generateMetadata(props: any) {
  const { id } = await Promise.resolve(props.params);
  const podcast = await getPodcast(id);
  
  if (!podcast) {
    notFound();
  }

  return {
    title: podcast.title || 'English By Ear Podcast',
    description: podcast.metaWork,
  };
}

export default async function PodcastId(porps: any) {
    const { id } = await Promise.resolve(porps.params)
    const podcast = await getPodcast(id);
  return (
    <main className="flex-1">
        <section className="container py-12 px-32 md:py-24 lg:py-32">
          <Image
            src={podcast?.coverImage || defualtCover}
            alt={podcast?.title || "podcast cover"}
            width={350}
            height={225}
            className="w-full h-60 object-cover rounded-3xl"
            />
            <div className="p-4">
                <h3 className="truncate text-gray-600 text-xl font-semibold mb-2">{podcast?.title}</h3>
                <p className="truncate text-gray-600">{podcast?.description}</p>
            </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32">
        
        </section>    
    </main>
  )
}
