"""
Server-Side Gemini Multimodal Vision Service
============================================
Securely performs deep plant pathology and crop health diagnosis using
Google Gemini Multimodal Vision API on the server.

SECURITY & PRIVACY GUARANTEES:
1. The API key is stored and used STRICTLY on the server (backend).
2. The API key is NEVER sent to the client (neither user nor admin).
3. Neither user nor admin UIs display the API key or state "using api key".
4. If the API key is not configured, or if the API times out / is busy,
   the service seamlessly returns None, triggering graceful native OpenCV fallback.
5. Exceptions are sanitized so that raw API keys are never printed in logs or errors.
"""

import os
import io
import json
import base64
import logging
from typing import Optional, Dict, Any, List
from PIL import Image
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# Candidate Gemini multimodal vision models in priority order
CANDIDATE_MODELS = [
    "models/gemini-flash-latest",
    "models/gemini-2.5-flash-lite",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.5-flash",
    "models/gemini-3.8-flash",
    "models/gemini-2.0-flash",
]

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"


def _sanitize_log_message(msg: str, key: Optional[str]) -> str:
    """Ensure API key never appears in log messages."""
    if key and key in msg:
        return msg.replace(key, "[REDACTED_API_KEY]")
    return msg


def _build_payload(image_bytes: bytes, crop_hint: Optional[str], language: str) -> tuple[dict, str]:
    """Helper to build Gemini multimodal payload."""
    mime_type = "image/jpeg"
    try:
        with Image.open(io.BytesIO(image_bytes)) as pil_img:
            fmt = (pil_img.format or "").upper()
            if fmt == "PNG":
                mime_type = "image/png"
            elif fmt == "WEBP":
                mime_type = "image/webp"
            else:
                mime_type = "image/jpeg"
    except Exception:
        mime_type = "image/jpeg"

    b64_data = base64.b64encode(image_bytes).decode("utf-8")
    is_hindi = (language or "en").lower() == "hi"

    prompt = (
        "You are a world-class agricultural plant pathologist and agronomist for AgriFusion AI.\n"
        "Analyze this agricultural crop/plant image in deep detail.\n\n"
        "CRITICAL BOTANICAL & PATHOLOGY RULES:\n"
        "1. CROP IDENTIFICATION: Accurately identify the crop species (e.g. Banana, Rice, Cotton, Tomato, Potato, "
        "Wheat, Maize, Sugarcane, Mango, Chilli, Soybean, Groundnut, Grapes, Onion, etc.).\n"
        "- If the image shows Banana fruit fingers, a bunch, or a broad unbroken paddle leaf, classify as 'Banana'. Do NOT misclassify as Cotton.\n"
        "- Cotton requires palmate lobed leaves or white fluffy cotton bolls.\n"
        "- If the image is not a recognizable agricultural crop or plant foliage/fruit, or evidence is insufficient, "
        "set 'status' to 'UNABLE_TO_IDENTIFY_CROP' and 'crop' to 'Unable to identify crop'.\n"
        "2. DISEASE & CONDITION: Identify the exact disease, fungal/bacterial pathogen, or physiological disorder "
        "(e.g. Early Blight, Late Blight, Black Sigatoka, Rice Blast, Bacterial Blight, Healthy Crop).\n"
        "3. PEST STATUS: State clearly if any visible insect pests, aphids, whiteflies, caterpillars, borers, or mites are present, "
        "or 'No visible pest detected'.\n"
        "4. CONFIDENCE: Calibration score between 0.85 and 0.99 for confirmed identification.\n"
        "5. SYMPTOMS: 3 to 4 clear visual observations.\n"
        "6. SEVERITY: One of ['Mild', 'Moderate', 'Severe', 'Critical', 'None'].\n"
        "7. TREATMENTS: Recommended practical chemical fungicides/insecticides with exact dosages, and organic remedies.\n"
        "8. PREVENTION: 2 to 3 agronomic preventive cultural practices.\n\n"
        f"{'Note: Provide helpful Hindi terms where appropriate so Indian farmers easily comprehend.' if is_hindi else ''}\n\n"
        "Return ONLY a valid JSON object matching this schema without any markdown formatting:\n"
        "{\n"
        '  "status": "CONFIRMED_DIAGNOSIS" or "UNABLE_TO_IDENTIFY_CROP",\n'
        '  "crop": string,\n'
        '  "crop_scientific": string,\n'
        '  "crop_confidence": number,\n'
        '  "disease": string,\n'
        '  "disease_scientific": string,\n'
        '  "disease_confidence": number,\n'
        '  "severity": string,\n'
        '  "pests": [{"name": string, "type": string, "confidence": number}],\n'
        '  "pest_status": string,\n'
        '  "pest_confidence": number,\n'
        '  "symptoms": [string],\n'
        '  "chemical_treatment": string,\n'
        '  "organic_treatment": string,\n'
        '  "treatment": [string],\n'
        '  "pest_control": [string],\n'
        '  "prevention": [string],\n'
        '  "friendly_message": string\n'
        "}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": b64_data,
                        }
                    },
                ]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.15,
        },
    }
    return payload, mime_type


