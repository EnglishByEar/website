import type { Episode } from "../types/podcast"
import podcastData from "./podcast.json"

export async function getPodcasts(): Promise<Episode[]> {
    return podcastData
}

export async function getPodcast(id: string): Promise<Episode | undefined> {
    const podcasts = await getPodcasts()
    return podcasts.find((episode) => episode.id === id)
}

export async function getAllPodcastIds() {
  return podcastData.map(episode => episode.id);
}