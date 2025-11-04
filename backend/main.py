"""
Mini-Amazon Backend API Entry Point

This module serves as the entry point for the FastAPI application.
It imports the FastAPI app instance from the app.main module.

For development:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

For production:
    uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
"""

from app.main import app

__all__ = ["app"]
