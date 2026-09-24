from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Country(Base):
    __tablename__ = "countries"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    iso_alpha2 = Column(String, unique=True)
    iso_alpha3 = Column(String, unique=True)
    admin_hierarchy_config = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    states = relationship("State", back_populates="country")

class State(Base):
    __tablename__ = "states"
    
    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"))
    code = Column(String, unique=True, index=True)
    census_code = Column(String, index=True)
    name = Column(String)
    name_local = Column(String, nullable=True)
    state_type = Column(String) # State or Union Territory
    is_active = Column(Boolean, default=True)
    source = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    source_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    country = relationship("Country", back_populates="states")
    districts = relationship("District", back_populates="state")

class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("states.id"))
    code = Column(String, unique=True, index=True)
    census_code = Column(String, index=True)
    name = Column(String)
    name_local = Column(String, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    state = relationship("State", back_populates="districts")
    sub_districts = relationship("SubDistrict", back_populates="district")

class SubDistrict(Base):
    __tablename__ = "sub_districts"
    
    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("districts.id"))
    code = Column(String, index=True)
    census_code = Column(String, index=True)
    name = Column(String)
    sub_district_type = Column(String) # Tehsil, Taluk, Mandal
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    district = relationship("District", back_populates="sub_districts")
    villages = relationship("Village", back_populates="sub_district")

class Village(Base):
    __tablename__ = "villages"
    
    id = Column(Integer, primary_key=True, index=True)
    sub_district_id = Column(Integer, ForeignKey("sub_districts.id"))
    census_code = Column(String, index=True)
    name = Column(String)
    name_local = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sub_district = relationship("SubDistrict", back_populates="villages")
