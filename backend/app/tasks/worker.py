"""
Background Task Worker (ARQ)
============================
Async task queue using ARQ (backed by Redis) for long-running operations:
- ML model training
- Bulk data ingestion
- Report generation
- Notification dispatch
"""

import logging
from datetime import datetime
from typing import Optional
from arq import create_pool
from arq.connections import RedisSettings

from app.config import settings

logger = logging.getLogger(__name__)


def parse_redis_url(url: str) -> RedisSettings:
    """Parse a redis:// URL into ARQ RedisSettings."""
    # redis://host:port/db
    url = url.replace("redis://", "")
    parts = url.split("/")
    host_port = parts[0]
    db = int(parts[1]) if len(parts) > 1 else 0
    
    host_parts = host_port.split(":")
    host = host_parts[0] or "localhost"
    port = int(host_parts[1]) if len(host_parts) > 1 else 6379
    
    return RedisSettings(host=host, port=port, database=db)


# ─── Task Functions ───

async def train_ml_model_task(ctx: dict, model_type: str, dataset_path: str):
    """Background task: Train an ML model."""
    logger.info(f"[BG] Starting ML training: {model_type} on {dataset_path}")
    
    try:
        if model_type == "crop_recommendation":
            from app.ml.training.crop_recommendation import train_and_evaluate
            result = train_and_evaluate(dataset_path)
        elif model_type == "yield_prediction":
            from app.ml.training.yield_prediction import train_and_evaluate
            result = train_and_evaluate(dataset_path)
        elif model_type == "market_price":
            from app.ml.training.market_price import train_and_evaluate
            result = train_and_evaluate(dataset_path)
        else:
            return {"status": "error", "message": f"Unknown model type: {model_type}"}
        
        logger.info(f"[BG] Training complete: {model_type} → {result}")
        return {"status": "success", "model_type": model_type, "result": result}
    except Exception as e:
        logger.exception(f"[BG] Training failed: {model_type}")
        return {"status": "error", "model_type": model_type, "error": str(e)}


async def generate_soil_report_task(ctx: dict, user_id: int, soil_data: dict):
    """Background task: Generate and store a soil health report."""
    logger.info(f"[BG] Generating soil report for user {user_id}")
    
    from app.services.soil_health import get_soil_health_service
    service = get_soil_health_service()
    report = service.generate_report(**soil_data)
    
    # In production, save to DB and notify user
    logger.info(f"[BG] Soil report generated: {report['report_id']}")
    return {"status": "success", "report_id": report["report_id"]}


async def ingest_documents_task(ctx: dict, documents: list[dict]):
    """Background task: Bulk ingest documents into RAG knowledge base."""
    logger.info(f"[BG] Bulk ingesting {len(documents)} documents")
    
    from app.nlp.rag_service import get_rag_service
    service = get_rag_service()
    
    if not service.is_active:
        return {"status": "error", "message": "RAG service not active"}
    
    results = []
    for doc in documents:
        try:
            # Note: In a real implementation, we'd get a DB session here
            results.append({"title": doc.get("title"), "status": "queued"})
        except Exception as e:
            results.append({"title": doc.get("title"), "status": "error", "error": str(e)})
    
    return {"status": "success", "processed": len(results), "results": results}


async def send_notification_task(ctx: dict, user_id: int, notification_type: str, message: str):
    """Background task: Send a notification (push/SMS/email placeholder)."""
    logger.info(f"[BG] Sending {notification_type} notification to user {user_id}: {message}")
    
    # Placeholder: In production, integrate with Firebase Cloud Messaging,
    # Twilio SMS, or email service
    return {
        "status": "sent",
        "user_id": user_id,
        "type": notification_type,
        "message": message,
        "sent_at": datetime.utcnow().isoformat(),
    }


async def weather_alert_task(ctx: dict, state: str, district: Optional[str] = None):
    """Background task: Check weather and send alerts if extreme conditions detected."""
    logger.info(f"[BG] Checking weather alerts for {district or ''}, {state}")
    
    from app.services.weather import get_weather_service
    service = get_weather_service()
    weather = await service.get_current_and_forecast(state=state, district=district)
    
    if weather.get("status") != "success":
        return {"status": "error", "message": "Failed to fetch weather"}
    
    # Check for extreme conditions
    alerts = []
    current = weather.get("current", {})
    temp = current.get("temperature_c", 0)
    
    if temp > 45:
        alerts.append(f"🔴 EXTREME HEAT ALERT: {temp}°C in {state}. Protect crops and livestock immediately.")
    if temp < 2:
        alerts.append(f"🔵 FROST ALERT: {temp}°C in {state}. Cover sensitive crops immediately.")
    
    forecast = weather.get("forecast", [])
    for day in forecast[:3]:
        if day.get("rain_mm", 0) > 100:
            alerts.append(f"🌊 HEAVY RAIN ALERT: {day['rain_mm']}mm expected on {day['date']}. Ensure drainage.")
    
    return {
        "status": "success",
        "alerts": alerts,
        "alert_count": len(alerts),
        "checked_at": datetime.utcnow().isoformat(),
    }


# ─── ARQ Worker Configuration ───

class WorkerSettings:
    """ARQ worker settings — this class is discovered by `arq app.tasks.worker.WorkerSettings`."""
    
    redis_settings = parse_redis_url(settings.REDIS_URL)
    
    functions = [
        train_ml_model_task,
        generate_soil_report_task,
        ingest_documents_task,
        send_notification_task,
        weather_alert_task,
    ]
    
    # Cron jobs
    cron_jobs = []
    # Example: Check weather alerts every 6 hours
    # from arq.cron import cron
    # cron_jobs = [cron(weather_alert_task, hour={0, 6, 12, 18}, state="Maharashtra")]
    
    max_jobs = 10
    job_timeout = 600  # 10 minutes max per task
    
    on_startup = None
    on_shutdown = None
