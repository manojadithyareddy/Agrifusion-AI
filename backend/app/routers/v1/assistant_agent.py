"""
Assistant Agent Router — Dedicated Endpoints for /ai-assistant
==============================================================
Isolated API endpoints serving:
- POST /api/assistant/analyze-image: OpenCV pathology & contour detection (multi-image supported)
- POST /api/assistant/chat: Conversational AI Agent with referential memory
- POST /api/assistant/vision: Isolated computer vision feature extraction
- POST /api/assistant/rag: Agronomic retrieval from verified ICAR/FAO database
- GET  /api/assistant/models: Capability registry showing verified model versions and evaluation
- GET  /api/assistant/health: Health check
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid
import logging

from app.services.assistant_vision_engine import get_assistant_vision_engine
from app.nlp.agricultural_rag import get_agricultural_rag
from app.nlp.assistant_ai_agent import get_agriculture_ai_agent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant (Vision & Agent)"])


# ── Pydantic Request & Response Schemas ──

class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    message: str = Field(..., min_length=1, description="Farmer query or follow-up question")
    language: Optional[str] = Field(default="en", description="ISO 639-1 language code (en, hi, etc.)")
    crop_hint: Optional[str] = Field(default=None, description="Optional crop hint")


class ChatResponse(BaseModel):
    request_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:16])
    session_id: str
    response_text: str
    vision_result: Optional[Dict[str, Any]] = None
    rag_context: Optional[Dict[str, Any]] = None
    model_capability: Dict[str, Any]


class ImageAnalysisResponse(BaseModel):
    request_id: str = Field(default_factory=lambda: uuid.uuid4().hex[:16])
    status: str
    crop: Dict[str, Any]
    disease: Dict[str, Any]
    pests: List[str]
    pest_status: str
    symptoms: List[str]
    severity: str
    treatment: List[str]
    prevention: List[str]
    safety_warnings: List[str]
    sources: List[Dict[str, str]]
    evidence: List[Dict[str, Any]]
    opencv_metrics: Dict[str, Any]
    model_versions: Dict[str, Any]
    friendly_response: str


# ── Endpoints ──

@router.get("/health")
async def assistant_health():
    """Health status of the isolated AI Assistant backend."""
    vision = get_assistant_vision_engine()
    rag = get_agricultural_rag()
    return {
        "status": "healthy",
        "service": "AgriFusion AI Assistant Isolated Backend",
        "vision_engine": vision.model_version,
        "rag_records_count": len(rag.knowledge_base),
        "supported_crops": rag.get_supported_crops(),
        "gemini_vision_dependency": "REMOVED (Native OpenCV Pathology Active)"
    }


@router.get("/models")
async def get_models_capability():
    """
    Model Capability Registry.
    Transparently reports actual model versions, OpenCV contour segmenter, and evaluation.
    """
    vision = get_assistant_vision_engine()
    return vision.get_capability_report()


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_assistant_image(
    file: UploadFile = File(...),
    language: Optional[str] = Form("en"),
    crop_hint: Optional[str] = Form(None),
    additional_file_1: Optional[UploadFile] = File(None),
    additional_file_2: Optional[UploadFile] = File(None)
):
    """
    Server-side OpenCV Image Analysis for /ai-assistant.
    Validates optical quality (blur, exposure), segments lesions via contours,
    calculates calibrated confidence, and links to verified ICAR/FAO treatments.
    """
    vision = get_assistant_vision_engine()
    rag = get_agricultural_rag()
    agent = get_agriculture_ai_agent()

    # Read primary image bytes
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read image stream: {e}")

    filename = file.filename or "leaf.jpg"
    diag = vision.analyze_image_bytes(content, filename=filename, crop_hint=crop_hint)

    # Multi-image evidence aggregation if additional files uploaded
    additional_evidence = []
    for add_file in [additional_file_1, additional_file_2]:
        if add_file:
            try:
                add_content = await add_file.read()
                if len(add_content) > 0:
                    add_diag = vision.analyze_image_bytes(add_content, filename=add_file.filename or "leaf2.jpg", crop_hint=crop_hint)
                    if add_diag.get("evidence"):
                        additional_evidence.extend(add_diag["evidence"])
            except Exception:
                pass

    all_evidence = diag.get("evidence", []) + additional_evidence

    # RAG Retrieval
    treatment = []
    prevention = []
    safety = []
    sources = []

    condition_key = diag.get("condition_lookup_key")
    crop_name = diag.get("crop", {}).get("name")

    if condition_key and crop_name:
        rag_rec = rag.retrieve_by_condition(crop_name, condition_key)
        if rag_rec:
            treatment = rag_rec.get("chemical_management", [])
            prevention = rag_rec.get("cultural_management", []) + rag_rec.get("biological_management", [])
            safety = rag_rec.get("safety_warnings", [])
            sources = rag_rec.get("sources", [])

    # Friendly chat response synthesis
    friendly_msg = agent.llm_provider.generate_chat_response(
        user_message="Analyze image",
        rag_context={"record": rag_rec} if condition_key and 'rag_rec' in locals() and rag_rec else None,
        vision_result=diag,
        history=[],
        language=language or "en"
    )

    return ImageAnalysisResponse(
        status=diag["status"],
        crop=diag.get("crop", {"name": "Unknown", "confidence": 0.0}),
        disease=diag.get("disease", {"name": "Unknown", "confidence": 0.0, "severity": "Unknown"}),
        pests=diag.get("pests", []),
        pest_status=diag.get("pest_status", "No supported pest was detected by the current vision model."),
        symptoms=diag.get("symptoms", []),
        severity=diag.get("disease", {}).get("severity", "None"),
        treatment=treatment,
        prevention=prevention,
        safety_warnings=safety,
        sources=sources,
        evidence=all_evidence,
        opencv_metrics=diag.get("opencv_metrics", {}),
        model_versions=diag.get("model_versions", {}),
        friendly_response=friendly_msg
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_assistant(request: ChatRequest):
    """
    Conversational AI Agent Endpoint for /ai-assistant.
    Maintains conversational memory, resolves pronouns, and reasons over verified agronomy.
    """
    agent = get_agriculture_ai_agent()
    result = agent.process_turn(
        session_id=request.session_id,
        user_message=request.message,
        language=request.language or "en",
        crop_hint=request.crop_hint
    )

    return ChatResponse(
        session_id=result["session_id"],
        response_text=result["response_text"],
        vision_result=result["vision_result"],
        rag_context=result["rag_context"],
        model_capability=result["model_capability"]
    )


@router.post("/rag")
async def query_rag_endpoint(
    query: str = Query(..., description="Query phrase or symptom description"),
    crop: Optional[str] = Query(None, description="Crop filter")
):
    """Isolated RAG Query Endpoint."""
    rag = get_agricultural_rag()
    return rag.query_rag(query, crop_hint=crop)
