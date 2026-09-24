import pytest
from app.services.schemes import get_scheme_service

def test_get_all_schemes():
    service = get_scheme_service()
    schemes = service.get_all_schemes()
    assert len(schemes) > 0
    assert any(s["id"] == "pmkisan" for s in schemes)

def test_recommend_schemes_basic():
    service = get_scheme_service()
    # General recommendation without specific filters
    recs = service.recommend_schemes()
    assert len(recs) > 0
    assert all("relevance_score" in s for s in recs)

def test_recommend_schemes_irrigation_boost():
    service = get_scheme_service()
    
    # Farmer WITH irrigation
    recs_with = service.recommend_schemes(irrigation_available=True)
    pmksy_with = next((s for s in recs_with if s["id"] == "pmksy"), None)
    
    # Farmer WITHOUT irrigation
    recs_without = service.recommend_schemes(irrigation_available=False)
    pmksy_without = next((s for s in recs_without if s["id"] == "pmksy"), None)
    
    # Scheme should be scored higher for someone without irrigation
    assert pmksy_without is not None
    assert pmksy_with is not None
    assert pmksy_without["relevance_score"] > pmksy_with["relevance_score"]

def test_recommend_schemes_organic_boost():
    service = get_scheme_service()
    recs_organic = service.recommend_schemes(is_organic=True)
    pkvy = next((s for s in recs_organic if s["id"] == "pkvy"), None)
    assert pkvy is not None
    # Organic interest should give a high relevance score to PKVY (organic farming scheme)
    assert pkvy["relevance_score"] > 60

def test_get_scheme_by_id():
    service = get_scheme_service()
    scheme = service.get_scheme_by_id("pmkisan")
    assert scheme is not None
    assert scheme["name"] == "PM-KISAN"
    
    missing = service.get_scheme_by_id("invalid_id_123")
    assert missing is None
