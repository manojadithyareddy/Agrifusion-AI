from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "AgriFusion AI"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://agrifusion_user:agrifusion_password@localhost:5432/agrifusion_db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Firebase
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    # LLM / GenAI
    LLM_PROVIDER: str = "gemini"  # gemini, openai, anthropic
    LLM_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gemini-1.5-flash"
    
    # Embeddings
    EMBEDDING_PROVIDER: str = "gemini"  # gemini, openai, local
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    EMBEDDING_DIMENSIONS: int = 768
    
    # Security & Auth
    SECRET_KEY: str = "change-this-in-production"
    JWT_SECRET_KEY: str = "change-this-jwt-secret-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    # RSA Public Key for RS256 JWT verification (set via VERCEL env var)
    RSA_PUBLIC_KEY: Optional[str] = None
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://agrifusion-ai.vercel.app",
        "https://*.vercel.app",
    ]
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # ML Models
    ML_MODELS_DIR: str = "app/ml/models"
    
    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_EXTENSIONS: list[str] = [".jpg", ".jpeg", ".png", ".webp"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
if not settings.LLM_API_KEY and settings.GEMINI_API_KEY:
    settings.LLM_API_KEY = settings.GEMINI_API_KEY

# ── Production Safety Check ──
import logging as _logging

_cfg_logger = _logging.getLogger("app.config")

if not settings.DEBUG:
    if "change-this" in settings.SECRET_KEY:
        _cfg_logger.critical(
            "⛔ SECRET_KEY is using the default insecure value! "
            "Set a strong random SECRET_KEY environment variable before deploying to production."
        )
    if "change-this" in settings.JWT_SECRET_KEY:
        _cfg_logger.critical(
            "⛔ JWT_SECRET_KEY is using the default insecure value! "
            "Set a strong random JWT_SECRET_KEY environment variable before deploying to production."
        )
    if not settings.LLM_API_KEY:
        _cfg_logger.warning(
            "⚠️ LLM_API_KEY is not set. AI Assistant and crop recommendation will run in fallback/offline mode."
        )
