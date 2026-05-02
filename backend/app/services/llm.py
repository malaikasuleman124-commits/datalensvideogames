import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.services.data_manager import SessionLocal
from app.models.dataset import GameSaleRecord

# Tools that Gemini can call
def get_top_selling_games(limit: int = 5):
    """
    Returns the top best-selling games globally from the dataset.
    Args:
        limit: The number of games to return (default 5).
    """
    db = SessionLocal()
    try:
        results = db.query(GameSaleRecord).order_by(GameSaleRecord.global_sales.desc()).limit(limit).all()
        return [{"name": r.name, "platform": r.platform, "year": r.year_of_release, "global_sales": r.global_sales} for r in results]
    finally:
        db.close()

def get_genre_distribution():
    """
    Returns total global sales aggregated by game genre.
    """
    db = SessionLocal()
    try:
        results = db.query(
            GameSaleRecord.genre,
            func.sum(GameSaleRecord.global_sales).label("total_sales")
        ).group_by(GameSaleRecord.genre).order_by(func.sum(GameSaleRecord.global_sales).desc()).all()
        return [{"genre": r.genre, "total_global_sales": round(float(r.total_sales), 2)} for r in results if r.genre]
    finally:
        db.close()

def get_platform_stats():
    """
    Returns total global sales aggregated by platform.
    """
    db = SessionLocal()
    try:
        results = db.query(
            GameSaleRecord.platform,
            func.sum(GameSaleRecord.global_sales).label("total_sales")
        ).group_by(GameSaleRecord.platform).order_by(func.sum(GameSaleRecord.global_sales).desc()).all()
        return [{"platform": r.platform, "total_global_sales": round(float(r.total_sales), 2)} for r in results if r.platform]
    finally:
        db.close()

class ChatService:
    def __init__(self):
        self.initialized = False
        self.model = None
        self.chat = None

    def _initialize(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return False
        
        genai.configure(api_key=api_key)
        # Using gemini-1.5-flash for speed and cost efficiency
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest",
            tools=[get_top_selling_games, get_genre_distribution, get_platform_stats],
            system_instruction="You are DataLens AI, a helpful assistant for analyzing video game sales data. Use the provided tools to answer user questions based on the dataset."
        )
        self.chat = self.model.start_chat(enable_automatic_function_calling=True)
        self.initialized = True
        return True

    def get_response(self, message: str):
        if not self.initialized:
            if not self._initialize():
                return "Gemini API key is missing. Please set GEMINI_API_KEY in your .env file to enable chat."
        
        try:
            response = self.chat.send_message(message)
            return response.text
        except Exception as e:
            return f"Error communicating with Gemini: {str(e)}"

    def generate_executive_summary(self, profile_data: dict, genre_stats: list):
        if not self.initialized:
            if not self._initialize():
                return "AI Summary is currently unavailable. Please check your API configuration."
        
        prompt = f"""
        Provide a concise, professional 2-3 sentence executive summary of this video game sales dataset.
        Key Stats:
        - Total Games: {profile_data.get('total_games')}
        - Year Range: {profile_data.get('min_year')} to {profile_data.get('max_year')}
        - Total Global Sales: {profile_data.get('total_global_sales')} million units
        - Top Genres: {', '.join([g.get('genre', 'Unknown') for g in genre_stats[:3]])}
        
        The summary should sound insightful, professional, and highlight the scale or dominant trends in the data. 
        Do not use markdown formatting like bolding or bullet points. Just return plain text.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Unable to generate summary at this time: {str(e)}"

chat_service = ChatService()
