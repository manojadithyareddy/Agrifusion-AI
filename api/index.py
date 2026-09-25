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


# ── Serverless Authentication Handlers ──
@app.post("/api/v1/auth/login")
async def auth_login(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    email = body.get("email", "").strip().lower()
    
    role = "ADMIN" if "admin" in email else "USER"
    name = "System Administrator" if role == "ADMIN" else email.split("@")[0].capitalize() or "AgriFusion Farmer"
    
    user = {
        "id": 1 if role == "ADMIN" else 2,
        "email": email or "farmer@agrifusion.ai",
        "name": name,
        "full_name": name,
        "role": role,
        "is_active": True,
        "authentication_provider": "local",
    }
    return {
        "access_token": f"vercel_token_{os.urandom(8).hex()}",
        "token_type": "bearer",
        "user": user,
    }


@app.post("/api/v1/auth/register")
async def auth_register(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    email = body.get("email", "").strip().lower()
    name = body.get("name", "").strip() or email.split("@")[0].capitalize() or "AgriFusion Farmer"
    
    user = {
        "id": int(os.urandom(4).hex(), 16),
        "email": email,
        "name": name,
        "full_name": name,
        "role": "USER",
        "is_active": True,
        "authentication_provider": "local",
    }
    return {
        "access_token": f"vercel_reg_{os.urandom(8).hex()}",
        "token_type": "bearer",
        "user": user,
    }


@app.post("/api/v1/auth/google")
async def auth_google(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    email = body.get("email", "google.farmer@agrifusion.ai")
    name = body.get("name", "Google Verified Farmer")
    return {
        "access_token": f"vercel_google_{os.urandom(8).hex()}",
        "token_type": "bearer",
        "user": {
            "id": 101,
            "email": email,
            "name": name,
            "full_name": name,
            "role": "USER",
            "is_active": True,
            "authentication_provider": "google",
        },
    }


@app.get("/api/v1/auth/me")
async def auth_me():
    return {
        "id": 1,
        "email": "farmer@agrifusion.ai",
        "name": "AgriFusion Farmer",
        "full_name": "AgriFusion Farmer",
        "role": "USER",
        "is_active": True,
    }


@app.post("/api/v1/auth/logout")
async def auth_logout():
    return {"status": "success", "message": "Logged out successfully"}

