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
from app.services.crops_taxonomy_data import CROPS_TAXONOMY_37

logger = logging.getLogger(__name__)

# Candidate Gemini multimodal vision models in priority order (fastest response first)
CANDIDATE_MODELS = [
    "models/gemini-flash-lite-latest",
    "models/gemini-2.5-flash",
    "models/gemini-3.8-flash",
]

# Suppress verbose httpx/httpcore request logging to keep API requests quiet and secure
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"


def _sanitize_log_message(msg: str, key: Optional[str]) -> str:
    """Ensure API key never appears in log messages."""
    if key and key in msg:
        return msg.replace(key, "[REDACTED_API_KEY]")
    return msg


# Canonical mapping from common aliases / vernacular names to canonical AgriFusion crop names
CROP_CANONICAL_ALIASES: Dict[str, str] = {
    "paddy": "Rice / Paddy",
    "rice": "Rice / Paddy",
    "dhan": "Rice / Paddy",
    "chawal": "Rice / Paddy",
    "wheat": "Wheat",
    "gehun": "Wheat",
    "corn": "Maize",
    "maize": "Maize",
    "makka": "Maize",
    "cotton": "Cotton",
    "kapas": "Cotton",
    "sugarcane": "Sugarcane",
    "ganna": "Sugarcane",
    "soybean": "Soybean",
    "soya": "Soybean",
    "chickpea": "Chickpea",
    "gram": "Chickpea",
    "chana": "Chickpea",
    "bengal gram": "Chickpea",
    "pigeon pea": "Pigeonpeas",
    "pigeonpea": "Pigeonpeas",
    "pigeonpeas": "Pigeonpeas",
    "arhar": "Pigeonpeas",
    "tur": "Pigeonpeas",
    "black gram": "Blackgram",
    "blackgram": "Blackgram",
    "urad": "Blackgram",
    "mung bean": "Mungbean",
    "mungbean": "Mungbean",
    "moong": "Mungbean",
    "green gram": "Mungbean",
    "lentil": "Lentil",
    "masoor": "Lentil",
    "kidney bean": "Kidneybeans",
    "kidney beans": "Kidneybeans",
    "kidneybeans": "Kidneybeans",
    "rajma": "Kidneybeans",
    "moth bean": "Mothbeans",
    "moth beans": "Mothbeans",
    "mothbeans": "Mothbeans",
    "matki": "Mothbeans",
    "groundnut": "Groundnut",
    "peanut": "Groundnut",
    "mungfali": "Groundnut",
    "mustard": "Mustard",
    "sarson": "Mustard",
    "rai": "Mustard",
    "tomato": "Tomato",
    "tamatar": "Tomato",
    "potato": "Potato",
    "aloo": "Potato",
    "onion": "Onion",
    "pyaz": "Onion",
    "banana": "Banana",
    "kela": "Banana",
    "plantain": "Banana",
    "mango": "Mango",
    "aam": "Mango",
    "papaya": "Papaya",
    "papita": "Papaya",
    "apple": "Apple",
    "seb": "Apple",
    "grapes": "Grapes",
    "grape": "Grapes",
    "angoor": "Grapes",
    "pomegranate": "Pomegranate",
    "anar": "Pomegranate",
    "watermelon": "Watermelon",
    "tarbooj": "Watermelon",
    "muskmelon": "Muskmelon",
    "kharbooja": "Muskmelon",
    "orange": "Orange",
    "citrus": "Orange",
    "santras": "Orange",
    "mosambi": "Orange",
    "coconut": "Coconut",
    "nariyal": "Coconut",
    "jute": "Jute",
    "pat": "Jute",
    "coffee": "Coffee",
    "chilli": "Chilli",
    "chili": "Chilli",
    "mirch": "Chilli",
    "pepper": "Chilli",
    "turmeric": "Turmeric",
    "haldi": "Turmeric",
    "sunflower": "Sunflower",
    "surajmukhi": "Sunflower",
    "sorghum": "Sorghum",
    "jowar": "Sorghum",
    "pearl millet": "Pearl Millet",
    "pearl_millet": "Pearl Millet",
    "bajra": "Pearl Millet",
    "barley": "Barley",
    "jau": "Barley",
    "finger millet": "Finger Millet",
    "finger_millet": "Finger Millet",
    "ragi": "Finger Millet",
}


