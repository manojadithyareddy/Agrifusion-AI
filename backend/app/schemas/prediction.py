from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CropRecommendationInput(BaseModel):
    """Input schema for crop recommendation prediction."""
    location: str = Field(..., description="State or location string")
    soilType: str = Field(..., description="Soil type string")
    season: str = Field(..., description="Season string")
    targetCrop: Optional[str] = Field(None, description="Optional target crop to analyze specific risk")

class CropRecommendationResult(BaseModel):
    """Single crop recommendation with reasoning."""
    crop: str
    suitability_score: float = Field(..., ge=0, le=1, description="0 to 1 suitability score")
    confidence: float = Field(..., ge=0, le=1)
    reasons: List[str]
    expected_yield_range: Optional[str] = None
    water_requirement: Optional[str] = None
    climate_risk: Optional[str] = None

class CropRecommendationOutput(BaseModel):
    """Output schema for crop recommendation."""
    recommendations: List[CropRecommendationResult]
    target_crop_assessment: Optional[dict] = None
    model_version: str
    data_version: str
    timestamp: datetime
    input_summary: str

class YieldPredictionInput(BaseModel):
    """Input schema for yield prediction."""
    crop: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2)
    district: Optional[str] = None
    season: str = Field(..., description="Kharif, Rabi, Zaid, Perennial")
    area_hectares: float = Field(..., gt=0, le=100000)
    rainfall_mm: Optional[float] = Field(None, ge=0, le=5000)
    temperature_avg: Optional[float] = Field(None, ge=-10, le=60)
    irrigation_available: bool = False
    soil_type: Optional[str] = None

class YieldPredictionOutput(BaseModel):
    """Output schema for yield prediction."""
    crop: str
    predicted_yield_kg_per_hectare: float
    yield_range_min: float
    yield_range_max: float
    confidence: float
    key_factors: List[str]
    risk_factors: List[str]
    model_version: str
    data_version: str
    timestamp: datetime

class ClimateRiskInput(BaseModel):
    """Input schema for climate risk prediction."""
    state: str
    district: Optional[str] = None
    crop: Optional[str] = None
    month: Optional[int] = Field(None, ge=1, le=12)
    temperature: Optional[float] = Field(None, ge=-10, le=60)
    rainfall: Optional[float] = Field(None, ge=0, le=5000)
    humidity: Optional[float] = Field(None, ge=0, le=100)

class ClimateRiskResult(BaseModel):
    """Single climate risk assessment."""
    risk_type: str  # drought, flood, heatwave, etc.
    risk_level: str  # low, moderate, high, critical
    probability: float = Field(..., ge=0, le=1)
    cause: str
    affected_crops: List[str]
    expected_impact: str
    recommended_action: str

class ClimateRiskOutput(BaseModel):
    """Output schema for climate risk."""
    risks: List[ClimateRiskResult]
    overall_risk_level: str
    model_version: str
    timestamp: datetime

class IrrigationInput(BaseModel):
    """Input schema for irrigation prediction."""
    crop: str
    growth_stage: Optional[str] = None
    soil_type: Optional[str] = None
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    recent_rainfall_mm: float = Field(..., ge=0, le=500)
    forecast_rainfall_mm: Optional[float] = Field(None, ge=0, le=500)
    irrigation_method: Optional[str] = None

class IrrigationOutput(BaseModel):
    """Output schema for irrigation advice."""
    should_irrigate: bool
    urgency: str  # not_needed, low, moderate, high
    recommended_timing: Optional[str] = None
    recommended_frequency: Optional[str] = None
    estimated_water_mm: Optional[float] = None
    reason: str
    weather_consideration: str
    model_version: str
    timestamp: datetime

class MarketPriceInput(BaseModel):
    """Input schema for market price prediction."""
    crop: str
    state: str
    district: Optional[str] = None
    months_ahead: int = Field(default=1, ge=1, le=12)

class MarketPriceOutput(BaseModel):
    """Output schema for market price prediction."""
    crop: str
    predicted_price_per_quintal: float
    price_range_min: float
    price_range_max: float
    trend: str  # rising, falling, stable
    confidence: float
    historical_avg: Optional[float] = None
    best_selling_window: Optional[str] = None
    model_version: str
    timestamp: datetime

class RevenueProfitInput(BaseModel):
    """Input schema for revenue/profit calculation."""
    crop: str
    area_hectares: float = Field(..., gt=0)
    predicted_yield_kg_per_hectare: float = Field(..., gt=0)
    predicted_price_per_quintal: float = Field(..., gt=0)
    estimated_cost_per_hectare: Optional[float] = None

class RevenueProfitOutput(BaseModel):
    """Output schema for revenue/profit calculation."""
    crop: str
    total_yield_kg: float
    expected_revenue: float
    estimated_cost: float
    expected_profit: float
    profit_margin_pct: float
    cost_breakdown: dict
    risk_note: str
    timestamp: datetime
