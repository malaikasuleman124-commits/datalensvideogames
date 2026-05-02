from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.data_manager import get_db
from app.services.profiler import get_data_profile
from app.routers.data import get_genre_sales
from app.services.llm import chat_service

router = APIRouter(prefix="/api/summary", tags=["Summary"])

@router.get("")
def get_summary(db: Session = Depends(get_db)):
    # Fetch current state of data
    profile = get_data_profile()
    
    if profile["total_games"] == 0:
        return {"summary": "No data available. Please upload a dataset to generate a summary."}
    
    # Fetch some additional context for the summary
    genre_stats = get_genre_sales(db=db)
    
    # Generate summary via LLM
    summary_text = chat_service.generate_executive_summary(profile, genre_stats)
    
    return {"summary": summary_text}
