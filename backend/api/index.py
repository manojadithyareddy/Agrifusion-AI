# ─────────────────────────────────────────────────────────────
#  AgriFusion AI — Vercel Serverless Entry Point
#  This file adapts the FastAPI app to Vercel's Python runtime.
# ─────────────────────────────────────────────────────────────
import sys
import os

# Ensure the backend package is on the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.main import app  # noqa: F401  — Vercel looks for `app`
