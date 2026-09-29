"""
AgriFusion AI — Vercel Serverless API
=====================================
Lightweight Serverless FastAPI service for Vercel deployment.
"""

import os
import sys
import json
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Resolve paths
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
BACKEND_DIR = ROOT_DIR / "backend"
DATA_DIR = BACKEND_DIR / "data"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

app = FastAPI(
    title="AgriFusion AI Serverless API",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
@app.get("/api/v1/health")
async def health():
    return {
        "status": "healthy",
        "runtime": "vercel-serverless",
        "service": "AgriFusion AI",
    }


@app.get("/api")
@app.get("/api/v1")
async def root():
    return {
        "name": "AgriFusion AI API",
        "status": "online",
        "docs": "/api/docs",
    }


@app.get("/api/v1/crops/categories")
async def get_crop_categories():
    cat_file = DATA_DIR / "crops" / "categories.json"
    if cat_file.exists():
        with open(cat_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return [
        {"id": 1, "name": "Cereals & Grains", "description": "Staple food crops"},
        {"id": 2, "name": "Pulses & Legumes", "description": "Protein-rich crops"},
        {"id": 3, "name": "Cash Crops & Fiber", "description": "Commercial agriculture"},
        {"id": 4, "name": "Fruits & Horticulture", "description": "High-value fruit crops"},
    ]


@app.get("/api/v1/crops")
async def get_crops(category_id: int = None):
    crops_file = DATA_DIR / "crops" / "crops.json"
    if crops_file.exists():
        with open(crops_file, "r", encoding="utf-8") as f:
            crops = json.load(f)
            return crops
    return []


@app.get("/api/v1/geography/states")
async def get_states():
    states_file = DATA_DIR / "geography" / "states.json"
    if states_file.exists():
        with open(states_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return [
        {"id": 1, "name": "Andhra Pradesh", "code": "AP"},
        {"id": 2, "name": "Telangana", "code": "TG"},
        {"id": 3, "name": "Karnataka", "code": "KA"},
        {"id": 4, "name": "Maharashtra", "code": "MH"},
        {"id": 5, "name": "Punjab", "code": "PB"},
    ]


@app.get("/api/v1/schemes")
async def get_schemes():
    schemes_file = DATA_DIR / "schemes" / "government_schemes.json"
    if schemes_file.exists():
        with open(schemes_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@app.post("/api/v1/predictions/crop-recommendation")
@app.post("/api/v1/predictions/crop")
async def predict_crop_recommendation(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    state = body.get("state") or "Karnataka"
    district = body.get("district") or ""
    soil_type = body.get("soilType") or "Alluvial"
    season = body.get("season") or "Kharif"
    target_crop = body.get("targetCrop")
    request_id = body.get("request_id")

    candidate_crops = [
        {"crop": "Cotton", "score": 0.94, "yield_range": "2,200 - 2,800 kg/ha", "risk": "Moderate Risk — Flowering Stage"},
        {"crop": "Maize", "score": 0.91, "yield_range": "4,500 - 5,800 kg/ha", "risk": "Low Risk — Vegetative Stage"},
        {"crop": "Sugarcane", "score": 0.88, "yield_range": "75,000 - 90,000 kg/ha", "risk": "Low Risk — Cane Maturity"},
        {"crop": "Rice", "score": 0.86, "yield_range": "3,800 - 4,600 kg/ha", "risk": "Moderate Risk — Tillering Stage"},
        {"crop": "Soybean", "score": 0.84, "yield_range": "1,800 - 2,400 kg/ha", "risk": "Moderate Risk — Pod Formation"},
        {"crop": "Groundnut", "score": 0.82, "yield_range": "2,000 - 2,600 kg/ha", "risk": "Low Risk — Pegging Stage"},
        {"crop": "Wheat", "score": 0.80, "yield_range": "3,500 - 4,400 kg/ha", "risk": "Low Risk — Grain Filling"},
        {"crop": "Chickpea", "score": 0.78, "yield_range": "1,400 - 1,900 kg/ha", "risk": "Low Risk — Flowering Stage"},
    ]

    # Adjust scores based on season
    if season.lower() == "rabi":
        for c in candidate_crops:
            if c["crop"] in ["Wheat", "Chickpea"]:
                c["score"] += 0.12
            elif c["crop"] in ["Cotton", "Rice"]:
                c["score"] -= 0.10
    elif season.lower() == "zaid":
        for c in candidate_crops:
            if c["crop"] in ["Watermelon", "Muskmelon", "Maize"]:
                c["score"] += 0.10

    candidate_crops.sort(key=lambda x: x["score"], reverse=True)

    recommendations = []
    for c in candidate_crops:
        sc = round(min(0.98, max(0.60, c["score"])), 2)
        pct = round(sc * 100)
        recommendations.append({
            "crop": c["crop"],
            "suitability_score": sc,
            "suitability_pct": pct,
            "confidence": round(sc - 0.02, 2),
            "yield_potential_pct": round(sc * 98.0, 1),
            "climate_safety_pct": 88.0 if "Low" in c["risk"] else 76.0,
            "climate_risk_pct": 12.0 if "Low" in c["risk"] else 24.0,
            "irrigation_fit_pct": round(sc * 95.0, 1),
            "market_profitability_pct": round(80.0 + sc * 15.0, 1),
            "market_premium_pct": 12.0,
            "reasons": [
                f"Optimal seasonal alignment for {season} growth cycle in {state}",
                f"High fertility response curve with {soil_type} soil profiles",
                f"Favorable regional agro-climatic conditions across {district or state}",
            ],
            "expected_yield_range": c["yield_range"],
            "water_requirement": "Moderate (600 - 800 mm)",
            "climate_risk": c["risk"],
        })

    target_crop_assessment = None
    if target_crop and target_crop.lower() not in ["", "all", "-- auto-recommend all crops --"]:
        target_crop_assessment = {
            "crop": target_crop,
            "risk_rating": "Moderate",
            "overall_risk_level": "moderate",
            "suitability_score": 0.92,
            "confidence": 0.91,
            "climate_threats": ["Occasional dry spell at flowering", "Mild humidity spike"],
            "major_pests_diseases": ["Bollworm / Aphids", "Leaf spot"],
            "preventive_measures": ["Apply neem-based bio-repellent early", "Ensure ridge-and-furrow drainage"],
            "critical_vulnerable_stage": "Flowering & Fruit Development",
            "expected_yield": "2,400 - 3,200 kg/ha",
            "key_advisories": [
                f"Optimal soil condition detected for {target_crop} in {district or state}.",
                "Monitor pest pressure during early vegetative phase.",
            ],
        }

    return {
        "recommendations": recommendations,
        "target_crop_assessment": target_crop_assessment,
        "model_version": "1.0.0-serverless",
        "data_version": "2026.09",
        "request_id": request_id,
        "input_summary": f"{state}, {district}, {season}, {soil_type}",
    }


@app.post("/api/v1/predictions/yield")
async def predict_yield(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    crop = body.get("crop") or "Rice"
    area = float(body.get("area_hectares") or 1.0)
    base_yield = 2850
    return {
        "crop": crop,
        "predicted_yield_kg_per_hectare": base_yield,
        "yield_range_min": int(base_yield * 0.88),
        "yield_range_max": int(base_yield * 1.14),
        "total_production_kg": int(base_yield * area),
        "yield_efficiency_pct": 94.5,
        "confidence": 0.93,
    }


@app.post("/api/v1/predictions/climate-risk")
async def predict_climate_risk(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    crop = body.get("crop") or "Rice"
    return {
        "crop": crop,
        "overall_risk_level": "moderate",
        "climate_risk_pct": 24,
        "climate_safety_pct": 76,
        "confidence": 0.92,
        "risks": [
            {"type": "Heat Stress", "level": "Low", "probability": 0.15},
            {"type": "Dry Spell", "level": "Moderate", "probability": 0.35},
            {"type": "Excess Rainfall", "level": "Low", "probability": 0.10},
        ],
    }


@app.post("/api/v1/predictions/irrigation")
async def predict_irrigation(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    crop = body.get("crop") or "Rice"
    return {
        "crop": crop,
        "irrigation_needed": True,
        "moisture_index_pct": 82.0,
        "recommendation": f"Apply light irrigation in 2 days during morning hours for {crop}.",
        "water_amount_mm": 35,
        "confidence": 0.94,
    }


@app.post("/api/v1/predictions/market-price")
async def predict_market_price(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    crop = body.get("crop") or "Rice"
    return {
        "crop": crop,
        "modal_price_per_quintal": 2250,
        "min_price": 2050,
        "max_price": 2480,
        "msp": 2183,
        "market_confidence_pct": 93.0,
        "price_trend": "Bullish (+3.2% expected next month)",
    }


@app.post("/api/v1/predictions/revenue")
@app.post("/api/v1/predictions/revenue-profit")
async def predict_revenue(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    crop = body.get("crop") or "Rice"
    area = float(body.get("area_hectares") or 1.0)
    yield_kg = float(body.get("predicted_yield_kg_per_hectare") or 2500)
    price_q = float(body.get("predicted_price_per_quintal") or 2200)
    cost_ha = float(body.get("estimated_cost_per_hectare") or 28000)

    total_prod_q = (yield_kg / 100.0) * area
    gross_rev = round(total_prod_q * price_q)
    total_cost = round(cost_ha * area)
    net_profit = gross_rev - total_cost

    return {
        "crop": crop,
        "gross_revenue": gross_rev,
        "total_cost": total_cost,
        "net_profit": net_profit,
        "profit_margin_pct": round((net_profit / gross_rev * 100) if gross_rev > 0 else 0, 1),
        "bcr": round(gross_rev / total_cost if total_cost > 0 else 1.0, 2),
    }

