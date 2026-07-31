import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./ask.js";

// Import route files
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

// ======================= OTHER ROUTES =======================          
app.use("/api/simplify", simplifierRoutes);
app.use("/api/translate", translatorRoutes);
app.use("/api/lawyer", lawyerRoutes);

// ======================= SERVER START =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
