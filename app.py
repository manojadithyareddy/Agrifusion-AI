"""
AgriFusion AI — Unified Application Server
===========================================
Single-entrypoint launcher connecting Frontend, FastAPI Backend, and Database.

Features:
  - Dynamically detects root directory whether executed from root or frontend/
  - Automatically loads environment variables from backend/.env or .env
  - Automatically initializes Database (SQLite / PostgreSQL) tables and seeds default data
  - Automatically compiles or verifies the React + Vite frontend (frontend/dist)
  - Serves both Frontend SPA and Backend API (/api/v1/...) on a single port (default: 8000)
  - Supports `--dev` mode for live hot-reload development with Vite

Usage:
  python app.py             # Start unified application on http://localhost:8000
  python app.py --dev       # Concurrently run FastAPI (8000) + Vite (5173) with live reload
  python app.py --port 8080 # Run on custom port
  python app.py --help      # Show all CLI options
"""

import os
import sys
import argparse
import asyncio
import subprocess
import webbrowser
import threading
import time
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# 1. SETUP ENVIRONMENT & PATHS
# ─────────────────────────────────────────────────────────────
# Dynamically locate project root whether app.py is in root or inside frontend/
_this_file = Path(__file__).resolve()
if _this_file.parent.name == "frontend":
    ROOT_DIR = _this_file.parent.parent
else:
    ROOT_DIR = _this_file.parent

BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
FRONTEND_DIST = FRONTEND_DIR / "dist"

# Add backend directory to sys.path so app.* imports work anywhere
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Enable Python package resolution for `uvicorn app.main:app` when executed from root
__path__ = [str(BACKEND_DIR / "app")]

# Try loading .env from backend or root
try:
    from dotenv import load_dotenv
    backend_env = BACKEND_DIR / ".env"
    root_env = ROOT_DIR / ".env"
    if backend_env.exists():
        load_dotenv(dotenv_path=backend_env)
    elif root_env.exists():
        load_dotenv(dotenv_path=root_env)
except ImportError:
    pass

# Ensure DATABASE_URL is configured for SQLite by default if none specified
if not os.environ.get("DATABASE_URL"):
    db_file = (BACKEND_DIR / "agri.db").resolve()
    db_uri_path = str(db_file).replace("\\", "/")
    os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{db_uri_path}"

if not os.environ.get("PYTHONPATH"):
    os.environ["PYTHONPATH"] = str(BACKEND_DIR)

# Configure UTF-8 output if possible on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


# ─────────────────────────────────────────────────────────────
# 2. AUTOMATIC DATABASE INITIALIZATION & SEEDING
# ─────────────────────────────────────────────────────────────
async def init_database():
    """Ensure database tables exist and essential seed data is populated."""
    print("[*] Connecting to database and verifying schema...")
    try:
        from app.database import engine, Base, async_session_maker
        from sqlalchemy import select, func
        from app.models.agriculture import CropCategory
        from app.models.geography import State

        # Create all tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Check and seed initial data if empty
        async with async_session_maker() as session:
            cat_count = (await session.execute(select(func.count(CropCategory.id)))).scalar() or 0
            if cat_count == 0:
                print("[*] Seeding agriculture categories and crops...")
                try:
                    from scripts.seed_agriculture import seed_agriculture_data
                    await seed_agriculture_data(session)
                except Exception as seed_err:
                    print(f"[!] Seeding agriculture skipped: {seed_err}")

            state_count = (await session.execute(select(func.count(State.id)))).scalar() or 0
            if state_count == 0:
                print("[*] Seeding geography data (states & districts)...")
                try:
                    from scripts.seed_geography import seed_geography_data
                    await seed_geography_data(session)
                except Exception as seed_err:
                    print(f"[!] Seeding geography skipped: {seed_err}")

        print("[OK] Database ready: all tables initialized successfully.")
    except Exception as e:
        print(f"[!] Database initialization notice: {e}")


