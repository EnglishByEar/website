import Image from "next/image"
import Link from "next/link"
import type { Episode } from "@/types/podcast"

export default function PodcastCard({ episode }: { episode: Episode }) {
  return (
    <Link href={`/podcast/${episode.id}`} className="block">
      <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          src={episode.coverImage || "/placeholder.svg"}
          alt={episode.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="truncate text-gray-600 text-xl font-semibold mb-2">{episode.title}</h3>
          <p className="truncate text-gray-600">{episode.description}</p>
        </div>
      </div>
    </Link>
  )
}