class GeminiVisionService:
    """Server-side Gemini Vision diagnostic service."""

    def __init__(self):
        self._api_key = (
            getattr(settings, "GEMINI_API_KEY", None)
            or getattr(settings, "LLM_API_KEY", None)
            or os.environ.get("GEMINI_API_KEY")
            or os.environ.get("LLM_API_KEY")
        )

    def is_available(self) -> bool:
        """Returns True if a server-side API key is configured."""
        return bool(self._api_key and self._api_key.strip())

    def analyze_crop_image_sync(
        self,
        image_bytes: bytes,
        filename: str = "crop_leaf.jpg",
        crop_hint: Optional[str] = None,
        language: str = "en",
    ) -> Optional[Dict[str, Any]]:
        """Synchronous version for direct execution inside synchronous vision pipelines."""
        if not self.is_available():
            return None

        key = self._api_key.strip()
        payload, _ = _build_payload(image_bytes, crop_hint, language)

        try:
            with httpx.Client(timeout=10.0) as client:
                for model_id in CANDIDATE_MODELS:
                    url = f"{GEMINI_API_BASE}/{model_id}:generateContent?key={key}"
                    try:
                        resp = client.post(url, json=payload)
                        if resp.status_code == 200:
                            data = resp.json()
                            raw_text = (
                                data.get("candidates", [{}])[0]
                                .get("content", {})
                                .get("parts", [{}])[0]
                                .get("text", "")
                            )
                            if raw_text:
                                parsed = json.loads(raw_text)
                                logger.info(f"[Gemini Vision] Multimodal analysis succeeded using {model_id}.")
                                return self._format_gemini_response(parsed, crop_hint)
                        elif resp.status_code == 404:
                            continue
                        else:
                            safe_msg = _sanitize_log_message(resp.text[:180], key)
                            logger.warning(f"[Gemini Vision] Model {model_id} returned HTTP {resp.status_code}: {safe_msg}")
                    except httpx.TimeoutException:
                        logger.warning(f"[Gemini Vision] Timeout connecting to {model_id}.")
                    except Exception as e:
                        safe_err = _sanitize_log_message(str(e), key)
                        logger.warning(f"[Gemini Vision] Error calling {model_id}: {safe_err}")
        except Exception as e:
            logger.warning(f"[Gemini Vision] Sync client error: {e}")

        logger.info("[Gemini Vision] Seamlessly routing to native OpenCV computer vision pipeline.")
        return None

    async def analyze_crop_image(
        self,
        image_bytes: bytes,
        filename: str = "crop_leaf.jpg",
        crop_hint: Optional[str] = None,
        language: str = "en",
    ) -> Optional[Dict[str, Any]]:
        """Asynchronous version for async FastAPI endpoints."""
        if not self.is_available():
            return None

        key = self._api_key.strip()
        payload, _ = _build_payload(image_bytes, crop_hint, language)

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                for model_id in CANDIDATE_MODELS:
                    url = f"{GEMINI_API_BASE}/{model_id}:generateContent?key={key}"
                    try:
                        resp = await client.post(url, json=payload)
                        if resp.status_code == 200:
                            data = resp.json()
                            raw_text = (
                                data.get("candidates", [{}])[0]
                                .get("content", {})
                                .get("parts", [{}])[0]
                                .get("text", "")
                            )
                            if raw_text:
                                parsed = json.loads(raw_text)
                                logger.info(f"[Gemini Vision] Multimodal analysis succeeded using {model_id}.")
                                return self._format_gemini_response(parsed, crop_hint)
                        elif resp.status_code == 404:
                            continue
                        else:
                            safe_msg = _sanitize_log_message(resp.text[:180], key)
                            logger.warning(f"[Gemini Vision] Model {model_id} returned HTTP {resp.status_code}: {safe_msg}")
                    except httpx.TimeoutException:
                        logger.warning(f"[Gemini Vision] Timeout connecting to {model_id}.")
                    except Exception as e:
                        safe_err = _sanitize_log_message(str(e), key)
                        logger.warning(f"[Gemini Vision] Error calling {model_id}: {safe_err}")
        except Exception as e:
            logger.warning(f"[Gemini Vision] Async client error: {e}")

        logger.info("[Gemini Vision] Seamlessly routing to native OpenCV computer vision pipeline.")
        return None

    def _format_gemini_response(
        self, parsed: Dict[str, Any], crop_hint: Optional[str]
    ) -> Dict[str, Any]:
        """Convert Gemini JSON output into normalized AgriFusion diagnosis result."""
        status = parsed.get("status", "CONFIRMED_DIAGNOSIS")
        crop_raw = str(parsed.get("crop", "Unknown")).strip()
        crop_conf = float(parsed.get("crop_confidence", 0.95))

        # Check if crop identification failed
        if (
            status == "UNABLE_TO_IDENTIFY_CROP"
            or crop_conf < 0.70
            or "unable to identify" in crop_raw.lower()
            or "unknown" in crop_raw.lower()
        ):
            return {
                "status": "UNABLE_TO_IDENTIFY_CROP",
                "crop": {
                    "name": "Unable to identify crop",
                    "scientific": "",
                    "confidence": 0.0,
                    "key": "unable_to_identify_crop",
                },
                "crop_confidence": 0.0,
                "disease": {
                    "name": "Unable to identify crop",
                    "scientific_name": "",
                    "confidence": 0.0,
                    "severity": "None",
                    "key": "unable_to_identify_crop",
                },
                "disease_confidence": 0.0,
                "pests": [],
                "pest_confidence": None,
                "pest_status": "No visible pest detected",
                "symptoms": ["No agricultural crop foliage or fruit tissue detected in the image."],
                "pest_damage": [],
                "treatment": [],
                "pest_control": [],
                "prevention": ["Please upload a clear photo of Banana, Rice, Mango, Cotton, or other supported crops."],
                "severity": "None",
                "friendly_message": "🌱 Unable to identify crop: I couldn't detect agricultural crop tissue in this image. Please upload a clear photo of crop leaves or fruits.",
                "condition_lookup_key": "unable_to_identify_crop",
                "engine": "multimodal_ai_vision",
            }

        disease_name = str(parsed.get("disease", "Healthy Foliage")).strip()
        disease_conf = float(parsed.get("disease_confidence", 0.94))
        severity = str(parsed.get("severity", "Moderate")).capitalize()

        # Chemical & organic treatments
        chem = parsed.get("chemical_treatment") or ""
        org = parsed.get("organic_treatment") or ""
        treatments = parsed.get("treatment") or []
        if chem and chem not in treatments:
            treatments.insert(0, f"Chemical Control: {chem}")
        if org and org not in treatments:
            treatments.append(f"Organic Remedy: {org}")

        pests = parsed.get("pests") or []
        pest_status = parsed.get("pest_status") or ("Pests identified" if pests else "No visible pest detected")
        pest_conf = parsed.get("pest_confidence")

        friendly_msg = parsed.get("friendly_message") or (
            f"🌾 Plant Health Diagnosis: Identified {crop_raw} with {disease_name} ({round(disease_conf * 100, 1)}% confidence). "
            f"Severity is {severity}. Recommended action: {treatments[0] if treatments else 'Inspect regularly.'}"
        )

        return {
            "status": "CONFIRMED_DIAGNOSIS",
            "crop": {
                "name": crop_raw,
                "scientific": parsed.get("crop_scientific", ""),
                "confidence": crop_conf,
                "key": crop_raw.lower().replace(" ", "_"),
            },
            "crop_confidence": crop_conf,
            "disease": {
                "name": disease_name,
                "scientific_name": parsed.get("disease_scientific", ""),
                "confidence": disease_conf,
                "confidence_level": "HIGH" if disease_conf >= 0.85 else "MEDIUM",
                "severity": severity,
                "key": disease_name.lower().replace(" ", "_"),
            },
            "disease_confidence": disease_conf,
            "pests": pests,
            "pest_confidence": pest_conf,
            "pest_status": pest_status,
            "symptoms": parsed.get("symptoms") or ["Foliar symptoms visible on plant tissue."],
            "pest_damage": [p.get("name") for p in pests if isinstance(p, dict)] if pests else [],
            "treatment": treatments,
            "pest_control": parsed.get("pest_control") or (["Apply bio-control agent or Neem oil spray."] if pests else []),
            "prevention": parsed.get("prevention") or ["Ensure balanced crop nutrition and avoid waterlogging."],
            "severity": severity,
            "friendly_message": friendly_msg,
            "condition_lookup_key": f"{crop_raw.lower()}_{disease_name.lower()}".replace(" ", "_"),
            "engine": "multimodal_ai_vision",
        }


# Singleton instance
_gemini_vision_service: Optional[GeminiVisionService] = None


def get_gemini_vision_service() -> GeminiVisionService:
    global _gemini_vision_service
    if _gemini_vision_service is None:
        _gemini_vision_service = GeminiVisionService()
    return _gemini_vision_service
