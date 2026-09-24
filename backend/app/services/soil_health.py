"""
Soil Health Report Service
==========================
Generates comprehensive soil health reports with nutrient analysis,
deficiency detection, and fertilizer recommendations.
"""

import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# ICAR recommended nutrient ranges (kg/ha)
NUTRIENT_RANGES = {
    "nitrogen": {"low": (0, 140), "medium": (140, 280), "high": (280, 500), "unit": "kg/ha"},
    "phosphorus": {"low": (0, 10), "medium": (10, 25), "high": (25, 200), "unit": "kg/ha"},
    "potassium": {"low": (0, 108), "medium": (108, 280), "high": (280, 500), "unit": "kg/ha"},
    "ph": {"acidic": (0, 6.0), "neutral": (6.0, 7.5), "alkaline": (7.5, 14.0), "unit": ""},
    "organic_carbon": {"low": (0, 0.5), "medium": (0.5, 0.75), "high": (0.75, 5.0), "unit": "%"},
    "sulphur": {"low": (0, 10), "medium": (10, 20), "high": (20, 100), "unit": "ppm"},
    "zinc": {"low": (0, 0.6), "medium": (0.6, 1.2), "high": (1.2, 50.0), "unit": "ppm"},
    "iron": {"low": (0, 4.5), "medium": (4.5, 9.0), "high": (9.0, 100.0), "unit": "ppm"},
    "boron": {"low": (0, 0.5), "medium": (0.5, 1.0), "high": (1.0, 50.0), "unit": "ppm"},
}

# General fertilizer recommendations per nutrient deficiency
FERTILIZER_MAP = {
    "nitrogen": {
        "deficiency": "Low nitrogen reduces plant growth and leaf color (chlorosis).",
        "fertilizers": [
            {"name": "Urea", "dose": "60-80 kg/acre", "method": "Split application: 50% basal + 25% at tillering + 25% at panicle"},
            {"name": "DAP (Di-ammonium Phosphate)", "dose": "50 kg/acre basal", "method": "Apply at sowing"},
            {"name": "Vermicompost", "dose": "2-3 tonnes/acre", "method": "Apply before sowing for organic option"},
        ]
    },
    "phosphorus": {
        "deficiency": "Low phosphorus stunts root development and delays maturity.",
        "fertilizers": [
            {"name": "Single Super Phosphate (SSP)", "dose": "100 kg/acre", "method": "Apply as basal dose at sowing"},
            {"name": "DAP", "dose": "50 kg/acre", "method": "Apply at sowing"},
            {"name": "Rock Phosphate", "dose": "200 kg/acre", "method": "For acidic soils; apply before sowing"},
        ]
    },
    "potassium": {
        "deficiency": "Low potassium weakens disease resistance and reduces grain quality.",
        "fertilizers": [
            {"name": "Muriate of Potash (MOP)", "dose": "30-40 kg/acre", "method": "Basal application"},
            {"name": "Sulphate of Potash (SOP)", "dose": "40-50 kg/acre", "method": "Preferred for fruits and vegetables"},
        ]
    },
    "zinc": {
        "deficiency": "Zinc deficiency causes 'khaira' disease in rice and stunted growth.",
        "fertilizers": [
            {"name": "Zinc Sulphate (ZnSO4)", "dose": "10 kg/acre", "method": "Apply as basal or foliar spray (0.5% solution)"},
        ]
    },
    "sulphur": {
        "deficiency": "Sulphur deficiency reduces oil content in oilseeds and protein in pulses.",
        "fertilizers": [
            {"name": "Gypsum", "dose": "100 kg/acre", "method": "Apply at sowing, especially for groundnut and mustard"},
            {"name": "Elemental Sulphur", "dose": "10-15 kg/acre", "method": "Apply before sowing"},
        ]
    },
    "iron": {
        "deficiency": "Iron deficiency causes interveinal chlorosis (yellowing between veins) in young leaves.",
        "fertilizers": [
            {"name": "Ferrous Sulphate", "dose": "20 kg/acre", "method": "Soil application or 1% foliar spray"},
        ]
    },
    "boron": {
        "deficiency": "Boron deficiency causes hollow stems, poor fruit set, and cracked fruits.",
        "fertilizers": [
            {"name": "Borax", "dose": "4-5 kg/acre", "method": "Soil application at sowing or 0.2% foliar spray"},
        ]
    },
}


