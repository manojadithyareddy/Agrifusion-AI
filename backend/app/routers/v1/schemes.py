from app.auth.security import get_current_user
from app.models.user import User
from fastapi import Depends, APIRouter, Query
from typing import Optional
import logging

from app.services.schemes import get_scheme_service

router = APIRouter(prefix="/api/v1/schemes", tags=["Government Schemes"])
logger = logging.getLogger(__name__)


@router.get("/")
async def list_schemes( current_user: User = Depends(get_current_user)):
    """List all active government agriculture schemes."""
    service = get_scheme_service()
    return {"schemes": service.get_all_schemes(), "count": len(service.get_all_schemes())}


@router.get("/recommend")
async def recommend_schemes(
    state: Optional[str] = Query(None, description="Farmer's state"),
    crop: Optional[str] = Query(None, description="Primary crop"),
    land_size: Optional[float] = Query(None, ge=0, description="Land size in hectares"),
    land_size_hectares: Optional[float] = Query(None, ge=0, description="Land size in hectares (alias)"),
    irrigation: bool = Query(False, description="Has irrigation access?"),
    organic: bool = Query(False, description="Interested in organic farming?"),
    category: str = Query("general", description="Farmer category: general, small, marginal, sc, st"),
):
    """
    Get personalized scheme recommendations based on farmer profile.
    """
    effective_land_size = land_size if land_size is not None else land_size_hectares
    service = get_scheme_service()
    results = service.recommend_schemes(
        state=state,
        crop=crop,
        land_size_hectares=effective_land_size,
        irrigation_available=irrigation,
        is_organic=organic,
        farmer_category=category,
    )
    return {"recommendations": results, "count": len(results)}


@router.get("/{scheme_id}")
async def get_scheme(scheme_id: str, current_user: User = Depends(get_current_user)):
    """Get detailed information about a specific scheme."""
    service = get_scheme_service()
    scheme = service.get_scheme_by_id(scheme_id)
    if not scheme:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found.")
    return scheme
