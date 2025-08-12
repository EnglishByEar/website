export interface Podcast {
  title: string;
  description: string;
  coverImage: string;
  language: string;
  author: string;
  publisher: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: string;
  audioUrl: string;
  datePublished: string;
  duration: string;
}
