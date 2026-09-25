from app.auth.security import get_optional_current_user
from app.models.user import User
from fastapi import Depends, APIRouter, Query
from pydantic import BaseModel, Field
from typing import Optional
import logging

from app.services.soil_health import get_soil_health_service

router = APIRouter(prefix="/api/v1/soil-health", tags=["Soil Health"])
logger = logging.getLogger(__name__)


class SoilHealthInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=500, description="Nitrogen (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus (kg/ha)")
    potassium: float = Field(..., ge=0, le=500, description="Potassium (kg/ha)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    organic_carbon: Optional[float] = Field(None, ge=0, le=5, description="Organic carbon (%)")
    sulphur: Optional[float] = Field(None, ge=0, description="Sulphur (ppm)")
    zinc: Optional[float] = Field(None, ge=0, description="Zinc (ppm)")
    iron: Optional[float] = Field(None, ge=0, description="Iron (ppm)")
    boron: Optional[float] = Field(None, ge=0, description="Boron (ppm)")
    crop: Optional[str] = None
    soil_type: Optional[str] = None


@router.post("/report")
async def generate_soil_report(
    input_data: SoilHealthInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Generate a comprehensive soil health report with nutrient analysis,
    deficiency identification, and fertilizer recommendations.
    """
    service = get_soil_health_service()
    report = service.generate_report(
        nitrogen=input_data.nitrogen,
        phosphorus=input_data.phosphorus,
        potassium=input_data.potassium,
        ph=input_data.ph,
        organic_carbon=input_data.organic_carbon,
        sulphur=input_data.sulphur,
        zinc=input_data.zinc,
        iron=input_data.iron,
        boron=input_data.boron,
        crop=input_data.crop,
        soil_type=input_data.soil_type,
    )
    return report
