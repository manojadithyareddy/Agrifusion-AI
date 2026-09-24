import pytest
from app.services.soil_health import get_soil_health_service

def test_classify_nutrient():
    service = get_soil_health_service()
    assert service.classify_nutrient("nitrogen", 100) == "low"
    assert service.classify_nutrient("nitrogen", 200) == "medium"
    assert service.classify_nutrient("nitrogen", 300) == "high"
    assert service.classify_nutrient("ph", 5.5) == "acidic"
    assert service.classify_nutrient("ph", 7.0) == "neutral"
    assert service.classify_nutrient("ph", 8.0) == "alkaline"

def test_generate_report_good_health():
    service = get_soil_health_service()
    report = service.generate_report(
        nitrogen=250,      # medium
        phosphorus=20,     # medium
        potassium=200,     # medium
        ph=6.8             # neutral
    )
    
    assert report["health_grade"] == "Good"
    assert report["health_score"] == 100
    assert len(report["deficiencies"]) == 0
    assert len(report["fertilizer_recommendations"]) == 0

def test_generate_report_with_deficiencies():
    service = get_soil_health_service()
    report = service.generate_report(
        nitrogen=90,       # low
        phosphorus=20,     # medium
        potassium=200,     # medium
        ph=6.8,            # neutral
        zinc=0.4           # low
    )
    
    assert report["health_score"] < 100
    assert "nitrogen" in report["deficiencies"]
    assert "zinc" in report["deficiencies"]
    assert len(report["fertilizer_recommendations"]) == 2
    
    # Check that recommendations target the specific deficiencies
    rec_nutrients = [r["nutrient"] for r in report["fertilizer_recommendations"]]
    assert "nitrogen" in rec_nutrients
    assert "zinc" in rec_nutrients

def test_generate_report_acidic_ph():
    service = get_soil_health_service()
    report = service.generate_report(
        nitrogen=250,
        phosphorus=20,
        potassium=200,
        ph=5.0             # acidic
    )
    
    assert report["health_score"] < 100
    assert any("acidic" in advice.lower() for advice in report["ph_advice"])
    assert any("lime" in advice.lower() for advice in report["ph_advice"])
