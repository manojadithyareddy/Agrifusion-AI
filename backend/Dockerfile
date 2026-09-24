# ==================================================================
# AgriFusion AI — Backend Dockerfile (Production Multi-Stage Build)
# ==================================================================
# Stage 1: Python dependencies
FROM python:3.12-slim AS builder

WORKDIR /build

# Install system build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Final runtime image
FROM python:3.12-slim AS runtime

# Labels
LABEL maintainer="AgriFusion AI Team"
LABEL description="AgriFusion AI Backend API Server"

WORKDIR /app

# Install only runtime system libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 libgl1 libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Create non-root user for security
RUN groupadd -r agrifusion && useradd -r -g agrifusion agrifusion && \
    mkdir -p /app/uploads /app/app/ml/models && \
    chown -R agrifusion:agrifusion /app

USER agrifusion

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run with gunicorn + uvicorn workers for production (binds dynamically to Render's $PORT or default 8000)
CMD ["sh", "-c", "gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:${PORT:-8000} --timeout 120 --graceful-timeout 30 --access-logfile -"]
