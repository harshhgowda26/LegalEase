import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function uploadFile(filePath, displayName) {
  try {
    const file = await ai.files.upload({
      file: filePath,
      config: {
        mimeType: "application/pdf",
        displayName,
      },
    });

    console.log("Uploaded:", file.name);

    fs.writeFileSync(
      "fileId.json",
      JSON.stringify(
        {
          fileId: file.name,
          fileUri: file.uri,
          mimeType: file.mimeType,
        },
        null,
        2
      )
    );

    console.log("File information saved.");

    return file;
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2]) {
  uploadFile(
    process.argv[2],
    process.argv[3] || "Constitution PDF"
  );
}

export default uploadFile;