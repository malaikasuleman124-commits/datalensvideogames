from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.services.forecaster import Forecaster

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

@router.get("")
async def get_forecast(
    genre: Optional[str] = Query(None),
    platform: Optional[str] = Query(None)
):
    filters = {}
    if genre:
        filters["genre"] = genre
    if platform:
        filters["platform"] = platform
        
    return Forecaster.get_forecast_data(filters)
