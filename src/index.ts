import { queryAnime } from "./rag/query.js";
import { openai, systemPrompt } from "./ai.js";

const query = process.argv[2];

console.log("Starting query...");

if (!query) {
  console.error("Please provide a query");
  process.exit(1);
}

try {
  const results = await queryAnime(query);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `
        Query: ${query}\n
        Relevant Anime: ${JSON.stringify(results, null, 2)}
        `,
      },
    ],
  });
  console.log("Recommendation:");
  console.log(response.choices[0].message.content);
} catch (error) {
  console.error("Failed to query anime:", error);
  process.exit(1);
}
