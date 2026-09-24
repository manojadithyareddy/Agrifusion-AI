from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=True)  # External auth provider UID (Supabase/OAuth)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Null for Supabase/OAuth users
    name = Column(String, nullable=False)
    profile_image = Column(String, nullable=True)
    authentication_provider = Column(String, default="email")  # "email", "google", "supabase"
    phone = Column(String, nullable=True)
    preferred_language = Column(String, default="en")
    state_id = Column(Integer, ForeignKey("states.id"), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    role = Column(String, default="USER")  # "USER" or "ADMIN"
    is_active = Column(Integer, default=1)  # 1 = active, 0 = disabled
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    @property
    def full_name(self) -> str:
        return self.name or ""
    
    farms = relationship("Farm", back_populates="user")
    predictions = relationship("Prediction", back_populates="user")
    conversations = relationship("AIConversation", back_populates="user")

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=True)
    area_hectares = Column(Float, nullable=True)
    soil_type = Column(String, nullable=True)
    irrigation_type = Column(String, nullable=True)
    current_crop = Column(String, nullable=True)
    soil_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="farms")
    predictions = relationship("Prediction", back_populates="farm")

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String, index=True, nullable=True)
    query = Column(Text, nullable=True)
    response = Column(Text, nullable=True)
    messages = Column(JSON, default=list)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="conversations")

