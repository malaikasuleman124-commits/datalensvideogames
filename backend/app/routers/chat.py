from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm import chat_service

router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("", response_model=ChatResponse)
async def post_chat_message(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    reply = chat_service.get_response(request.message)
    return ChatResponse(reply=reply)
