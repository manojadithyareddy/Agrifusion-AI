"""
Task Dispatcher — Enqueue background tasks from API routes.
"""

from arq import create_pool
from app.config import settings
from app.tasks.worker import parse_redis_url


async def get_task_pool():
    """Create an ARQ Redis connection pool for enqueuing tasks."""
    return await create_pool(parse_redis_url(settings.REDIS_URL))


async def enqueue_ml_training(model_type: str, dataset_path: str) -> str:
    """Enqueue an ML model training job."""
    pool = await get_task_pool()
    job = await pool.enqueue_job("train_ml_model_task", model_type, dataset_path)
    return job.job_id


async def enqueue_soil_report(user_id: int, soil_data: dict) -> str:
    """Enqueue a soil health report generation."""
    pool = await get_task_pool()
    job = await pool.enqueue_job("generate_soil_report_task", user_id, soil_data)
    return job.job_id


async def enqueue_notification(user_id: int, notification_type: str, message: str) -> str:
    """Enqueue a notification."""
    pool = await get_task_pool()
    job = await pool.enqueue_job("send_notification_task", user_id, notification_type, message)
    return job.job_id


async def enqueue_weather_alert(state: str, district: str = None) -> str:
    """Enqueue a weather alert check."""
    pool = await get_task_pool()
    job = await pool.enqueue_job("weather_alert_task", state, district)
    return job.job_id
