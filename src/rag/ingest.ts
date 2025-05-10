import "dotenv/config";
import { Index } from "@upstash/vector";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

const dataPath = path.join(process.cwd(), "src/rag/anime_data.csv");
const data = fs.readFileSync(dataPath, "utf-8");
const records = parse(data, {
  columns: true,
  skip_empty_lines: true,
});

console.log("Starting to ingest data...");

for (const anime of records) {
  const text = `Title: ${anime.English}. Genres: ${anime.Genres}. Demographic: ${anime.Demographic}. Description: ${anime.Description}.`;

  try {
    await index.upsert({
      id: anime.English,
      data: text,
      metadata: {
        Title: anime.English,
        Description: anime.Description,
        Genres: anime.Genres,
        Demographic: anime.Demographic,
        Episodes: anime.Episodes,
        Rating: anime.Rating,
        Source: anime.Source,
        Studios: anime.Studios,
        Premiered: anime.Premiered,
        Aired: anime.Aired,
        Duration: anime.Duration,
        Status: anime.Status,
      },
    });
  } catch (error) {
    console.error("Error upserting anime:", anime.English);
    console.error(error);
  }
}

console.log("Data ingestion completed.");