class SoilHealthService:
    """Generate comprehensive soil health reports."""

    def classify_nutrient(self, nutrient: str, value: float) -> str:
        """Classify a nutrient value as low/medium/high."""
        ranges = NUTRIENT_RANGES.get(nutrient, {})
        for level, (low, high) in ranges.items():
            if level == "unit":
                continue
            if low <= value < high:
                return level
        return "unknown"

    def generate_report(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        ph: float,
        organic_carbon: Optional[float] = None,
        sulphur: Optional[float] = None,
        zinc: Optional[float] = None,
        iron: Optional[float] = None,
        boron: Optional[float] = None,
        crop: Optional[str] = None,
        soil_type: Optional[str] = None,
    ) -> dict:
        """Generate a full soil health report with recommendations."""

        # Classify all nutrients
        classifications = {
            "nitrogen": {"value": nitrogen, "status": self.classify_nutrient("nitrogen", nitrogen), "unit": "kg/ha"},
            "phosphorus": {"value": phosphorus, "status": self.classify_nutrient("phosphorus", phosphorus), "unit": "kg/ha"},
            "potassium": {"value": potassium, "status": self.classify_nutrient("potassium", potassium), "unit": "kg/ha"},
            "ph": {"value": ph, "status": self.classify_nutrient("ph", ph), "unit": ""},
        }

        if organic_carbon is not None:
            classifications["organic_carbon"] = {"value": organic_carbon, "status": self.classify_nutrient("organic_carbon", organic_carbon), "unit": "%"}
        if sulphur is not None:
            classifications["sulphur"] = {"value": sulphur, "status": self.classify_nutrient("sulphur", sulphur), "unit": "ppm"}
        if zinc is not None:
            classifications["zinc"] = {"value": zinc, "status": self.classify_nutrient("zinc", zinc), "unit": "ppm"}
        if iron is not None:
            classifications["iron"] = {"value": iron, "status": self.classify_nutrient("iron", iron), "unit": "ppm"}
        if boron is not None:
            classifications["boron"] = {"value": boron, "status": self.classify_nutrient("boron", boron), "unit": "ppm"}

        # Identify deficiencies
        deficiencies = []
        for nutrient, info in classifications.items():
            if info["status"] == "low":
                deficiencies.append(nutrient)

        # Generate fertilizer recommendations for deficiencies
        fertilizer_recommendations = []
        for nutrient in deficiencies:
            if nutrient in FERTILIZER_MAP:
                fert_info = FERTILIZER_MAP[nutrient]
                fertilizer_recommendations.append({
                    "nutrient": nutrient,
                    "issue": fert_info["deficiency"],
                    "recommended_fertilizers": fert_info["fertilizers"],
                })

        # pH-specific advice
        ph_advice = []
        ph_status = classifications["ph"]["status"]
        if ph_status == "acidic":
            ph_advice.append("Soil is acidic. Apply agricultural lime (2-4 tonnes/hectare) to raise pH.")
            ph_advice.append("Acidic soils benefit from dolomite lime which also adds magnesium.")
        elif ph_status == "alkaline":
            ph_advice.append("Soil is alkaline. Apply gypsum (2-3 tonnes/hectare) or elemental sulphur to lower pH.")
            ph_advice.append("Alkaline soils may lock out iron, zinc, and manganese — monitor micronutrients.")

        # Overall health score (0-100)
        health_score = 100
        for nutrient, info in classifications.items():
            if info["status"] == "low":
                health_score -= 15
            elif info["status"] in ("acidic", "alkaline"):
                health_score -= 10
        health_score = max(health_score, 10)

        if health_score >= 80:
            health_grade = "Good"
        elif health_score >= 60:
            health_grade = "Moderate"
        elif health_score >= 40:
            health_grade = "Poor"
        else:
            health_grade = "Critical"

        return {
            "report_id": f"SHR-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "health_score": health_score,
            "health_grade": health_grade,
            "nutrient_analysis": classifications,
            "deficiencies": deficiencies,
            "fertilizer_recommendations": fertilizer_recommendations,
            "ph_advice": ph_advice,
            "general_recommendations": self._general_recs(soil_type, crop),
            "soil_type": soil_type,
            "crop": crop,
            "generated_at": datetime.utcnow().isoformat(),
        }

    def _general_recs(self, soil_type: Optional[str], crop: Optional[str]) -> list[str]:
        """Generate general soil management recommendations."""
        recs = [
            "Test your soil every 2 years to track nutrient trends.",
            "Maintain organic matter by incorporating crop residues and compost.",
            "Practice crop rotation to prevent nutrient depletion and break pest cycles.",
        ]
        if soil_type:
            st = soil_type.lower()
            if "clay" in st:
                recs.append("Clay soils retain water — avoid over-irrigation and add gypsum to improve drainage.")
            elif "sandy" in st:
                recs.append("Sandy soils drain quickly — use split fertilizer applications and increase organic matter.")
            elif "loam" in st:
                recs.append("Loamy soils are ideal — maintain organic content with cover crops and composting.")
        return recs


# Singleton
_soil_service: Optional[SoilHealthService] = None

def get_soil_health_service() -> SoilHealthService:
    global _soil_service
    if _soil_service is None:
        _soil_service = SoilHealthService()
    return _soil_service
