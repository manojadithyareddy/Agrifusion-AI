"""
Crop Recommendation Inference Engine
=====================================
Loads a trained model + scaler + label_encoder and produces ranked
crop recommendations with explanations.
"""

import os
import json
import glob
import joblib
import logging
import numpy as np
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


class CropRecommendationEngine:
    """Production inference engine for crop recommendation."""
    
    def __init__(self, version: Optional[str] = None):
        """
        Load model artifacts. If version is None, load the latest version.
        """
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.metadata = None
        self.version = version
        self._load_model(version)
    
    def _load_model(self, version: Optional[str] = None):
        """Load the model, scaler, and encoder from disk."""
        if version:
            model_path = os.path.join(MODELS_DIR, f"{version}.joblib")
        else:
            # Find the latest crop_rec model
            pattern = os.path.join(MODELS_DIR, "crop_rec_*.joblib")
            model_files = sorted(
                [f for f in glob.glob(pattern) if "scaler" not in f and "encoder" not in f],
                reverse=True
            )
            if not model_files:
                logger.warning("No trained crop recommendation model found. Inference will use fallback rules.")
                return
            model_path = model_files[0]
            version = os.path.basename(model_path).replace(".joblib", "")
        
        self.version = version
        scaler_path = os.path.join(MODELS_DIR, f"{version}_scaler.joblib")
        encoder_path = os.path.join(MODELS_DIR, f"{version}_encoder.joblib")
        metadata_path = os.path.join(MODELS_DIR, f"{version}_metadata.json")
        
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.label_encoder = joblib.load(encoder_path)
        
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as f:
                self.metadata = json.load(f)
        
        logger.info(f"Loaded crop recommendation model: {version}")
    
    def predict(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float,
        top_k: int = 5,
    ) -> dict:
        """
        Generate ranked crop recommendations.
        
        Returns a dict with:
          - recommendations: list of {crop, suitability_score, confidence, reasons}
          - model_version, data_version, timestamp, input_summary
        """
        if self.model is None:
            return self._fallback_prediction(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall)
        
        features = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        features_scaled = self.scaler.transform(features)
        
        # Get probability for each class
        probabilities = self.model.predict_proba(features_scaled)[0]
        class_names = self.label_encoder.classes_
        
        # Rank by probability
        sorted_indices = np.argsort(probabilities)[::-1][:top_k]
        
        # Feature importance for explanation
        feature_names = ["Nitrogen", "Phosphorus", "Potassium", "Temperature", "Humidity", "pH", "Rainfall"]
        feature_importance = {}
        if self.metadata and "feature_importance" in self.metadata:
            feature_importance = self.metadata["feature_importance"]
        
        recommendations = []
        for idx in sorted_indices:
            crop_name = class_names[idx]
            score = float(probabilities[idx])
            
            if score < 0.01:
                continue  # Skip negligible probabilities
            
            # Generate human-readable reasons
            reasons = self._generate_reasons(
                crop_name, nitrogen, phosphorus, potassium,
                temperature, humidity, ph, rainfall, feature_importance
            )
            
            recommendations.append({
                "crop": crop_name,
                "suitability_score": round(score, 4),
                "confidence": round(score, 4),
                "reasons": reasons,
            })
        
        return {
            "recommendations": recommendations,
            "model_version": self.version or "unknown",
            "data_version": self.metadata.get("data_version", "unknown") if self.metadata else "unknown",
            "timestamp": datetime.utcnow().isoformat(),
            "input_summary": (
                f"N={nitrogen}, P={phosphorus}, K={potassium}, "
                f"Temp={temperature}°C, Humidity={humidity}%, pH={ph}, Rainfall={rainfall}mm"
            ),
        }
    
    def _generate_reasons(
        self, crop: str, n: float, p: float, k: float,
        temp: float, humidity: float, ph: float, rainfall: float,
        feature_importance: dict
    ) -> list[str]:
        """Generate human-readable explanation for why a crop was recommended."""
        reasons = []
        
        # Sort features by importance
        if feature_importance:
            sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
            top_features = [f[0] for f in sorted_features[:3]]
            reasons.append(f"Key factors: {', '.join(top_features)}")
        
        # Soil nutrient assessment
        if n > 80:
            reasons.append("Your soil has high nitrogen, suitable for leafy/grain crops")
        elif n < 30:
            reasons.append("Your soil has low nitrogen — consider nitrogen-fixing crops like pulses")
        
        # Temperature assessment
        if temp > 30:
            reasons.append(f"High temperature ({temp}°C) favors warm-season crops")
        elif temp < 15:
            reasons.append(f"Cool temperature ({temp}°C) favors rabi season crops")
        
        # Rainfall assessment
        if rainfall > 1000:
            reasons.append(f"High rainfall ({rainfall}mm) suits water-intensive crops like rice")
        elif rainfall < 300:
            reasons.append(f"Low rainfall ({rainfall}mm) — drought-tolerant crops recommended")
        
        # pH assessment
        if ph < 5.5:
            reasons.append(f"Acidic soil (pH {ph}) — some crops may need lime application")
        elif ph > 7.5:
            reasons.append(f"Alkaline soil (pH {ph}) — select alkaline-tolerant varieties")
        
        if not reasons:
            reasons.append("Based on overall soil and climate conditions")
        
        return reasons
    
    def _fallback_prediction(self, n, p, k, temp, humidity, ph, rainfall) -> dict:
        """Rule-based fallback when no trained model is available."""
        recommendations = []
        
        # Simple rule-based logic for demonstration
        if rainfall > 1000 and temp > 25 and humidity > 70:
            recommendations.append({
                "crop": "Rice", "suitability_score": 0.85, "confidence": 0.6,
                "reasons": ["High rainfall and warm temperature suit rice cultivation", "Note: This is a rule-based estimate, not an ML prediction"]
            })
        if temp < 25 and ph > 6.0:
            recommendations.append({
                "crop": "Wheat", "suitability_score": 0.80, "confidence": 0.6,
                "reasons": ["Cool temperature and neutral pH suit wheat cultivation", "Note: This is a rule-based estimate, not an ML prediction"]
            })
        if n > 60 and k > 40:
            recommendations.append({
                "crop": "Maize", "suitability_score": 0.75, "confidence": 0.5,
                "reasons": ["High nitrogen and potassium suit maize", "Note: This is a rule-based estimate, not an ML prediction"]
            })
        
        if not recommendations:
            recommendations.append({
                "crop": "Chickpea", "suitability_score": 0.5, "confidence": 0.3,
                "reasons": ["General-purpose recommendation based on limited data", "Please provide more specific soil and weather data for better results"]
            })
        
        return {
            "recommendations": recommendations,
            "model_version": "fallback_rules_v1",
            "data_version": "N/A",
            "timestamp": datetime.utcnow().isoformat(),
            "input_summary": f"N={n}, P={p}, K={k}, Temp={temp}°C, Humidity={humidity}%, pH={ph}, Rainfall={rainfall}mm",
        }


# Singleton for the application
_engine: Optional[CropRecommendationEngine] = None

def get_crop_recommendation_engine() -> CropRecommendationEngine:
    global _engine
    if _engine is None:
        _engine = CropRecommendationEngine()
    return _engine
