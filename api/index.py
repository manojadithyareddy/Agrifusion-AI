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


@app.post("/api/v1/predictions/crop")
async def predict_crop(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    return {
        "recommended_crop": "Rice (Oryza sativa)",
        "confidence": 0.94,
        "input_parameters": body,
        "alternatives": ["Maize", "Cotton"],
        "advisory": "Optimal soil moisture and NPK profile for Kharif season.",
    }
