# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
from PyPDF2 import PdfReader
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
from pathlib import Path
import logging

# ---------------- Setup / Logging ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("legalease-rag")

# Load env
load_dotenv()  # loads .env from project root by default
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing from .env — please add it")

genai.configure(api_key=GEMINI_API_KEY)

# ---------------- App + CORS ----------------
app = FastAPI(title="LegalEase RAG Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Embedding + FAISS Setup ----------------
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
logger.info("Loading sentence-transformers model: %s", MODEL_NAME)
model = SentenceTransformer(MODEL_NAME)

VECTOR_SIZE = 384  # all-MiniLM-L6-v2 uses 384
INDEX_PATH = Path("vector_index.faiss")
CHUNKS_PATH = Path("chunks.json")

if INDEX_PATH.exists():
    logger.info("Loading FAISS index from %s", INDEX_PATH)
    index = faiss.read_index(str(INDEX_PATH))
else:
    logger.info("Creating new FAISS index")
    index = faiss.IndexFlatL2(VECTOR_SIZE)

# load chunks list if present
if CHUNKS_PATH.exists():
    try:
        with CHUNKS_PATH.open("r", encoding="utf-8") as f:
            CHUNKS = json.load(f)
        logger.info("Loaded %d chunks from %s", len(CHUNKS), CHUNKS_PATH)
    except Exception as e:
        logger.warning("Failed to load chunks.json: %s — starting with empty list", e)
        CHUNKS = []
else:
    CHUNKS = []

# ---------------- Utilities ----------------
def save_index_and_chunks():
    try:
        faiss.write_index(index, str(INDEX_PATH))
        with CHUNKS_PATH.open("w", encoding="utf-8") as f:
            json.dump(CHUNKS, f, ensure_ascii=False, indent=2)
        logger.info("Saved FAISS index and %d chunks", len(CHUNKS))
    except Exception as e:
        logger.exception("Failed to save index or chunks: %s", e)

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    reader = PdfReader(file_path)
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text += page_text + "\n"
    return text

def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    # simple chunker, preserves contiguous slices
    chunks = []
    start = 0
    n = len(text)
    while start < n:
        chunk = text[start:start + chunk_size].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size
    return chunks

def embed_texts(texts: List[str]) -> np.ndarray:
    embeddings = model.encode(texts, show_progress_bar=False)
    return np.array(embeddings).astype("float32")

# ---------------- Request models ----------------
class ChatRequest(BaseModel):
    messages: List[str]
    top_k: Optional[int] = 3

# ---------------- Endpoints ----------------
@app.get("/health")
async def health():
    return {"status": "ok", "index_size": int(index.ntotal), "chunks_stored": len(CHUNKS)}

@app.get("/")
async def root():
    return {"message": "LegalEase Python Backend is running!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF file (multipart/form-data). The endpoint:
      - saves the file under data/docs/
      - extracts text
      - chunks the text
      - embeds and adds to faiss index
      - persists index and chunks
    """
    try:
        os.makedirs("data/docs", exist_ok=True)
        out_path = Path("data/docs") / Path(file.filename).name

        # Save incoming file
        contents = await file.read()
        with out_path.open("wb") as f:
            f.write(contents)
        logger.info("Saved uploaded file to %s", out_path)

        # Only support PDFs for now (safe and simple)
        if not str(out_path).lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF uploads are supported by this endpoint")

        text = extract_text_from_pdf(str(out_path))
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text extracted from PDF")

        chunks = chunk_text(text)
        if not chunks:
            raise HTTPException(status_code=400, detail="Document produced 0 chunks")

        embeddings = embed_texts(chunks)
        index.add(embeddings)

        # extend and persist
        CHUNKS.extend(chunks)
        save_index_and_chunks()

        return {"status": "success", "chunks_added": len(chunks), "index_size": int(index.ntotal)}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Upload failed: %s", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/query")
async def query_text(req: ChatRequest):
    """
    Query RAG backend. Request body:
      {
        "messages": ["Document Content: ...", "User asked: ..."],
        "top_k": 3
      }
    Response contains retrieved context and Gemini reply.
    """
    try:
        if index.ntotal == 0 or len(CHUNKS) == 0:
            return {"error": "No documents indexed yet. Upload a file first."}

        combined_query = "\n".join(req.messages)
        top_k = max(1, min(req.top_k or 3, 10))

        # embed user's combined query
        query_embedding = model.encode([combined_query]).astype("float32")
        D, I = index.search(query_embedding, top_k)
        retrieved_chunks = [CHUNKS[i] for i in I[0] if i < len(CHUNKS)]

        # Build context + prompt
        context = "\n\n".join(retrieved_chunks)
        prompt = f"""
You are a helpful AI assistant specialized in answering user questions from the provided context.

Context:
{context}

User Query:
{combined_query}

Provide a concise, accurate answer using ONLY the context above when possible. If the context doesn't contain the answer, say you don't have enough information and suggest what to do next.
"""

        # Call Gemini (model name via env)
        model_name = os.getenv("GEMINI_MODEL", GEMINI_MODEL)
        try:
            gen_model = genai.GenerativeModel(model_name)
            response = gen_model.generate_content(prompt)
            # Many responses expose .text
            answer = getattr(response, "text", None) or response
        except Exception as e:
            logger.exception("Gemini call failed: %s", e)
            answer = f"Gemini API error: {str(e)}"

        return {"messages": req.messages, "context_used": retrieved_chunks, "reply": answer}
    except Exception as e:
        logger.exception("Query failed: %s", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
