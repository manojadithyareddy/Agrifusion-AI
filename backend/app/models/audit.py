from sqlalchemy import Column, Integer, String, DateTime, JSON, Text
from datetime import datetime
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_email = Column(String, index=True, nullable=False)
    actor_role = Column(String, default="ADMIN")
    action = Column(String, index=True, nullable=False)
    target = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True, default="127.0.0.1")
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
