from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
import uuid

from app.config import settings
import app.models  # Register all SQLAlchemy models and relationships
from app.routers.v1 import geography, crops, predictions, vision, assistant, auth, weather, schemes, soil_health, admin, user

# Configure structured logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("agrifusion")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager: ensures tables are initialized on deployment startup."""
    try:
        from app.database import engine, Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables initialized successfully on startup.")
    except Exception as e:
        logger.warning(f"Database table initialization warning (may already exist or using remote schema): {e}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Multimodal Agriculture Intelligence & Decision Agent API",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://([a-zA-Z0-9\-_.]+\.)?(localhost|127\.0\.0\.1|onrender\.com|vercel\.app|netlify\.app)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id_and_log(request: Request, call_next):
    """Attach a unique request ID and log every request with latency."""
    request_id = request.headers.get("X-Request-ID", uuid.uuid4().hex[:16])
    start = time.time()
    response = await call_next(request)
    elapsed = round((time.time() - start) * 1000, 2)
    response.headers["X-Request-ID"] = request_id
    logger.info(f"[{request_id}] {request.method} {request.url.path} → {response.status_code} ({elapsed}ms)")
    return response


# --- Global error handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all: never expose internal details to users."""
    logger.exception(f"Unhandled error on {request.method} {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "An unexpected error occurred. Please try again later.",
            "detail": None,  # Never expose stack trace to farmer
        },
    )


# --- Register Routers ---
app.include_router(geography.router)
app.include_router(crops.router)
app.include_router(predictions.router)
app.include_router(vision.router)
app.include_router(assistant.router)
app.include_router(auth.router)
app.include_router(weather.router)
app.include_router(schemes.router)
app.include_router(soil_health.router)
app.include_router(admin.router)
app.include_router(user.router)


# --- Health & Root ---
@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG,
        "timestamp": time.time(),
    }


@app.get("/readiness", tags=["Health"])
async def readiness_check():
    """Deep health check — verifies database and Redis connectivity."""
    checks = {}

    # Check PostgreSQL
    try:
        from app.database import engine
        from sqlalchemy import text
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {type(e).__name__}"

    # Check Redis
    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, socket_timeout=3)
        await r.ping()
        await r.aclose()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {type(e).__name__}"

    all_ok = all(v == "ok" for v in checks.values())
    return {
        "status": "ready" if all_ok else "degraded",
        "checks": checks,
        "version": settings.APP_VERSION,
        "timestamp": time.time(),
    }
