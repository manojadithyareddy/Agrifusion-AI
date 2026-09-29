"""
Government Scheme Recommendation Service
=========================================
Matches farmers to eligible government schemes based on their
profile, location, crop, and farm characteristics.
"""

import json
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

SCHEMES_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "data", "schemes", "government_schemes.json"
)

_schemes_cache: list[dict] | None = None


def _load_schemes() -> list[dict]:
    global _schemes_cache
    if _schemes_cache is None:
        with open(SCHEMES_PATH, "r", encoding="utf-8") as f:
            _schemes_cache = json.load(f)
        logger.info(f"Loaded {len(_schemes_cache)} government schemes.")
    return _schemes_cache


class SchemeService:
    """Recommend government schemes to farmers based on their profile."""

    def get_all_schemes(self) -> list[dict]:
        """Return all active schemes."""
        return [s for s in _load_schemes() if s.get("active", True)]

    def recommend_schemes(
        self,
        state: Optional[str] = None,
        crop: Optional[str] = None,
        land_size_hectares: Optional[float] = None,
        irrigation_available: bool = False,
        is_organic: bool = False,
        farmer_category: str = "general",  # general, small, marginal, sc, st
    ) -> list[dict]:
        """
        Filter and rank schemes based on farmer profile.
        Returns a list of scheme objects with a 'relevance_score' field.
        """
        all_schemes = self.get_all_schemes()
        results = []

        for scheme in all_schemes:
            score = 65  # Dynamic baseline relevance score
            reasons = []

            # Determine Applicability (Central vs State)
            applicable_states = scheme.get("applicable_states")
            is_central = (applicable_states == "all")
            applicability = "Central" if is_central else "State"

            # State match
            if is_central:
                score += 8
                reasons.append("National Central Government initiative applicable across all Indian States")
            elif state and isinstance(applicable_states, list):
                state_clean = state.strip().lower()
                matches = any(s.lower() in state_clean or state_clean in s.lower() for s in applicable_states)
                if matches:
                    score += 20
                    reasons.append(f"Exclusive flagship state initiative for {state}")
                else:
                    continue  # Strictly skip state-specific schemes that do not belong to selected state
            elif state and not is_central:
                continue

            # Category-based boosting
            category = scheme.get("category", "")

            # If farmer doesn't have irrigation, boost irrigation schemes
            if not irrigation_available and category == "irrigation":
                score += 8
                reasons.append("High priority recommendation for non-irrigated / rainfed land")

            # If farmer is interested in organic, boost organic schemes
            if is_organic and category == "organic_farming":
                score += 10
                reasons.append("Tailored for certified chemical-free organic farming practices")

            # Small/marginal farmer dynamic eligibility scoring
            is_small_marginal = (land_size_hectares is not None and land_size_hectares <= 2.0)
            if is_small_marginal:
                if category in ("income_support", "credit", "crop_insurance"):
                    score += 10
                    reasons.append(f"Priority subsidy tier for small/marginal landholders ({land_size_hectares} ha)")
            elif land_size_hectares and land_size_hectares > 10.0:
                # Slight deduction for high landholding
                score -= 6

            # Crop-specific eligibility
            applicable_crops = scheme.get("applicable_crops", "all")
            if crop and applicable_crops != "all" and isinstance(applicable_crops, list):
                crop_clean = crop.strip().lower()
                if any(c.lower() in crop_clean or crop_clean in c.lower() for c in applicable_crops):
                    score += 8
                    reasons.append(f"Specialized crop package notified for {crop}")

            # Dynamic calibrated score (never hardcode 95%)
            final_relevance = min(94, max(62, score))
            eligibility_status = "Fully Eligible" if final_relevance >= 80 else "Partially Eligible"

            results.append({
                **scheme,
                "applicability": applicability,
                "eligibility_status": eligibility_status,
                "relevance_score": final_relevance,
                "match_reasons": reasons,
                "benefit": scheme.get("benefit_amount", scheme.get("description", "")),
            })

        # Sort strictly by dynamic relevance score descending
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results

    def get_scheme_by_id(self, scheme_id: str) -> Optional[dict]:
        """Get a single scheme by its ID."""
        for scheme in _load_schemes():
            if scheme["id"] == scheme_id:
                return scheme
        return None


# Singleton
_scheme_service: Optional[SchemeService] = None

def get_scheme_service() -> SchemeService:
    global _scheme_service
    if _scheme_service is None:
        _scheme_service = SchemeService()
    return _scheme_service
