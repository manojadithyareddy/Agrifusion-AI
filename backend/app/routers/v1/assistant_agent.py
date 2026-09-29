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
    crop: Any
    crop_confidence: float = 0.0
    disease: Any
    disease_confidence: float = 0.0
    pests: List[Any] = []
    pest_confidence: Optional[float] = None
    pest_status: str = "No visible pest detected"
    symptoms: List[str] = []
    pest_damage: List[str] = []
    severity: str = "None"
    treatment: List[str] = []
    pest_control: List[str] = []
    prevention: List[str] = []
    safety_warnings: List[str] = []
    sources: List[Dict[str, str]] = []
    evidence: List[Dict[str, Any]] = []
    opencv_metrics: Dict[str, Any] = {}
    model_versions: Dict[str, Any] = {}
    friendly_response: str = ""
    # Multimodal multi-image fields
    images_count: int = 1
    per_image_results: Optional[List[Dict[str, Any]]] = None
    multi_crop: bool = False
    crops_detected: Optional[List[Dict[str, Any]]] = None
    duplicate_detected: bool = False
    fusion_summary: Optional[str] = None
    uncertainty_note: Optional[str] = None


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
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    language: Optional[str] = Form("en"),
    crop_hint: Optional[str] = Form(None),
    additional_file_1: Optional[UploadFile] = File(None),
    additional_file_2: Optional[UploadFile] = File(None)
):
    """
    Production-grade Multi-Image OpenCV & ML Analysis for /ai-assistant.
    Analysis Flow:
    Image Quality Check → Crop Identification → Disease Detection → Pest Detection → Symptom Extraction → Multi-Image Evidence Fusion → Knowledge/RAG Verification → Final Report.
    """
    vision = get_assistant_vision_engine()
    rag = get_agricultural_rag()
    agent = get_agriculture_ai_agent()

    # Collect all uploaded image streams (support both singular file + additionals and files list)
    candidate_files: List[UploadFile] = []
    if file:
        candidate_files.append(file)
    if additional_file_1:
        candidate_files.append(additional_file_1)
    if additional_file_2:
        candidate_files.append(additional_file_2)
    if files:
        for f in files:
            if f and f not in candidate_files:
                candidate_files.append(f)

    if not candidate_files:
        raise HTTPException(status_code=400, detail="No image file provided for analysis.")

    # Read binary bytes for each file (up to 3 images)
    image_tuples: List[Tuple[bytes, str]] = []
    for f in candidate_files[:3]:
        try:
            content = await f.read()
            if len(content) > 0:
                image_tuples.append((content, f.filename or "leaf.jpg"))
        except Exception as e:
            logger.warning(f"Failed to read image stream {f.filename}: {e}")

    if not image_tuples:
        raise HTTPException(status_code=400, detail="Uploaded images are empty or unreadable.")

    logger.info(
        f"[Assistant Router] Received {len(image_tuples)} image(s) for multimodal analysis: "
        f"{[name for _, name in image_tuples]}, crop_hint='{crop_hint}', language='{language}'"
    )

    # Execute Multimodal Multi-Image Pipeline
    diag = vision.analyze_multiple_images(image_tuples, crop_hint=crop_hint)

    # Management & RAG Retrieval
    treatment = diag.get("treatment", [])
    pest_control = diag.get("pest_control", [])
    pest_damage = diag.get("pest_damage", [])
    prevention = diag.get("prevention", [])
    safety = [
        "Wear chemical-resistant gloves, eye protection, and a mask during pesticide or fungicide application.",
        "Strictly adhere to the recommended dilution dosage and pre-harvest interval (PHI).",
        "Avoid spraying during high wind conditions (>10 km/h) or direct midday heat."
    ]
    sources = [
        {"authority": "ICAR-IIHR / NCIPM", "document": "Integrated Pest & Disease Management Protocol", "year": "2024"},
        {"authority": "FAO Crop Protection Portal", "document": "Standard Diagnostic Surveillance Guidelines", "year": "2023"}
    ]
    rag_rec = None

    # Retrieve RAG guidance for detected crop(s)
    if diag.get("multi_crop") and diag.get("crops_detected"):
        for crop_entry in diag["crops_detected"]:
            cname = crop_entry.get("name")
            dname = crop_entry.get("disease", "")
            dkey = dname.lower().replace(" ", "_")
            retrieved = rag.retrieve_by_condition(cname, dkey)
            if retrieved:
                if retrieved.get("sources"):
                    sources.extend(retrieved.get("sources"))
    else:
        condition_key = diag.get("condition_lookup_key")
        crop_name = diag.get("crop", {}).get("name")
        if condition_key and crop_name:
            rag_rec = rag.retrieve_by_condition(crop_name, condition_key)
            if rag_rec:
                if not treatment:
                    treatment = rag_rec.get("chemical_management", [])
                if not prevention:
                    prevention = rag_rec.get("cultural_management", []) + rag_rec.get("biological_management", [])
                if rag_rec.get("safety_warnings"):
                    safety = rag_rec.get("safety_warnings", [])
                if rag_rec.get("sources"):
                    sources = rag_rec.get("sources", [])

    # Friendly chat response synthesis if not pre-formulated
    friendly_msg = diag.get("friendly_response")
    if not friendly_msg:
        friendly_msg = agent.llm_provider.generate_chat_response(
            user_message="Analyze image",
            rag_context={"record": rag_rec} if 'rag_rec' in locals() and rag_rec else None,
            vision_result=diag,
            history=[],
            language=language or "en"
        )

    return ImageAnalysisResponse(
        status=diag["status"],
        crop=diag.get("crop", {"name": "Unknown", "confidence": 0.0}),
        crop_confidence=diag.get("crop_confidence", 0.0),
        disease=diag.get("disease", {"name": "Unknown", "confidence": 0.0, "severity": "None"}),
        disease_confidence=diag.get("disease_confidence", 0.0),
        pests=diag.get("pests", []),
        pest_confidence=diag.get("pest_confidence"),
        pest_status=diag.get("pest_status", "No visible pest detected"),
        symptoms=diag.get("symptoms", []),
        pest_damage=pest_damage,
        severity=diag.get("disease", {}).get("severity", diag.get("severity", "None")),
        treatment=treatment,
        pest_control=pest_control,
        prevention=prevention,
        safety_warnings=safety,
        sources=sources,
        evidence=diag.get("evidence", []),
        opencv_metrics=diag.get("opencv_metrics", {}),
        model_versions=diag.get("model_versions", {}),
        friendly_response=friendly_msg,
        images_count=diag.get("images_count", len(image_tuples)),
        per_image_results=diag.get("per_image_results"),
        multi_crop=diag.get("multi_crop", False),
        crops_detected=diag.get("crops_detected"),
        duplicate_detected=diag.get("duplicate_detected", False),
        fusion_summary=diag.get("fusion_summary"),
        uncertainty_note=diag.get("uncertainty_note"),
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