# ─────────────────────────────────────────────────────────────
# 3. BUILD FRONTEND IF MISSING
# ─────────────────────────────────────────────────────────────
def ensure_frontend_built():
    """Build the frontend if dist/index.html does not exist yet."""
    index_html = FRONTEND_DIST / "index.html"
    if not index_html.exists():
        print("[*] Frontend production build not found in frontend/dist. Building now...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        try:
            res = subprocess.run(
                [npm_cmd, "run", "build"],
                cwd=str(FRONTEND_DIR),
                shell=True,
                check=True,
            )
            print("[OK] Frontend build completed successfully!")
        except Exception as e:
            print(f"[!] Failed to build frontend automatically: {e}")
            print("--> Run `cd frontend && npm install && npm run build` manually.")


# ─────────────────────────────────────────────────────────────
# 4. MOUNT FRONTEND ON FASTAPI
# ─────────────────────────────────────────────────────────────
def mount_frontend(fastapi_app):
    """Mounts frontend static assets and adds SPA fallback routing."""
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
    from fastapi import Request

    if not FRONTEND_DIST.exists():
        return

    # Mount static asset folders
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        fastapi_app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="frontend_assets")

    for subfolder in ["backgrounds", "crops"]:
        f_dir = FRONTEND_DIST / subfolder
        if f_dir.exists():
            fastapi_app.mount(f"/{subfolder}", StaticFiles(directory=str(f_dir)), name=f"frontend_{subfolder}")

    index_html_path = FRONTEND_DIST / "index.html"

    # API status endpoint
    @fastapi_app.get("/api", tags=["System"])
    async def api_info():
        from app.config import settings
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "online",
            "docs": "/docs",
            "api_v1": "/api/v1",
        }

    # Catch-all route: serves static files or index.html for SPA client-side routes
    @fastapi_app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str, request: Request):
        # Do not intercept API or documentation routes
        if full_path.startswith("api/") or full_path in ["api", "docs", "redoc", "openapi.json", "health", "readiness"]:
            return JSONResponse(status_code=404, content={"detail": f"API endpoint /{full_path} not found"})

        # Check if direct file exists in frontend/dist (e.g. favicon.svg, bg-video.mp4, icons.svg)
        if full_path:
            candidate_file = FRONTEND_DIST / full_path
            if candidate_file.is_file():
                return FileResponse(str(candidate_file))

        # Otherwise serve index.html for React Router (e.g. /, /assistant, /predictions, /admin, etc.)
        if index_html_path.exists():
            return HTMLResponse(content=index_html_path.read_text(encoding="utf-8"))

        return JSONResponse(
            status_code=404,
            content={"detail": "Frontend build not found. Run 'npm run build' inside frontend/"},
        )


# ─────────────────────────────────────────────────────────────
# 5. OPEN BROWSER HELPER
# ─────────────────────────────────────────────────────────────
def open_browser_delayed(url: str, delay_seconds: float = 1.2):
    def _open():
        time.sleep(delay_seconds)
        try:
            webbrowser.open(url)
        except Exception:
            pass
    threading.Thread(target=_open, daemon=True).start()


# ─────────────────────────────────────────────────────────────
# 6. RUNNER ROUTINES
# ─────────────────────────────────────────────────────────────
def run_dev_mode(host: str, port: int):
    """Concurrent mode: runs FastAPI on port 8000 and Vite dev server on port 5173."""
    print("===============================================================")
    print("  AgriFusion AI -- Concurrent Development Mode                 ")
    print("===============================================================")
    print(f"  Backend API Docs: http://localhost:{port}/docs               ")
    print(f"  Frontend Vite:    http://localhost:5173                      ")
    print("===============================================================")

    # Run database initialization
    asyncio.run(init_database())

    # Start Vite in background process
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    vite_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=str(FRONTEND_DIR), shell=True)

    open_browser_delayed("http://localhost:5173")

    try:
        import uvicorn
        from app.main import app
        uvicorn.run(app, host=host, port=port, reload=True)
    finally:
        vite_proc.terminate()


def run_unified_server(host: str, port: int, open_browser: bool = True):
    """Production / Single-port mode: serves React SPA + FastAPI + Database on port 8000."""
    ensure_frontend_built()

    # Initialize Database
    asyncio.run(init_database())

    # Import FastAPI application
    from app.main import app
    from app.config import settings

    # Mount the compiled React SPA
    mount_frontend(app)

    url = f"http://localhost:{port}" if host in ["0.0.0.0", "127.0.0.1"] else f"http://{host}:{port}"

    print("\n" + "=" * 63)
    print("  AGRIFUSION AI -- UNIFIED APPLICATION SERVER LAUNCHED         ")
    print("=" * 63)
    print(f"  [Web Application]  {url}")
    print(f"  [AI Assistant]     {url}/assistant")
    print(f"  [Predictions]      {url}/predictions")
    print(f"  [API Docs]         {url}/docs")
    print(f"  [Health]           {url}/health")
    print(f"  [Database]         {os.environ.get('DATABASE_URL', 'connected')}")
    print("=" * 63)
    print("  Press Ctrl+C to stop the server anytime.\n")

    if open_browser:
        open_browser_delayed(url)

    import uvicorn
    uvicorn.run(app, host=host, port=port, log_level="info")


# ─────────────────────────────────────────────────────────────
# 7. MAIN CLI ENTRYPOINT
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="AgriFusion AI — Unified Full-Stack Application Launcher",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind server to (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    parser.add_argument(
        "--dev",
        action="store_true",
        help="Run in development mode (starts Vite hot-reload on 5173 + FastAPI on 8000)",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Do not automatically launch web browser on startup",
    )

    args = parser.parse_args()

    if args.dev:
        run_dev_mode(args.host, args.port)
    else:
        run_unified_server(args.host, args.port, open_browser=not args.no_browser)
