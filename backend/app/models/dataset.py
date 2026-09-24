from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from app.database import Base

class DatasetMeta(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    domain = Column(String, nullable=False) # e.g. "Plant Pathology", "Agronomy & Soil", "Meteorology"
    record_count = Column(Integer, default=0)
    version = Column(String, default="v1.0")
    status = Column(String, default="active") # "active", "validating", "disabled"
    size_mb = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
