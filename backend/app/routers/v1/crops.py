from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from typing import List

from app.database import get_db
from app.models.agriculture import CropCategory, Crop, CropDisease, CropPest
from app.schemas.agriculture import CropCategoryResponse, CropResponse

router = APIRouter(prefix="/api/v1/crops", tags=["Crops"])

@router.get("/categories", response_model=List[CropCategoryResponse])
async def get_crop_categories(db: AsyncSession = Depends(get_db)):
    """Get all crop categories."""
    result = await db.execute(select(CropCategory).order_by(CropCategory.name))
    categories = result.scalars().all()
    return categories

@router.get("/", response_model=List[CropResponse])
async def get_crops(
    category_id: int | None = None,
    crop_type: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all crops, optionally filtered by category or crop type (Kharif, Rabi, Zaid, Perennial)."""
    query = select(Crop)
    if category_id:
        query = query.filter(Crop.category_id == category_id)
    if crop_type:
        query = query.filter(Crop.crop_type == crop_type)
    query = query.order_by(Crop.name)
    
    result = await db.execute(query)
    crops = result.scalars().all()
    return crops

@router.get("/{crop_id}")
async def get_crop_detail(crop_id: int, db: AsyncSession = Depends(get_db)):
    """Get detailed information about a specific crop, including diseases and pests."""
    result = await db.execute(
        select(Crop)
        .options(joinedload(Crop.diseases), joinedload(Crop.pests), joinedload(Crop.varieties))
        .filter(Crop.id == crop_id)
    )
    crop = result.unique().scalars().first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    return {
        "id": crop.id,
        "name": crop.name,
        "scientific_name": crop.scientific_name,
        "name_hindi": crop.name_hindi,
        "crop_type": crop.crop_type,
        "water_requirement_mm": crop.water_requirement_mm,
        "ideal_temperature_range": crop.ideal_temperature_range,
        "ideal_ph_range": crop.ideal_ph_range,
        "growth_duration_days_min": crop.growth_duration_days_min,
        "growth_duration_days_max": crop.growth_duration_days_max,
        "description": crop.description,
        "source": crop.source,
        "diseases": [
            {"id": d.id, "name": d.name, "pathogen_type": d.pathogen_type, "symptoms": d.symptoms, "management": d.management}
            for d in crop.diseases
        ],
        "pests": [
            {"id": p.id, "name": p.name, "pest_type": p.pest_type, "damage_symptoms": p.damage_symptoms, "management": p.management}
            for p in crop.pests
        ],
        "varieties": [
            {"id": v.id, "name": v.name, "developed_by": v.developed_by, "avg_yield_kg_per_hectare": v.avg_yield_kg_per_hectare}
            for v in crop.varieties
        ],
    }

@router.get("/{crop_id}/diseases")
async def get_crop_diseases(crop_id: int, db: AsyncSession = Depends(get_db)):
    """Get diseases associated with a specific crop."""
    result = await db.execute(select(Crop).filter_by(id=crop_id))
    crop = result.scalars().first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    result = await db.execute(select(CropDisease).filter_by(crop_id=crop_id))
    diseases = result.scalars().all()
    return diseases

@router.get("/{crop_id}/pests")
async def get_crop_pests(crop_id: int, db: AsyncSession = Depends(get_db)):
    """Get pests associated with a specific crop."""
    result = await db.execute(select(Crop).filter_by(id=crop_id))
    crop = result.scalars().first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    result = await db.execute(select(CropPest).filter_by(crop_id=crop_id))
    pests = result.scalars().all()
    return pests
