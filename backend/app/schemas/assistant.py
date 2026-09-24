from pydantic import BaseModel
from typing import Optional

class AssistantQueryInput(BaseModel):
    query: str
    user_id: Optional[int] = None
    language: Optional[str] = "en"
    crop: Optional[str] = None

class AssistantQueryOutput(BaseModel):
    answer: str
    category: Optional[str] = "general"
    recommendations: Optional[list[str]] = None

class DocumentIngestInput(BaseModel):
    title: str
    content: str
    source: str
    metadata: Optional[dict] = None

class DocumentIngestOutput(BaseModel):
    success: bool
    document_id: int
    message: str
