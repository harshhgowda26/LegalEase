import dotenv from "dotenv";
import fs from "fs";
import {
  GoogleGenAI,
  createPartFromUri,
} from "@google/genai";
import { systemInstructions } from "./prompts.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Read uploaded file information
const fileInfo = JSON.parse(
  fs.readFileSync("fileId.json", "utf8")
);

const chats = {};

export async function askGemini(question, sessionId = "default-user") {
  if (!chats[sessionId]) {
    chats[sessionId] = ai.chats.create({
      model: "gemini-flash-latest",
      config: {
        systemInstruction: systemInstructions.text,
      },
    });

    console.log(`New chat session created for ${sessionId}`);
  }

  const chat = chats[sessionId];

  const response = await chat.sendMessage({
    message: [
      createPartFromUri(
        fileInfo.fileUri,
        fileInfo.mimeType
      ),
      question,
    ],
  });

  return response.text;
}