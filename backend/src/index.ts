import "dotenv/config";
import express from "express";
import { queryAnime } from "./rag/query.js";
import { openai, systemPrompt } from "./ai.js";
import type { Request, Response } from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/api/recommend", async (req: Request, res: Response) => {
  const query = req.body.query;

  try {
    const results = await queryAnime(query);

    if (results.length === 0) {
      res.json({
        message: "Sorry, I couldn't find any relevant anime for that query.",
      });
      return;
    }
    
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
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: "Failed to query anime" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
