"""
Market Price ML Training Pipeline
==================================
Predicts crop market prices (INR/quintal) based on historical trends,
seasonality, and market arrivals.

Data source: Agmarknet (gov.in) historical price data.
Algorithm: XGBoost regressor with time-series feature engineering.
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
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error, r2_score
from xgboost import XGBRegressor

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

DATA_VERSION = "v1.0.0"


def create_time_features(df: pd.DataFrame, date_col: str) -> pd.DataFrame:
    """Extract time-based features from a date column."""
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    df['year'] = df[date_col].dt.year
    df['month'] = df[date_col].dt.month
    df['quarter'] = df[date_col].dt.quarter
    # Sine/cosine transformation for cyclical month feature
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12.0)
    return df


def load_and_prepare_data(csv_path: str) -> tuple[pd.DataFrame, dict, str]:
    """Load Agmarknet price data and prepare features."""
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    
    # Required columns (flexible)
    target_col = None
    for col in ["modal_price", "price", "avg_price"]:
        if col in df.columns:
            target_col = col
            break
            
    if not target_col:
        raise ValueError("Target price column not found")
        
    date_col = None
    for col in ["price_date", "date", "arrival_date", "month_year"]:
        if col in df.columns:
            date_col = col
            break
            
    if not date_col:
        raise ValueError("Date column not found")
        
    df = df.dropna(subset=[target_col, date_col])
    df = df[df[target_col] > 0]
    
    # Feature Engineering
    df = create_time_features(df, date_col)
    
    # Categorical Encoding
    encoders = {}
    categorical_cols = []
    for col in ["crop", "commodity", "state", "district", "market"]:
        if col in df.columns:
            # Standardize names
            le = LabelEncoder()
            df[f"{col}_encoded"] = le.fit_transform(df[col].astype(str).str.lower().str.strip())
            encoders[col] = le
            categorical_cols.append(f"{col}_encoded")
            
    logger.info(f"Price dataset: {len(df)} rows, Target: {target_col}")
    return df, encoders, target_col, categorical_cols


def train_and_evaluate(csv_path: str) -> dict:
    """Train price prediction models and save the best one."""
    df, encoders, target_col, categorical_cols = load_and_prepare_data(csv_path)
    
    # Features: Categorical + Time features + Arrivals (if available)
    feature_cols = categorical_cols + ['year', 'month_sin', 'month_cos']
    if 'arrivals' in df.columns:
        feature_cols.append('arrivals')
        # Fill missing arrivals with median
        df['arrivals'] = df['arrivals'].fillna(df['arrivals'].median())
        
    X = df[feature_cols].values
    y = df[target_col].values
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Time-aware split (sort by date before split is better, but using standard split for simplicity in this baseline)
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )
    
    candidates = {
        "xgboost": XGBRegressor(
            n_estimators=300, max_depth=10, learning_rate=0.05, 
            random_state=42, tree_method="hist"
        ),
        "random_forest": RandomForestRegressor(
            n_estimators=100, max_depth=20, random_state=42, n_jobs=-1
        )
    }
    
    results = {}
    for name, model in candidates.items():
        logger.info(f"Training price model: {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        mape = mean_absolute_percentage_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        results[name] = {
            "model": model,
            "mae": float(mae),
            "mape": float(mape),
            "r2": float(r2),
        }
        logger.info(f"  {name}: MAE={mae:.2f}, MAPE={mape:.4f}, R2={r2:.4f}")
        
    best_name = max(results, key=lambda k: results[k]["r2"])
    best_model = results[best_name]["model"]
    best_metrics = {k: v for k, v in results[best_name].items() if k != "model"}
    
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    version = f"price_{best_name}_{timestamp}"
    
    joblib.dump(best_model, os.path.join(MODELS_DIR, f"{version}.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, f"{version}_scaler.joblib"))
    joblib.dump(encoders, os.path.join(MODELS_DIR, f"{version}_encoders.joblib"))
    
    feature_importance = {}
    if hasattr(best_model, "feature_importances_"):
        feature_importance = dict(zip(feature_cols, [float(x) for x in best_model.feature_importances_]))
    
    metadata = {
        "model_name": "market_price",
        "version": version,
        "algorithm": best_name,
        "data_version": DATA_VERSION,
        "feature_columns": feature_cols,
        "metrics": best_metrics,
        "feature_importance": feature_importance,
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
        print("Usage: python market_price.py <path_to_agmarknet_csv>")
        sys.exit(1)
    result = train_and_evaluate(sys.argv[1])
    print(f"Training complete! Best: {result['algorithm']}, Metrics: {json.dumps(result['metrics'], indent=2)}")
