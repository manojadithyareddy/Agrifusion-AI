from app.auth.security import get_current_user
from app.models.user import User
from fastapi import Depends, APIRouter, Query
from typing import Optional
import logging

from app.services.weather import get_weather_service

router = APIRouter(prefix="/api/v1/weather", tags=["Weather"])
logger = logging.getLogger(__name__)


@router.get("/current")
async def get_weather(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    state: Optional[str] = Query(None, description="Indian state name"),
    district: Optional[str] = Query(None, description="District name"),
):
    """
    Get current weather + 7-day forecast + farm advisory.
    
    Provide either (lat, lon) or (state, district) to identify the location.
    If only state is provided, the state capital coordinates are used.
    """
    if not lat and not state:
        return {"error": "Provide either (lat, lon) or state name."}

    service = get_weather_service()
    result = await service.get_current_and_forecast(
        lat=lat, lon=lon, state=state, district=district
    )
    return result
