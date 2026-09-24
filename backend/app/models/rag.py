from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from pgvector.sqlalchemy import Vector
from app.database import Base

class RAGDocument(Base):
    __tablename__ = "rag_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    source = Column(String, index=True)
    source_url = Column(String, nullable=True)
    authority = Column(String, nullable=True)
    language = Column(String, default="en")
    doc_type = Column(String, nullable=True)
    content = Column(Text)
    publication_date = Column(DateTime, nullable=True)
    ingested_at = Column(DateTime, default=datetime.utcnow)
    
    chunks = relationship("RAGChunk", back_populates="document")

class RAGChunk(Base):
    __tablename__ = "rag_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("rag_documents.id"))
    chunk_index = Column(Integer)
    content = Column(Text)
    embedding = Column(Vector(768))
    metadata_json = Column(JSON, nullable=True)
    
    document = relationship("RAGDocument", back_populates="chunks")
