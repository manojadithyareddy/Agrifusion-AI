"""
SQLAlchemy Models Package
=========================
Import all models here to ensure they are registered with Base.metadata
and all relationship mappers (e.g. User <-> Prediction) resolve properly.
"""

from app.models.geography import Country, State, District, SubDistrict, Village
from app.models.agriculture import (
    CropCategory,
    Crop,
    CropVariety,
    SoilType,
    Season,
    CropDisease,
    CropPest,
)
from app.models.prediction import ModelVersion, Prediction
from app.models.user import User, Farm, AIConversation
from app.models.rag import RAGDocument, RAGChunk
from app.models.audit import AuditLog
from app.models.dataset import DatasetMeta

__all__ = [
    "Country",
    "State",
    "District",
    "SubDistrict",
    "Village",
    "CropCategory",
    "Crop",
    "CropVariety",
    "SoilType",
    "Season",
    "CropDisease",
    "CropPest",
    "ModelVersion",
    "Prediction",
    "User",
    "Farm",
    "AIConversation",
    "RAGDocument",
    "RAGChunk",
    "AuditLog",
    "DatasetMeta",
]
