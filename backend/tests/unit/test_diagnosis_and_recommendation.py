import io
import pytest
import numpy as np
from PIL import Image

from app.services.prediction import PredictionService
from app.services.assistant_vision_engine import AssistantVisionEngine
from app.services.schemes import get_scheme_service


# ─────────────────────────────────────────────────────────────
# 1. AI Assistant Diagnosis Pipeline Tests
# ─────────────────────────────────────────────────────────────

def test_vision_engine_request_and_image_id_propagation():
    """Verify request_id and unique image_id are correctly returned and tracked."""
    engine = AssistantVisionEngine()
    
    # Create simple test image
    img = Image.new("RGB", (200, 200), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()
    
    req_id = "test_req_abc123"
    result = engine.analyze_image_bytes(img_bytes, filename="test.jpg", request_id=req_id)
    
    assert result["request_id"] == req_id
    assert result["image_id"] == f"{req_id}_img_1"


def test_vision_engine_banana_never_classifies_as_cotton():
    """A Banana bunch / elongated paddle leaf must never be identified as Cotton."""
    engine = AssistantVisionEngine()
    
    # Create an elongated green paddle leaf / bunch shape (simulated banana characteristics)
    img_arr = np.zeros((400, 300, 3), dtype=np.uint8)
    # Green banana leaf in center
    img_arr[50:350, 100:200, 1] = 180  # high green
    img_arr[50:350, 100:200, 0] = 50   # low red
    img_arr[50:350, 100:200, 2] = 40   # low blue
    
    img = Image.fromarray(img_arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()
    
    result = engine.analyze_image_bytes(img_bytes, filename="unknown_photo.jpg")
    
    # Must NOT be Cotton
    crop_name = result["crop"]["name"] if isinstance(result.get("crop"), dict) else str(result.get("crop", ""))
    assert crop_name.lower() != "cotton", "Banana / elongated morphology must never classify as Cotton"


def test_vision_engine_low_confidence_fallback():
    """When crop evidence is insufficient (<0.70), return UNABLE_TO_IDENTIFY_CROP with 0.0 confidence."""
    engine = AssistantVisionEngine()
    
    # Pure dark/black image with zero morphological features
    img = Image.new("RGB", (100, 100), color=(10, 10, 10))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()
    
    result = engine.analyze_image_bytes(img_bytes, filename="blank_shot.jpg")
    
    assert result["status"] == "UNABLE_TO_IDENTIFY_CROP"
    assert "Unable to identify crop" in result["crop"]["name"]
    assert result["crop_confidence"] == 0.0
    assert result["disease_confidence"] == 0.0


# ─────────────────────────────────────────────────────────────
# 2. Crop Recommendation Engine (India-Wide & Specific Zones)
# ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_crop_recommendation_distinct_districts():
    """Belgaum, Hassan, and Guntur must produce genuinely distinct crop recommendations."""
    service = PredictionService()
    
    # 1. Belgaum (Karnataka) - Northern Transition Zone (Sugarcane, Maize, Soybean)
    rec_belgaum = await service.get_crop_recommendation(
        state="Karnataka",
        district="Belgaum",
        soilType="Black",
        season="Kharif"
    )
    crops_belgaum = [r["crop"] for r in rec_belgaum["recommendations"]]
    
    # 2. Hassan (Karnataka) - Southern Transition / Malnad (Potato, Maize, Coconut)
    rec_hassan = await service.get_crop_recommendation(
        state="Karnataka",
        district="Hassan",
        soilType="Red",
        season="Kharif"
    )
    crops_hassan = [r["crop"] for r in rec_hassan["recommendations"]]
    
    # 3. Guntur (Andhra Pradesh) - Krishna Delta Commercial (Chilli, Cotton, Rice)
    rec_guntur = await service.get_crop_recommendation(
        state="Andhra Pradesh",
        district="Guntur",
        soilType="Black",
        season="Kharif"
    )
    crops_guntur = [r["crop"] for r in rec_guntur["recommendations"]]
    
    # Verifications
    assert len(crops_belgaum) == 3
    assert len(crops_hassan) == 3
    assert len(crops_guntur) == 3
    
    # Top crops must be distinct across the districts
    assert crops_belgaum != crops_hassan, f"Belgaum {crops_belgaum} and Hassan {crops_hassan} must not be identical"
    assert crops_hassan != crops_guntur, f"Hassan {crops_hassan} and Guntur {crops_guntur} must not be identical"
    
    # Hassan must recommend Potato or Coconut and strictly omit Cotton
    assert "Potato" in crops_hassan or "Coconut" in crops_hassan
    assert "Cotton" not in crops_hassan, "Cotton is agronomically unsuitable for Hassan's agro-climatic zone"
    
    # Guntur must recommend Chilli or Cotton
    assert "Chilli" in crops_guntur or "Cotton" in crops_guntur


@pytest.mark.asyncio
async def test_crop_recommendation_auto_mode_top_3():
    """Auto-recommend mode must return exactly top 3 crops."""
    service = PredictionService()
    rec = await service.get_crop_recommendation(
        state="Maharashtra",
        district="Pune",
        soilType="Black",
        season="Kharif",
        targetCrop=""
    )
    assert len(rec["recommendations"]) == 3
    assert rec["fallback_level"] == "District Specific (Verified ICAR Sub-Zone)"


@pytest.mark.asyncio
async def test_crop_recommendation_target_crop_mode_exactly_1():
    """Target crop mode must return exactly 1 crop matching targetCrop."""
    service = PredictionService()
    rec = await service.get_crop_recommendation(
        state="Karnataka",
        district="Belgaum",
        soilType="Black",
        season="Kharif",
        targetCrop="Sugarcane"
    )
    assert len(rec["recommendations"]) == 1
    assert rec["recommendations"][0]["crop"] == "Sugarcane"
    assert rec["target_crop_assessment"] is not None


@pytest.mark.asyncio
async def test_crop_recommendation_unmapped_district_documented_fallback():
    """Unmapped district must use State Agro-Climatic Zone (Documented Fallback)."""
    service = PredictionService()
    rec = await service.get_crop_recommendation(
        state="Odisha",
        district="NonExistentDistrictName123",
        soilType="Alluvial",
        season="Kharif"
    )
    assert len(rec["recommendations"]) == 3
    assert rec["fallback_level"] == "State Agro-Climatic Zone (Documented Fallback)"


# ─────────────────────────────────────────────────────────────
# 3. Market Intelligence & Government Schemes
# ─────────────────────────────────────────────────────────────

def test_schemes_state_filtering_and_dynamic_scoring():
    """Karnataka farmer should see Raitha Siri and not Telangana Rythu Bandhu; relevance dynamic."""
    scheme_service = get_scheme_service()
    
    karnataka_schemes = scheme_service.recommend_schemes(state="Karnataka", land_size_hectares=1.5)
    
    # Verify state scheme inclusion and exclusion
    scheme_ids = [s["id"] for s in karnataka_schemes]
    assert "karnataka_raitha_siri" in scheme_ids or "karnataka_kisan_samman" in scheme_ids
    assert "telangana_rythu_bandhu" not in scheme_ids
    
    # Verify relevance scores are not statically hardcoded to 95
    scores = [s["relevance_score"] for s in karnataka_schemes]
    assert not all(score == 95 for score in scores), "Scores must be dynamically computed"
    
    # Verify applicability tag
    for s in karnataka_schemes:
        assert s["applicability"] in ["Central", "State"]
        assert s["eligibility_status"] in ["Fully Eligible", "Partially Eligible"]
