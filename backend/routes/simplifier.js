import express from "express";
import client from "../ai/nvidia.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const schema = {
      type: "object",
      properties: {
        summary: { type: "string" },
        keyClauses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              detail: { type: "string" },
              status: { type: "string" },
              alert: { type: "boolean" },
            },
            required: ["title", "detail", "status", "alert"],
          },
        },
      },
      required: ["summary", "keyClauses"],
    };

const prompt = `
You are a legal document analysis assistant.

Analyze the following legal document and return ONLY a valid JSON object.

The JSON must have exactly this structure:

{
  "summary": "A simple summary in plain English.",
  "keyClauses": [
    {
      "title": "Clause Name",
      "detail": "Explanation of the clause.",
      "status": "Safe | Warning | Important",
      "alert": true
    }
  ]
}

Rules:
- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT write \`\`\`json.
- Do NOT add explanations.
- Include at least 3 key clauses whenever possible.
- The "alert" field must be either true or false.

Legal Document:
${text}
`;

const response = await client.chat.completions.create({
  model: "deepseek-ai/deepseek-v4-pro",
  messages: [
    {
      role: "system",
      content:
        "You are a JSON-only assistant. Return only valid JSON that matches the provided schema.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0,
});

let reply = response.choices?.[0]?.message?.content;

    if (!reply) return res.status(502).json({ error: "No valid content from API." });
    reply = reply.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      res.json(JSON.parse(reply));
    } catch (e) {
      res.status(502).json({ error: "Invalid JSON received", details: e.message });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

export default router;
