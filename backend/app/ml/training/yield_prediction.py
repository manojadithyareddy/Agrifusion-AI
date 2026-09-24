"""
Yield Prediction ML Training Pipeline
======================================
Predicts crop yield (kg/hectare) given crop, location, season, weather, soil.

Data source: data.gov.in APY (Area, Production, Yield) dataset
             India Data Portal crop production statistics

Algorithm selection rationale:
- XGBoost chosen as primary for tabular regression on heterogeneous features.
- Random Forest and LightGBM trained as comparison candidates.
"""

import os
import json
import joblib
import logging
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

DATA_VERSION = "v1.0.0"


def load_and_prepare_data(csv_path: str) -> tuple[pd.DataFrame, dict]:
    """
    Load yield dataset.
    Expected columns: Crop, State, Season, Area, Production, Yield (or similar).
    Returns cleaned DataFrame and encoders dict.
    """
    df = pd.read_csv(csv_path)
    
    # Normalize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    
    # Validate required columns exist (flexible naming)
    possible_yield_cols = ["yield", "yield_kg_per_hectare", "production"]
    yield_col = None
    for col in possible_yield_cols:
        if col in df.columns:
            yield_col = col
            break
    
    if yield_col is None:
        raise ValueError(f"Could not find yield column. Available: {list(df.columns)}")
    
    # If we have production and area, calculate yield
    if yield_col == "production" and "area" in df.columns:
        df["yield_calculated"] = df["production"] / df["area"].replace(0, np.nan)
        df = df.dropna(subset=["yield_calculated"])
        yield_col = "yield_calculated"
    
    # Drop invalid rows
    df = df.dropna(subset=[yield_col])
    df = df[df[yield_col] > 0]
    
    # Encode categorical features
    encoders = {}
    categorical_cols = []
    for col in ["crop", "state", "season", "district"]:
        if col in df.columns:
            le = LabelEncoder()
            df[f"{col}_encoded"] = le.fit_transform(df[col].astype(str))
            encoders[col] = le
            categorical_cols.append(f"{col}_encoded")
    
    logger.info(f"Yield dataset: {len(df)} rows, yield column: {yield_col}")
    
    return df, encoders, yield_col, categorical_cols


def train_and_evaluate(csv_path: str) -> dict:
    """Full yield prediction training pipeline."""
    df, encoders, yield_col, categorical_cols = load_and_prepare_data(csv_path)
    
    # Feature columns = encoded categoricals + any numeric features
    numeric_cols = []
    for col in ["area", "rainfall", "temperature", "humidity"]:
        if col in df.columns:
            numeric_cols.append(col)
    
    feature_cols = categorical_cols + numeric_cols
    if not feature_cols:
        raise ValueError("No usable features found in dataset")
    
    X = df[feature_cols].values
    y = df[yield_col].values
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )
    
    candidates = {
        "xgboost": XGBRegressor(
            n_estimators=200, max_depth=8, learning_rate=0.1, random_state=42
        ),
        "random_forest": RandomForestRegressor(
            n_estimators=100, max_depth=15, random_state=42, n_jobs=-1
        ),
        "lightgbm": LGBMRegressor(
            n_estimators=200, max_depth=10, learning_rate=0.1, random_state=42, verbose=-1
        ),
    }
    
    results = {}
    for name, model in candidates.items():
        logger.info(f"Training yield model: {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = r2_score(y_test, y_pred)
        
        cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring="r2")
        
        results[name] = {
            "model": model,
            "mae": float(mae),
            "rmse": rmse,
            "r2": float(r2),
            "cv_r2_mean": float(cv_scores.mean()),
            "cv_r2_std": float(cv_scores.std()),
        }
        logger.info(f"  {name}: MAE={mae:.2f}, RMSE={rmse:.2f}, R2={r2:.4f}, CV_R2={cv_scores.mean():.4f}")
    
    best_name = max(results, key=lambda k: results[k]["cv_r2_mean"])
    best_model = results[best_name]["model"]
    best_metrics = {k: v for k, v in results[best_name].items() if k != "model"}
    
    # Feature importance
    feature_importance = {}
    if hasattr(best_model, "feature_importances_"):
        feature_importance = dict(zip(feature_cols, [float(x) for x in best_model.feature_importances_]))
    
    # Save artifacts
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    version = f"yield_{best_name}_{timestamp}"
    
    joblib.dump(best_model, os.path.join(MODELS_DIR, f"{version}.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, f"{version}_scaler.joblib"))
    joblib.dump(encoders, os.path.join(MODELS_DIR, f"{version}_encoders.joblib"))
    
    metadata = {
        "model_name": "yield_prediction",
        "version": version,
        "algorithm": best_name,
        "data_version": DATA_VERSION,
        "feature_columns": feature_cols,
        "yield_column": yield_col,
        "metrics": best_metrics,
        "feature_importance": feature_importance,
        "all_candidate_results": {k: {kk: vv for kk, vv in v.items() if kk != "model"} for k, v in results.items()},
        "trained_at": datetime.utcnow().isoformat(),
        "dataset_rows": len(df),
    }
    
    with open(os.path.join(MODELS_DIR, f"{version}_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2, default=str)
    
    return {"version": version, "algorithm": best_name, "metrics": best_metrics}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    import sys
    if len(sys.argv) < 2:
        print("Usage: python yield_prediction.py <path_to_csv>")
        sys.exit(1)
    result = train_and_evaluate(sys.argv[1])
    print(f"Training complete! Best: {result['algorithm']}, Metrics: {json.dumps(result['metrics'], indent=2)}")
