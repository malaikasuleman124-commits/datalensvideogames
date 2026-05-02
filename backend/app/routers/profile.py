from fastapi import APIRouter
from app.services.profiler import get_data_profile

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("")
async def get_profile(genre: str = None, platform: str = None):
    return get_data_profile(genre=genre, platform=platform)
