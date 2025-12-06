// ask.js
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { systemInstructions } from "./prompts.js"; // Import systemInstructions

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

// Load saved file ID
let fileId = null;
try {
  if (fs.existsSync("fileId.json")) {
    const fileData = JSON.parse(fs.readFileSync("fileId.json"));
    fileId = fileData.fileId;
  } else {
    console.warn("⚠️ fileId.json not found. Chat may fail if not uploaded.");
  }
} catch (err) {
  console.error("❌ Error reading fileId.json:", err);
}

const chatSessions = {};
let cachedFilePart = null;

async function getFilePart() {
  if (!fileId) {
     throw new Error("No file ID found. Please upload a file first.");
  }

  let getFile = await fileManager.getFile(fileId);
  while (getFile.state === "PROCESSING") {
    console.log(`File processing status: ${getFile.state}, retrying in 5s...`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    getFile = await fileManager.getFile(fileId);
  }

  if (getFile.state === "FAILED") {
    throw new Error("File processing failed.");
  }
  
  return {
    fileData: {
      mimeType: getFile.mimeType,
      fileUri: getFile.uri,
    },
  };
}

// Function to extract a brief, strong persona reminder from the full instructions
function getPersonaReminder(instructions) {
    // This extracts the most vital part of the persona to prepend to the user's prompt
    // e.g., "You are Professor Alistair Finch, a highly skeptical and formal constitutional law expert."
    const match = instructions.match(/You are .*?\.?$/im);
    return match ? match[0].trim() + " REMINDER:" : "REMINDER: Strictly follow all system instructions.";
}


export async function askGemini(question, sessionId = "default-user") {
  try {
    if (!cachedFilePart) {
      cachedFilePart = await getFilePart();
    }

    if (!chatSessions[sessionId]) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Use the standard, correct 'config' method for persistence
      chatSessions[sessionId] = model.startChat({
        config: {
             systemInstruction: systemInstructions.text, 
        }
      });
      console.log(`New chat session created for ${sessionId}.`);
    }

    const chat = chatSessions[sessionId];
    
    // 🎯 THE NEW FIX: Hybrid Prompting (Prepend Persona Reminder)
    const personaReminder = getPersonaReminder(systemInstructions.text);
    const combinedQuestion = `${personaReminder} ${question}`;

    const messageContents = [
      cachedFilePart, // Document context
      { text: combinedQuestion } // User question WITH reminder
    ];

    const result = await chat.sendMessage(messageContents); 

    return result.response.text();

  } catch (err) {
    console.error("Error in askGemini:", err);
    throw err;
  }
}