const podcastJsonLd = {
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "name": "The English Learning Podcast",
  "description": "A weekly show that helps English learners improve vocabulary, pronunciation, and cultural understanding.",
  "url": "https://www.EnglishByEar.com/podcast",
  "image": "https://www.EnglishByEar.com/images/podcast-cover.jpg",
  "inLanguage": "en",
  "author": {
    "@type": "Person",
    "name": "Hosein Ghasemizade",
    "url": "https://www.EnglishByEar.com/podcast"
  },
  "publisher": {
    "@type": "Organization",
    "name": "English By Ear",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.EnglishByEar.com/images/logo.png"
    }
  },
  "mainEntityOfPage": "https://www.EnglishByEar.com/podcast",
  "hasPart": [
    {
      "@type": "PodcastEpisode",
      "name": "Episode 1: Mastering Small Talk in English",
      "description": "Learn how to start and keep a conversation going in English.",
      "url": "https://www.EnglishByEar.com/episode-1",
      "datePublished": "2025-08-05",
      "timeRequired": "PT22M",
      "episodeNumber": 1,
      "inLanguage": "en",
      "associatedMedia": {
        "@type": "MediaObject",
        "contentUrl": "https://cdn.EnglishByEar.com/audio/episode-1.mp3",
        "encodingFormat": "audio/mpeg"
      }
    },
    {
      "@type": "PodcastEpisode",
      "name": "Episode 2: 10 Common Mistakes English Learners Make",
      "description": "We discuss the most frequent grammar and pronunciation mistakes and how to avoid them.",
      "url": "https://www.EnglishByEar.com/episode-2",
      "datePublished": "2025-08-12",
      "timeRequired": "PT25M",
      "episodeNumber": 2,
      "inLanguage": "en",
      "associatedMedia": {
        "@type": "MediaObject",
        "contentUrl": "https://cdn.EnglishByEar.com/audio/episode-2.mp3",
        "encodingFormat": "audio/mpeg"
      }
    }
  ]
};

export default podcastJsonLd;
