"""
Crop Recommendation ML Training Pipeline
=========================================
Uses the well-known Crop Recommendation Dataset (Kaggle, ICAR-aligned).
Features: N, P, K, temperature, humidity, pH, rainfall → Crop label

Algorithm selection rationale:
- Random Forest is chosen as the primary model for interpretability and
  strong out-of-the-box performance on tabular classification tasks.
- XGBoost and LightGBM are trained as comparison candidates.
- The best model is selected based on cross-validated accuracy and F1.

Data source: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset
License: CC0: Public Domain
"""

import os
import json
import joblib
import logging
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix
)
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

DATA_VERSION = "v1.0.0"
MODEL_VERSION_PREFIX = "crop_rec"


def load_and_validate_data(csv_path: str) -> pd.DataFrame:
    """Load crop recommendation CSV and validate its schema."""
    df = pd.read_csv(csv_path)
    
    required_cols = {"N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"}
    actual_cols = set(df.columns)
    missing = required_cols - actual_cols
    if missing:
        raise ValueError(f"Dataset missing required columns: {missing}")
    
    # Data quality checks
    initial_rows = len(df)
    df = df.dropna()
    dropped = initial_rows - len(df)
    if dropped > 0:
        logger.warning(f"Dropped {dropped} rows with missing values")
    
    # Range validations (agricultural sanity checks)
    assert df["N"].between(0, 300).all(), "Nitrogen values out of expected range [0, 300]"
    assert df["P"].between(0, 200).all(), "Phosphorus values out of expected range [0, 200]"
    assert df["K"].between(0, 300).all(), "Potassium values out of expected range [0, 300]"
    assert df["temperature"].between(-10, 60).all(), "Temperature out of expected range [-10, 60]"
    assert df["humidity"].between(0, 100).all(), "Humidity out of expected range [0, 100]"
    assert df["ph"].between(0, 14).all(), "pH out of expected range [0, 14]"
    assert df["rainfall"].between(0, 5000).all(), "Rainfall out of expected range [0, 5000]"
    
    logger.info(f"Dataset loaded: {len(df)} rows, {df['label'].nunique()} crops")
    return df


def train_and_evaluate(csv_path: str) -> dict:
    """
    Full training pipeline:
    1. Load and validate data
    2. Encode labels and scale features
    3. Train RF, XGBoost, LightGBM
    4. Compare via cross-validation
    5. Select best model
    6. Save artifacts
    """
    df = load_and_validate_data(csv_path)
    
    feature_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X = df[feature_cols].values
    y = df["label"].values
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # --- Model candidates ---
    candidates = {
        "random_forest": RandomForestClassifier(
            n_estimators=100, max_depth=15, random_state=42, n_jobs=-1
        ),
        "xgboost": XGBClassifier(
            n_estimators=100, max_depth=6, learning_rate=0.1,
            random_state=42, use_label_encoder=False, eval_metric="mlogloss"
        ),
        "lightgbm": LGBMClassifier(
            n_estimators=100, max_depth=8, learning_rate=0.1,
            random_state=42, verbose=-1
        ),
    }
    
    results = {}
    for name, model in candidates.items():
        logger.info(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average="weighted")
        precision = precision_score(y_test, y_pred, average="weighted")
        recall = recall_score(y_test, y_pred, average="weighted")
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_scaled, y_encoded, cv=5, scoring="accuracy")
        
        results[name] = {
            "model": model,
            "accuracy": float(accuracy),
            "f1": float(f1),
            "precision": float(precision),
            "recall": float(recall),
            "cv_mean": float(cv_scores.mean()),
            "cv_std": float(cv_scores.std()),
        }
        logger.info(f"  {name}: acc={accuracy:.4f}, f1={f1:.4f}, cv_mean={cv_scores.mean():.4f}")
    
    # --- Select best model by CV accuracy ---
    best_name = max(results, key=lambda k: results[k]["cv_mean"])
    best_model = results[best_name]["model"]
    best_metrics = {k: v for k, v in results[best_name].items() if k != "model"}
    
    logger.info(f"Best model: {best_name} (cv_mean={best_metrics['cv_mean']:.4f})")
    
    # Feature importance (for explainability)
    if hasattr(best_model, "feature_importances_"):
        importances = best_model.feature_importances_
        feature_importance = dict(zip(feature_cols, [float(x) for x in importances]))
    else:
        feature_importance = {}
    
    # Generate classification report on test set
    y_pred_best = best_model.predict(X_test)
    report = classification_report(y_test, y_pred_best, target_names=label_encoder.classes_, output_dict=True)
    
    # --- Save artifacts ---
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    version = f"{MODEL_VERSION_PREFIX}_{best_name}_{timestamp}"
    
    model_path = os.path.join(MODELS_DIR, f"{version}.joblib")
    scaler_path = os.path.join(MODELS_DIR, f"{version}_scaler.joblib")
    encoder_path = os.path.join(MODELS_DIR, f"{version}_encoder.joblib")
    metadata_path = os.path.join(MODELS_DIR, f"{version}_metadata.json")
    
    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(label_encoder, encoder_path)
    
    metadata = {
        "model_name": "crop_recommendation",
        "version": version,
        "algorithm": best_name,
        "data_version": DATA_VERSION,
        "feature_columns": feature_cols,
        "num_classes": int(len(label_encoder.classes_)),
        "classes": list(label_encoder.classes_),
        "metrics": best_metrics,
        "feature_importance": feature_importance,
        "all_candidate_results": {k: {kk: vv for kk, vv in v.items() if kk != "model"} for k, v in results.items()},
        "classification_report": report,
        "trained_at": datetime.utcnow().isoformat(),
        "dataset_rows": len(df),
        "test_size": len(X_test),
        "train_size": len(X_train),
    }
    
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2, default=str)
    
    logger.info(f"Artifacts saved: {model_path}")
    
    return {
        "version": version,
        "algorithm": best_name,
        "metrics": best_metrics,
        "feature_importance": feature_importance,
        "model_path": model_path,
        "scaler_path": scaler_path,
        "encoder_path": encoder_path,
    }


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python crop_recommendation.py <path_to_csv>")
        print("Download dataset from: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset")
        sys.exit(1)
    
    result = train_and_evaluate(sys.argv[1])
    print(f"\nTraining complete!")
    print(f"Best model: {result['algorithm']}")
    print(f"Version: {result['version']}")
    print(f"Metrics: {json.dumps(result['metrics'], indent=2)}")
