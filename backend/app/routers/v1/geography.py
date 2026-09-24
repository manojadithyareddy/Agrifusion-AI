from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models.geography import State, District, SubDistrict, Village
from app.schemas.geography import StateResponse, DistrictResponse

router = APIRouter(prefix="/api/v1/geography", tags=["Geography"])

@router.get("/states", response_model=List[StateResponse])
async def get_states(db: AsyncSession = Depends(get_db)):
    """Get all states and union territories."""
    result = await db.execute(select(State).filter_by(is_active=True).order_by(State.name))
    states = result.scalars().all()
    return states

@router.get("/states/{state_id}/districts", response_model=List[DistrictResponse])
async def get_districts(state_id: int, db: AsyncSession = Depends(get_db)):
    """Get all districts for a given state."""
    # Verify state exists
    result = await db.execute(select(State).filter_by(id=state_id))
    state = result.scalars().first()
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    
    result = await db.execute(select(District).filter_by(state_id=state_id).order_by(District.name))
    districts = result.scalars().all()
    return districts

@router.get("/districts/{district_id}/sub-districts")
async def get_sub_districts(district_id: int, db: AsyncSession = Depends(get_db)):
    """Get all sub-districts for a given district."""
    result = await db.execute(select(District).filter_by(id=district_id))
    district = result.scalars().first()
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    
    result = await db.execute(select(SubDistrict).filter_by(district_id=district_id).order_by(SubDistrict.name))
    sub_districts = result.scalars().all()
    return sub_districts

@router.get("/sub-districts/{sub_district_id}/villages")
async def get_villages(sub_district_id: int, db: AsyncSession = Depends(get_db)):
    """Get all villages for a given sub-district."""
    result = await db.execute(select(SubDistrict).filter_by(id=sub_district_id))
    sub_district = result.scalars().first()
    if not sub_district:
        raise HTTPException(status_code=404, detail="Sub-district not found")
    
    result = await db.execute(select(Village).filter_by(sub_district_id=sub_district_id).order_by(Village.name))
    villages = result.scalars().all()
    return villages
