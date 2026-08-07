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

const RETRYABLE_STATUS_CODES = new Set([429, 500, 503]);
const MAX_ATTEMPTS = 3;
const MODEL_PREFERENCE = [
  "models/gemini-flash-latest",
  "models/gemini-2.5-flash",
  "models/gemini-2.0-flash",
  "models/gemini-2.0-flash-001",
  "models/gemini-flash-lite-latest",
];

let availableModelNamesPromise = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error) => {
  const status = error?.status ?? error?.code;
  const message = String(error?.message ?? "");

  return (
    RETRYABLE_STATUS_CODES.has(status) ||
    /high demand|temporarily unavailable|unavailable/i.test(message)
  );
};

const getAvailableChatModels = async () => {
  if (!availableModelNamesPromise) {
    availableModelNamesPromise = (async () => {
      const availableModelNames = new Set();

      const models = await ai.models.list();
      for await (const model of models) {
        const supportsGenerateContent =
          model.supportedActions?.includes("generateContent") ??
          model.supportedGenerationMethods?.includes("generateContent") ??
          true;

        if (supportsGenerateContent && model.name) {
          availableModelNames.add(model.name);
        }
      }

      return MODEL_PREFERENCE.filter((modelName) => availableModelNames.has(modelName));
    })();
  }

  return availableModelNamesPromise;
};

const createChat = (model) => ai.chats.create({
  model,
  config: {
    systemInstruction: systemInstructions.text,
  },
});

// Read uploaded file information
const fileInfo = JSON.parse(
  fs.readFileSync("fileId.json", "utf8")
);

const chats = {};

export async function askGemini(question, sessionId = "default-user") {
  if (!chats[sessionId]) {
    const availableModels = await getAvailableChatModels();
    const initialModel = availableModels[0];

    if (!initialModel) {
      throw new Error("No Gemini chat models are available for this API key.");
    }

    chats[sessionId] = {
      model: initialModel,
      chat: createChat(initialModel),
    };

    console.log(`New chat session created for ${sessionId} using ${initialModel}`);
  }

  const availableModels = await getAvailableChatModels();
  const session = chats[sessionId];
  const preferredModels = [
    session.model,
    ...availableModels.filter((model) => model !== session.model),
  ];

  let lastError;

  for (const model of preferredModels) {
    const activeChat = model === session.model ? session.chat : createChat(model);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await activeChat.sendMessage({
          message: [
            createPartFromUri(
              fileInfo.fileUri,
              fileInfo.mimeType
            ),
            question,
          ],
        });

        if (model !== session.model) {
          chats[sessionId] = { model, chat: activeChat };
          console.warn(`Switched ${sessionId} to fallback Gemini model ${model}.`);
        }

        return response.text;
      } catch (error) {
        lastError = error;

        if (!isRetryableGeminiError(error) || attempt === MAX_ATTEMPTS) {
          break;
        }

        const backoffMs = attempt * 1000;
        console.warn(
          `Gemini request failed for ${sessionId} on attempt ${attempt}/${MAX_ATTEMPTS} with ${model}. Retrying in ${backoffMs}ms.`
        );
        await sleep(backoffMs);
      }
    }
  }

  throw lastError;
}