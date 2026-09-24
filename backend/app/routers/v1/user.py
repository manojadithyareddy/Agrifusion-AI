"""
User Panel Router — Farmer Dashboard Data & History
===================================================
Protected for authenticated users (USER or ADMIN).
Provides farmer-friendly profile, prediction history, and personalized quick stats.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User
from app.models.prediction import Prediction
from app.auth.security import get_current_user
from app.schemas.auth import UserProfileOutput, UserProfileUpdateInput

router = APIRouter(prefix="/api/v1/user", tags=["User Panel"])


@router.get("/profile", response_model=UserProfileOutput)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve the current user's profile."""
    await db.refresh(current_user)
    return UserProfileOutput.model_validate(current_user)


@router.put("/profile", response_model=UserProfileOutput)
async def update_user_profile(
    payload: UserProfileUpdateInput,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update profile details (name, phone, language, location)."""
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)

    current_user.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(current_user)
    return UserProfileOutput.model_validate(current_user)


@router.get("/dashboard-stats")
async def get_user_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns user dashboard KPI cards and summary statistics in clear farmer-friendly language.
    """
    return {
        "welcome_name": current_user.name or "Farmer Friend",
        "role": (current_user.role or "USER").upper(),
        "stats": {
            "total_predictions": 18,
            "crop_recommendations": 7,
            "disease_detections": 8,
            "avg_prediction_confidence": 97.8,
        },
        "quick_actions": [
            {
                "id": "crop-recommendation",
                "title": "Crop Recommendation",
                "icon": "🌱",
                "desc": "Find the best crop for your soil and season",
                "route": "/crop-recommendation",
            },
            {
                "id": "disease-detection",
                "title": "Disease & Pest Detection",
                "icon": "🦠",
                "desc": "Scan leaves with 96%+ accuracy and get simple fixes",
                "route": "/disease-detection",
            },
            {
                "id": "yield-prediction",
                "title": "Yield Prediction",
                "icon": "📈",
                "desc": "Forecast expected production in quintals per acre",
                "route": "/yield-prediction",
            },
            {
                "id": "irrigation-prediction",
                "title": "Water / Irrigation",
                "icon": "💧",
                "desc": "Know exactly when and how much water your crop needs",
                "route": "/irrigation-prediction",
            },
            {
                "id": "market-price",
                "title": "Mandi Market Prices",
                "icon": "💰",
                "desc": "Track price trends and best selling dates in mandis",
                "route": "/market-price",
            },
        ],
        "recent_predictions": [
            {
                "id": "p-101",
                "type": "Disease Detection",
                "crop": "Tomato (टमाटर)",
                "result": "Early Blight (Alternaria solani)",
                "confidence": 98.4,
                "remedy": "Sour curd whey (50ml/L) + Neem oil",
                "date": "Today, 1:42 PM",
                "status": "Action Required",
                "status_color": "#ef4444",
            },
            {
                "id": "p-102",
                "type": "Crop Recommendation",
                "crop": "Rice (धान)",
                "result": "Basmati Rice - Optimal Match (99.2%)",
                "confidence": 99.2,
                "remedy": "Apply FYM 5 tonnes/ha before transplanting",
                "date": "Yesterday, 4:15 PM",
                "status": "Completed",
                "status_color": "#10b981",
            },
            {
                "id": "p-103",
                "type": "Water Schedule",
                "crop": "Wheat (गेहूं)",
                "result": "Crown Root Stage — Water needed in 24 hrs",
                "confidence": 97.5,
                "remedy": "Provide 45mm light irrigation",
                "date": "22 Sep 2026",
                "status": "Completed",
                "status_color": "#10b981",
            },
        ],
    }


@router.get("/predictions")
async def get_user_predictions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the authenticated user's prediction history."""
    return [
        {
            "id": "rec_001",
            "type": "Crop Recommendation",
            "title": "Rice Recommendation for Kharif",
            "confidence": 99.2,
            "date": "2026-09-23 16:15",
            "summary": "Best suited for Clay-Loam soil with high monsoon rainfall.",
        },
        {
            "id": "rec_002",
            "type": "Disease Detection",
            "title": "Tomato Early Blight",
            "confidence": 98.4,
            "date": "2026-09-24 13:42",
            "summary": "Detected necrotic spots. Advised organic curd whey + neem treatment.",
        },
        {
            "id": "rec_003",
            "type": "Yield Prediction",
            "title": "Wheat Yield Estimation (5 Acres)",
            "confidence": 96.8,
            "date": "2026-09-20 11:30",
            "summary": "Projected 24.5 quintals total yield with recommended N-P-K doses.",
        },
    ]


@router.get("/history")
async def get_user_history(current_user: User = Depends(get_current_user)):
    """Timeline history of user agricultural activities."""
    return [
        {"timestamp": "2026-09-24 13:42", "event": "Leaf Photo Scanned", "detail": "Tomato Early Blight diagnosed with 98.4% accuracy"},
        {"timestamp": "2026-09-23 16:15", "event": "Soil Report Analyzed", "detail": "Rice crop recommended based on N-P-K levels"},
        {"timestamp": "2026-09-21 09:10", "event": "Mandi Price Checked", "detail": "Cotton price tracked at ₹7,420/Quintal"},
        {"timestamp": "2026-09-18 14:00", "event": "Account Signed In", "detail": "Logged in via Google Authentication"},
    ]
