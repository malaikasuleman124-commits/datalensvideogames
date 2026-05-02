from fastapi import APIRouter
from app.services.profiler import get_data_profile

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("")
async def get_profile():
    return get_data_profile()
