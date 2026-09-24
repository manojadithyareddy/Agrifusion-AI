from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional, List
from datetime import datetime

class CropCategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None

class CropCategoryResponse(CropCategoryBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class CropBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    scientific_name: Optional[str] = None
    water_requirement_mm: Optional[float] = Field(None, gt=0, description="Water requirement must be positive")
    
    @field_validator("water_requirement_mm")
    @classmethod
    def check_water_limit(cls, v: float | None) -> float | None:
        if v is not None and v > 10000:
            raise ValueError("Water requirement is unrealistically high")
        return v

class CropCreate(CropBase):
    category_id: int

class CropResponse(CropBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
