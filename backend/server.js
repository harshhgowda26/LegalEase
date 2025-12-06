import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import fetch from "node-fetch"; // ✅ for calling external APIs
import dotenv from "dotenv";
import { askGemini } from "./ask.js";

// Import route files
import chatRoutes from "./routes/chat.js";
import simplifierRoutes from "./routes/simplifier.js";
import translatorRoutes from "./routes/translator.js";
import lawyerRoutes from "./routes/lawyer.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LegalEase Node Backend is running!");
});

const PROMPTS_FILE = path.resolve("prompts.json");
const FILEID_FILE = path.resolve("fileId.json");

// ======================= PROMPTS =======================
app.get("/api/prompts", async (req, res) => {
  if (fs.existsSync(PROMPTS_FILE)) {
    return res.json(JSON.parse(fs.readFileSync(PROMPTS_FILE, "utf8")));
  }
  const mod = await import("./prompts.js");
  return res.json({
    systemInstructions: mod.systemInstructions,
    questions: mod.questions,
  });
});

app.post("/api/prompts", (req, res) => {
  const body = req.body;
  if (!body || !Array.isArray(body.questions)) {
    return res.status(400).json({ error: "Body must include questions array" });
  }
  fs.writeFileSync(PROMPTS_FILE, JSON.stringify(body, null, 2), "utf8");
  return res.json({ ok: true, saved: PROMPTS_FILE });
});

// ======================= FILE ID =======================
app.get("/api/fileId", (req, res) => {
  if (!fs.existsSync(FILEID_FILE)) {
    return res.status(404).json({ error: "fileId.json not found" });
  }
  return res.json(JSON.parse(fs.readFileSync(FILEID_FILE, "utf8")));
});

// ======================= GEMINI CHATBOT =======================
app.post("/api/ask-gemini", async (req, res) => {
  const { question, sessionId } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const answer = await askGemini(question, sessionId);
    return res.json({ question, answer });
  } catch (err) {
    console.error("Error asking Gemini:", err);
    return res.status(500).json({ error: "Failed to get an answer from the model." });
  }
});

// ======================= PERPLEXITY DOCUMENT SIMPLIFIER =======================
app.post("/api/process-text", async (req, res) => {
  try {
    const { text, prompt } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const apiResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "system", content: "You are a helpful legal assistant." },
          {
            role: "user",
            content: `
${prompt || "Simplify and summarize this legal text. Focus on obligations, risks, key dates, parties, and termination clauses."}
Extract key clauses with fields 'title', 'detail', and 'riskLevel'.
Return JSON only with 'summary' and 'keyClauses'.
Text:
${text}`,
          },
        ],
      }),
    });

    const data = await apiResponse.json();
    if (!data || !data.choices) {
      return res.status(500).json({ error: "Invalid response from Perplexity API" });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply received";
    res.json({ reply, raw: data });
  } catch (error) {
    console.error("❌ Error processing text:", error);
    res.status(500).json({ error: error.message || "Something went wrong with Perplexity API" });
  }
});

// ======================= OTHER ROUTES =======================
app.use("/api/chat", chatRoutes);          
app.use("/api/simplify", simplifierRoutes);
app.use("/api/translate", translatorRoutes);
app.use("/api/lawyer", lawyerRoutes);

// ======================= SERVER START =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
