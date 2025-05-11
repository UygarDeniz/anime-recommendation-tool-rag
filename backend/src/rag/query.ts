import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

export type Anime = {
  title: string;
  description: string;
  genres: string;
  demographic: string;
  episodes: string;
  rating: string;
  source: string;
  studios: string;
  premiered: string;
  aired: string;
  duration: string;
  status: string;
};

export const queryAnime = async (query: string, limit: number = 5) => {
  try {
    const results = await index.query({
      data: query,
      topK: limit,
      includeMetadata: true,
      includeData: false,
    });

    return results;
  } catch (error) {
    console.error(error);
    return [];

  }
};
