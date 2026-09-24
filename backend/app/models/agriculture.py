from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class CropCategory(Base):
    __tablename__ = "crop_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    
    crops = relationship("Crop", back_populates="category")

class Crop(Base):
    __tablename__ = "crops"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("crop_categories.id"))
    name = Column(String, unique=True, index=True)
    name_hindi = Column(String, nullable=True)
    name_local = Column(String, nullable=True)
    scientific_name = Column(String, nullable=True)
    crop_type = Column(String, nullable=True)
    growth_duration_days_min = Column(Integer, nullable=True)
    growth_duration_days_max = Column(Integer, nullable=True)
    water_requirement_mm = Column(Float, nullable=True)
    ideal_temperature_range = Column(String, nullable=True)
    ideal_ph_range = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("CropCategory", back_populates="crops")
    varieties = relationship("CropVariety", back_populates="crop")
    diseases = relationship("CropDisease", back_populates="crop")
    pests = relationship("CropPest", back_populates="crop")

class CropVariety(Base):
    __tablename__ = "crop_varieties"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    name = Column(String, index=True)
    developed_by = Column(String, nullable=True)
    suitable_states = Column(String, nullable=True)
    avg_yield_kg_per_hectare = Column(Float, nullable=True)
    characteristics = Column(Text, nullable=True)
    
    crop = relationship("Crop", back_populates="varieties")

class SoilType(Base):
    __tablename__ = "soil_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    ph_range_min = Column(Float, nullable=True)
    ph_range_max = Column(Float, nullable=True)

class Season(Base):
    __tablename__ = "seasons"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    month_start = Column(String, nullable=True)
    month_end = Column(String, nullable=True)
    description = Column(String, nullable=True)

class CropDisease(Base):
    __tablename__ = "crop_diseases"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    name = Column(String, index=True)
    pathogen_type = Column(String, nullable=True)
    symptoms = Column(String, nullable=True)
    favorable_conditions = Column(String, nullable=True)
    management = Column(Text, nullable=True)
    source = Column(String, nullable=True)
    
    crop = relationship("Crop", back_populates="diseases")

class CropPest(Base):
    __tablename__ = "crop_pests"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    name = Column(String, index=True)
    pest_type = Column(String, nullable=True)
    damage_symptoms = Column(String, nullable=True)
    management = Column(Text, nullable=True)
    source = Column(String, nullable=True)
    
    crop = relationship("Crop", back_populates="pests")
