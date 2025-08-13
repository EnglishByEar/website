import React from 'react'
import { getPodcast, getAllPodcastIds } from "@/lib/podcast"
import { notFound } from 'next/navigation';


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

export default function PodcastId() {
  return (
    <div>PodcastId</div>
  )
}
