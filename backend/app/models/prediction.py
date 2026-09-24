from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ModelVersion(Base):
    __tablename__ = "model_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, index=True)
    version = Column(String)
    algorithm = Column(String)
    metrics = Column(JSON, nullable=True)
    dataset_version = Column(String, nullable=True)
    status = Column(String, default="active")
    artifact_path = Column(String, nullable=True)
    trained_at = Column(DateTime, nullable=True)
    deployed_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("Prediction", back_populates="model_version")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    prediction_type = Column(String, index=True) # crop_recommendation, yield, climate_risk, etc.
    input_data = Column(JSON)
    output_data = Column(JSON)
    confidence = Column(Float, nullable=True)
    model_version_id = Column(Integer, ForeignKey("model_versions.id"), nullable=True)
    data_version = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="predictions")
    farm = relationship("Farm", back_populates="predictions")
    model_version = relationship("ModelVersion", back_populates="predictions")
