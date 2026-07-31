import express from "express";
import client from "../ai/nvidia.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

const response = await client.chat.completions.create({
  model: "deepseek-ai/deepseek-v4-pro",
  messages: [
    {
      role: "system",
      content: `
You are a professional translator.

Return ONLY the translated text.

Do not add explanations.
Do not add notes.
Do not use markdown.
      `,
    },
    {
      role: "user",
      content: text,
    },
  ],
  temperature: 0,
});

let reply = response.choices?.[0]?.message?.content?.trim();
   
    reply = reply.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      res.json(JSON.parse(reply));
    } catch (err) {
      res.json({ translation: reply });
    }
  } catch (error) {
    console.error("❌ Translator error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;
