from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.services.data_manager import get_db
from app.models.dataset import GameSaleRecord

router = APIRouter(prefix="/api/data", tags=["Data"])

@router.get("/genre-sales")
def get_genre_sales(genre: str = None, platform: str = None, db: Session = Depends(get_db)):
    query = db.query(
        GameSaleRecord.genre,
        func.sum(GameSaleRecord.global_sales).label("total_sales")
    )
    if genre:
        query = query.filter(GameSaleRecord.genre == genre)
    if platform:
        query = query.filter(GameSaleRecord.platform == platform)
        
    results = query.group_by(GameSaleRecord.genre).order_by(func.sum(GameSaleRecord.global_sales).desc()).all()
    
    return [{"name": r.genre, "sales": round(r.total_sales, 2)} for r in results if r.genre]

@router.get("/platform-sales")
def get_platform_sales(genre: str = None, platform: str = None, db: Session = Depends(get_db), limit: int = 10):
    query = db.query(
        GameSaleRecord.platform,
        func.sum(GameSaleRecord.global_sales).label("total_sales")
    )
    if genre:
        query = query.filter(GameSaleRecord.genre == genre)
    if platform:
        query = query.filter(GameSaleRecord.platform == platform)
        
    results = query.group_by(GameSaleRecord.platform).order_by(func.sum(GameSaleRecord.global_sales).desc()).limit(limit).all()
    
    return [{"name": r.platform, "sales": round(r.total_sales, 2)} for r in results if r.platform]

@router.get("/sales-over-time")
def get_sales_over_time(genre: str = None, platform: str = None, db: Session = Depends(get_db)):
    query = db.query(
        GameSaleRecord.year_of_release,
        func.sum(GameSaleRecord.global_sales).label("total_sales")
    ).filter(GameSaleRecord.year_of_release != None)
    
    if genre:
        query = query.filter(GameSaleRecord.genre == genre)
    if platform:
        query = query.filter(GameSaleRecord.platform == platform)
        
    results = query.group_by(GameSaleRecord.year_of_release).order_by(GameSaleRecord.year_of_release).all()
    
    return [{"year": int(r.year_of_release), "sales": round(r.total_sales, 2)} for r in results]

@router.get("/filters")
def get_filters(db: Session = Depends(get_db)):
    genres = db.query(GameSaleRecord.genre).distinct().all()
    platforms = db.query(GameSaleRecord.platform).distinct().all()
    
    return {
        "genres": sorted([r.genre for r in genres if r.genre]),
        "platforms": sorted([r.platform for r in platforms if r.platform])
    }
