from fastapi import APIRouter
from services.gemini_service import generate_answer

router = APIRouter()


@router.post("/chat")
def chat(question:str):

    prompt = f"""
    Answer this question:

    {question}
    """

    answer = generate_answer(prompt)

    return {
        "answer": answer
    }