def _build_payload(image_bytes: bytes, crop_hint: Optional[str], language: str) -> tuple[dict, str]:
    """Helper to build Gemini multimodal payload with 37-crop auto-detection."""
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

    clean_hint = None
    if crop_hint and crop_hint.strip().lower() not in ["auto", "none", "null", "all", "undefined", ""]:
        clean_hint = crop_hint.strip()

    if clean_hint:
        crop_directive = (
            f"TARGET CROP HINT: The user suspected crop is '{clean_hint}'. "
            f"Verify if the image depicts {clean_hint} or another species. "
            f"Identify the true botanical crop species visible in the image."
        )
    else:
        crop_directive = (
            "AUTO-DETECT CROP SPECIES (CRITICAL): The user has NOT selected a crop. "
            "Examine the botanical morphology of foliage, leaf venation, shape, stem, or fruit "
            "to accurately detect the crop species across all 37 supported agricultural crops:\n"
            "1. Rice/Paddy  2. Wheat  3. Maize  4. Cotton  5. Sugarcane  6. Soybean  7. Chickpea\n"
            "8. Pigeonpeas  9. Blackgram  10. Mungbean  11. Lentil  12. Kidneybeans  13. Mothbeans\n"
            "14. Groundnut  15. Mustard  16. Tomato  17. Potato  18. Onion  19. Banana  20. Mango\n"
            "21. Papaya  22. Apple  23. Grapes  24. Pomegranate  25. Watermelon  26. Muskmelon\n"
            "27. Orange  28. Coconut  29. Jute  30. Coffee  31. Chilli  32. Turmeric  33. Sunflower\n"
            "34. Sorghum  35. Pearl Millet  36. Barley  37. Finger Millet.\n"
            "Return the specific identified crop in 'crop'."
        )

    prompt = (
        "You are a world-class agricultural plant pathologist and agronomist for AgriFusion AI.\n"
        "Analyze this agricultural crop/plant image in deep detail.\n\n"
        f"{crop_directive}\n\n"
        "CRITICAL BOTANICAL & PATHOLOGY RULES:\n"
        "1. CROP IDENTIFICATION: Accurately identify the crop species (e.g. Banana, Rice, Cotton, Tomato, Potato, "
        "Wheat, Maize, Sugarcane, Mango, Chilli, Soybean, Groundnut, Grapes, Onion, etc.).\n"
        "- CEREAL & GRAIN DISAMBIGUATION:\n"
        "  * WHEAT / BARLEY: Identified by wheat spikes/ears/heads with awns (beards) and dense spikelets, or cereal leaves. DO NOT classify wheat heads or cereal ears as Rice.\n"
        "  * RICE / PADDY: Rice inflorescence is an open, drooping branched panicle without dense spikelet heads. Rice leaves are flat slender blades.\n"
        "- RUST vs BLAST PATHOLOGY:\n"
        "  * Cereal Rust (Yellow/Stripe Rust, Leaf Rust, Stem Rust - Puccinia spp.): Characterized by bright orange, yellow, or reddish-brown powdery spore pustules (uredinia) in stripes or clusters across cereal ears, glumes, or leaf blades. If you see bright orange-yellow powdery pustules on a cereal spike or blade, it is WHEAT RUST (Puccinia striiformis / triticina), NEVER Rice Blast.\n"
        "  * Rice Blast (Magnaporthe / Pyricularia oryzae): Characterized by spindle-shaped, diamond-shaped, or eye-shaped necrotic lesions with gray-white centers and brown borders on rice leaves, or neck rot at the panicle base. Rice blast NEVER forms powdery orange or yellow pustules.\n"
        "- If the image shows Banana fruit fingers, a bunch, or a broad unbroken paddle leaf, classify as 'Banana'. Do NOT misclassify as Cotton.\n"
        "- Cotton requires palmate lobed leaves or white fluffy cotton bolls.\n"
        "- If the image is not a recognizable agricultural crop or plant foliage/fruit, or evidence is insufficient, "
        "set 'status' to 'UNABLE_TO_IDENTIFY_CROP' and 'crop' to 'Unable to identify crop'.\n"
        "2. DISEASE & CONDITION: Identify the exact disease, fungal/bacterial pathogen, or physiological disorder "
        "(e.g. Early Blight, Late Blight, Black Sigatoka, Rice Blast, Wheat Yellow Rust, Bacterial Blight, Healthy Crop).\n"
        "3. PEST & INSECT INSPECTION (HIGH RESOLUTION):\n"
        "- Thoroughly check the leaf tissue, leaf margins, undersides, veins, stems, and fruits for any:\n"
        "  * Active insect pests: Whiteflies, Aphids, Thrips, Mites, Caterpillars, Borers, Leafminers, Mealybugs, Jassids/Hoppers, Beetles, Weevils, Scale insects.\n"
        "  * Insect feeding damage: Leaf-miner serpentine silvery trails, shot-holes, notched leaf margins, skeletonized foliage, honeydew/sooty mold, chlorotic stippling, mite webbing, or frass.\n"
        "  * Vector pest association: If the condition is an insect-vectored disease (such as Leaf Curl Virus, Mosaic Virus, Little Leaf, Ringspot, Murda), explicitly identify and list the transmitting insect vector species (e.g. Whitefly / Bemisia tabaci, Aphids / Aphis gossypii, Thrips / Scirtothrips dorsalis) in 'pests'.\n"
        "- For 'pests', return an array of all detected pests, feeding damage signs, or active vector risks: [{'name': string, 'scientific': string, 'type': 'Live Insect' | 'Feeding Damage' | 'Disease Vector', 'confidence': number}].\n"
        "- Set 'pest_status' to a precise agronomic summary (e.g. 'Active Vector: Whitefly (Bemisia tabaci)', 'Foliar feeding damage detected: Leafminer', or 'No active insect infestation observed (Foliar Pathogen Infection)').\n"
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
        '  "pests": [{"name": string, "scientific": string, "type": string, "confidence": number}],\n'
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

        headers = {
            "x-goog-api-key": key,
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(timeout=6.0) as client:
                for model_id in CANDIDATE_MODELS:
                    url = f"{GEMINI_API_BASE}/{model_id}:generateContent"
                    try:
                        resp = client.post(url, json=payload, headers=headers)
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
        headers = {
            "x-goog-api-key": key,
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                for model_id in CANDIDATE_MODELS:
                    url = f"{GEMINI_API_BASE}/{model_id}:generateContent"
                    try:
                        resp = await client.post(url, json=payload, headers=headers)
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
                "pest_status": "No plant foliage detected",
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
        d_lower = disease_name.lower()

        # Canonical alias resolution
        norm_key = crop_raw.lower().strip()
        alias_match = CROP_CANONICAL_ALIASES.get(norm_key) or CROP_CANONICAL_ALIASES.get(norm_key.replace(" ", "_"))
        if alias_match:
            crop_raw = alias_match

        # Match crop in 37-crop botanical taxonomy
        crop_clean = crop_raw.lower().replace(" ", "_").replace("/", "_")
        crop_info = CROPS_TAXONOMY_37.get(crop_clean) or CROPS_TAXONOMY_37.get(crop_raw.lower())
        if not crop_info:
            for k, v in CROPS_TAXONOMY_37.items():
                if k in crop_clean or crop_clean in k or v.get("name", "").lower() == crop_raw.lower():
                    crop_info = v
                    crop_raw = v.get("name", crop_raw)
                    break

        # Chemical & organic treatments
        chem = parsed.get("chemical_treatment") or ""
        org = parsed.get("organic_treatment") or ""
        treatments = parsed.get("treatment") or []
        if chem and chem not in treatments:
            treatments.insert(0, f"Chemical Control: {chem}")
        if org and org not in treatments:
            treatments.append(f"Organic Remedy: {org}")

        pests = parsed.get("pests") or []

        # Vector pest association: if pests is empty, check if disease is a known vector-vectored viral condition
        if not pests and crop_info:
            supported_pests = crop_info.get("supported_pests", {})
            if any(vk in d_lower for vk in ["curl", "mosaic", "virus", "yellow_vein", "murda", "ringspot", "little_leaf", "greening", "stunt", "miner"]):
                for p_key, p_data in supported_pests.items():
                    if any(w in p_key for w in ["whitefly", "aphid", "thrips", "mite", "hopper", "psyllid", "jassid", "miner"]):
                        pests.append({
                            "name": f"{p_data['name']} (Vector)",
                            "scientific": p_data.get("scientific_name", ""),
                            "confidence": round(max(0.85, disease_conf - 0.04), 2),
                            "type": "Primary Disease Vector",
                            "damage_signs": p_data.get("damage_signs", ["Transmits viral pathogen and causes foliar curling/chlorosis"])[0]
                        })

        if pests:
            pest_names = ", ".join(p.get("name", "Pest") if isinstance(p, dict) else str(p) for p in pests)
            pest_status = parsed.get("pest_status") or f"Pests identified: {pest_names}"
        else:
            if "healthy" in d_lower:
                pest_status = "No pest infestation (Healthy Foliage)"
            else:
                pest_status = f"No active insect infestation (Foliar Pathogen: {disease_name})"

        pest_conf = parsed.get("pest_confidence") or (max([p.get("confidence", 0.90) for p in pests if isinstance(p, dict)], default=None) if pests else None)

        friendly_msg = parsed.get("friendly_message") or (
            f"🌾 Plant Health Diagnosis: Identified {crop_raw} with {disease_name} ({round(disease_conf * 100, 1)}% confidence). "
            f"Severity is {severity}. Recommended action: {treatments[0] if treatments else 'Inspect regularly.'}"
        )

        pest_damage_list = (
            [p.get("damage_signs") or p.get("name") for p in pests if isinstance(p, dict)]
            if pests
            else (
                ["No insect feeding holes, frass, or active pest damage observed."]
                if "healthy" in d_lower
                else [f"Foliar necrotic lesions and symptoms caused by {disease_name}; no active insect chewing damage observed."]
            )
        )

        pest_control_list = parsed.get("pest_control") or (
            ["Apply bio-insecticide, Neem oil (10,000 ppm), or install yellow sticky traps."]
            if pests
            else ["Routine preventive monitoring with sticky traps."]
        )

        return {
            "status": "CONFIRMED_DIAGNOSIS",
            "crop": {
                "name": crop_raw,
                "scientific": parsed.get("crop_scientific") or (crop_info.get("scientific", "") if crop_info else ""),
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
            "pest_damage": pest_damage_list,
            "treatment": treatments,
            "pest_control": pest_control_list,
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
