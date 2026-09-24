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
            score = 50  # Base relevance score
            reasons = []

            # State match
            applicable_states = scheme.get("applicable_states")
            if applicable_states == "all":
                score += 10
            elif state and isinstance(applicable_states, list):
                state_clean = state.strip().lower()
                matches = any(s.lower() in state_clean or state_clean in s.lower() for s in applicable_states)
                if matches:
                    score += 30
                    reasons.append(f"Exclusive flagship state initiative for {state}")
                else:
                    continue  # Skip state-specific schemes not matching
            elif state and applicable_states != "all":
                continue

            # Category-based boosting
            category = scheme.get("category", "")

            # If farmer doesn't have irrigation, boost irrigation schemes
            if not irrigation_available and category == "irrigation":
                score += 30
                reasons.append("You don't have irrigation — this scheme can help")

            # If farmer is interested in organic, boost organic schemes
            if is_organic and category == "organic_farming":
                score += 30
                reasons.append("Relevant for your organic farming interest")

            # Small/marginal farmer boosting
            if land_size_hectares and land_size_hectares <= 2:
                if category in ("income_support", "credit", "crop_insurance"):
                    score += 15
                    reasons.append("Priority for small/marginal farmers")

            # Universal schemes get a small boost
            if category in ("income_support", "crop_insurance", "credit"):
                score += 10
                reasons.append("Recommended for all farmers")

            # Soil health card is always relevant
            if category == "soil_health":
                score += 15
                reasons.append("Essential for optimizing fertilizer use")

            # Market access schemes
            if category == "market_access":
                score += 10
                reasons.append("Helps get better prices for your produce")

            results.append({
                **scheme,
                "relevance_score": min(score, 100),
                "match_reasons": reasons,
            })

        # Sort by relevance
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
