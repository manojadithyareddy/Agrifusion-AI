from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict
from datetime import datetime

class StateBase(BaseModel):
    code: str = Field(..., max_length=10, description="State abbreviation")
    name: str = Field(..., min_length=2, max_length=100)
    census_code: Optional[str] = None
    state_type: str = Field(default="State")
    
class StateCreate(StateBase):
    country_id: int

class StateResponse(StateBase):
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DistrictBase(BaseModel):
    code: str = Field(..., max_length=10)
    name: str = Field(..., min_length=2, max_length=100)
    census_code: Optional[str] = None

class DistrictCreate(DistrictBase):
    state_id: int

class DistrictResponse(DistrictBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
