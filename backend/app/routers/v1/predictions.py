from app.auth.security import get_current_user
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.prediction import (
    CropRecommendationInput, CropRecommendationOutput,
    YieldPredictionInput, YieldPredictionOutput,
    ClimateRiskInput, ClimateRiskOutput,
    IrrigationInput, IrrigationOutput,
    MarketPriceInput, MarketPriceOutput,
    RevenueProfitInput, RevenueProfitOutput,
)
from app.services.prediction import get_prediction_service

router = APIRouter(prefix="/api/v1/predictions", tags=["Predictions"])


@router.post("/crop-recommendation")
async def predict_crop_recommendation(input_data: CropRecommendationInput, current_user: User = Depends(get_current_user)):
    """
    Get AI-powered crop recommendations based on soil, weather, and location.
    Returns ranked crops with suitability scores and explanations.
    """
    service = get_prediction_service()
    result = await service.get_crop_recommendation(
        location=input_data.location,
        soilType=input_data.soilType,
        season=input_data.season,
        targetCrop=input_data.targetCrop,
    )
    return result


@router.post("/yield")
async def predict_yield(input_data: YieldPredictionInput, current_user: User = Depends(get_current_user)):
    """
    Predict expected crop yield in kg/hectare.
    Returns yield range, confidence, and key contributing factors.
    """
    service = get_prediction_service()
    result = await service.get_yield_prediction(
        crop=input_data.crop,
        state=input_data.state,
        district=input_data.district,
        season=input_data.season,
        area_hectares=input_data.area_hectares,
        rainfall_mm=input_data.rainfall_mm,
        temperature_avg=input_data.temperature_avg,
        irrigation_available=input_data.irrigation_available,
        soil_type=input_data.soil_type,
    )
    return result


@router.post("/climate-risk")
async def predict_climate_risk(input_data: ClimateRiskInput, current_user: User = Depends(get_current_user)):
    """
    Assess climate risks (drought, flood, heatwave, etc.) for a location and crop.
    Returns risk levels, probabilities, and recommended actions.
    """
    service = get_prediction_service()
    result = await service.get_climate_risk(
        state=input_data.state,
        district=input_data.district,
        crop=input_data.crop,
        month=input_data.month,
        temperature=input_data.temperature,
        rainfall=input_data.rainfall,
        humidity=input_data.humidity,
    )
    return result


@router.post("/irrigation")
async def predict_irrigation(input_data: IrrigationInput, current_user: User = Depends(get_current_user)):
    """
    Get irrigation recommendation based on crop, weather, and soil conditions.
    Returns whether to irrigate, timing, frequency, and reasoning.
    """
    service = get_prediction_service()
    result = await service.get_irrigation_advice(
        crop=input_data.crop,
        temperature=input_data.temperature,
        humidity=input_data.humidity,
        recent_rainfall_mm=input_data.recent_rainfall_mm,
        growth_stage=input_data.growth_stage,
        soil_type=input_data.soil_type,
        forecast_rainfall_mm=input_data.forecast_rainfall_mm,
        irrigation_method=input_data.irrigation_method,
    )
    return result


@router.post("/market-price")
async def predict_market_price(input_data: MarketPriceInput, current_user: User = Depends(get_current_user)):
    """
    Predict market price for a crop using historical data.
    """
    service = get_prediction_service()
    result = await service.get_market_price(
        crop=input_data.crop,
        state=input_data.state,
        district=input_data.district,
        months_ahead=input_data.months_ahead,
    )
    return result


@router.post("/revenue")
async def predict_revenue_profit(input_data: RevenueProfitInput, current_user: User = Depends(get_current_user)):
    """
    Calculate expected revenue and profit from yield and price data.
    Includes cost breakdown and risk disclaimer.
    """
    service = get_prediction_service()
    result = await service.get_revenue_profit(
        crop=input_data.crop,
        area_hectares=input_data.area_hectares,
        predicted_yield_kg_per_hectare=input_data.predicted_yield_kg_per_hectare,
        predicted_price_per_quintal=input_data.predicted_price_per_quintal,
        estimated_cost_per_hectare=input_data.estimated_cost_per_hectare,
    )
    return result
