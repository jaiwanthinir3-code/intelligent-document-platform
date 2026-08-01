from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import fitz

from services.pdf_service import extract_text
from services.gemini_service import ask_gemini

app = FastAPI()

document_text = ""

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Backend Running ✅"}


@app.post("/summarize")
async def summarize(file: UploadFile = File(...)):
    try:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)

        # Save uploaded PDF
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("✅ File saved")

        # Extract text
        global document_text
        text = extract_text(filepath)
        document_text = text

        print("✅ PDF text extracted")

        # Document statistics
        pdf = fitz.open(filepath)
        pages = len(pdf)
        pdf.close()

        words = len(text.split())
        characters = len(text)

        # AI Summary
        prompt = f"""
Summarize the following PDF document in simple bullet points.

{text}
"""

        summary = ask_gemini(prompt)

        print("✅ Gemini response received")

        return {
            "filename": file.filename,
            "summary": summary,
            "document": text,
            "pages": pages,
            "words": words,
            "characters": characters
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "error": str(e)
        }


class ChatRequest(BaseModel):
    document: str
    question: str


@app.post("/chat")
async def chat(req: ChatRequest):
    prompt = f"""
You are an AI assistant.

Document:
{req.document}

Question:
{req.question}

Answer ONLY using the document.

If the answer is not present in the document, reply:
"I couldn't find that information in the document."
"""

    answer = ask_gemini(prompt)

    return {
        "answer": answer
    }