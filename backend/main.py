from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import fitz
from fastapi import Header, HTTPException
import firebase_admin
from firebase_admin import credentials, auth
from services.pdf_service import extract_text
from services.gemini_service import ask_gemini

app = FastAPI()

cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)

 
def verify_firebase_token(authorization: str):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )

    try:
        token = authorization.replace("Bearer ", "")
        decoded_token = auth.verify_id_token(token)

        return decoded_token

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid Firebase token"
        )

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
    history: str=""


@app.post("/chat")
async def chat(
    req: ChatRequest,
    authorization: str = Header(None)

):
    user = verify_firebase_token(authorization)
    uid = user["uid"]

    print("Authenticated Firebase UID:", uid)

    prompt = f"""
You are an AI assistant that answers questions about a document.

DOCUMENT:
{req.document}

PREVIOUS CONVERSATION:
{req.history}

CURRENT QUESTION:
{req.question}

Instructions:
1. Answer using ONLY the information contained in the document.
2. Use the previous conversation to understand follow-up questions.
3. Do not invent information.
4. If the answer is not present in the document, reply exactly:
"I couldn't find that information in the document."
5. Give a clear and concise answer.
"""

    answer = ask_gemini(prompt)

    return {
        "answer": answer
    }