"""
Embedding Factory — config-driven embedding provider.

Reads settings.EMBEDDING_PROVIDER and returns the matching
LangChain Embeddings instance plus the correct dimension count.
"""

import logging
from typing import Optional, Tuple

from langchain_core.embeddings import Embeddings

from app.config import settings

logger = logging.getLogger(__name__)


def get_embeddings(
    provider: Optional[str] = None,
) -> Tuple[Optional[Embeddings], int]:
    """Return (embeddings_instance, dimensions).

    Returns (None, dim) when API key is missing or provider is unavailable.
    """
    provider = (provider or settings.EMBEDDING_PROVIDER).lower()

    if provider == "gemini":
        if not settings.LLM_API_KEY:
            logger.warning("LLM_API_KEY not set — Gemini embeddings unavailable.")
            return None, settings.EMBEDDING_DIMENSIONS
        from langchain_google_genai import GoogleGenerativeAIEmbeddings

        emb = GoogleGenerativeAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            google_api_key=settings.LLM_API_KEY,
        )
        return emb, 768

    if provider == "openai":
        if not settings.LLM_API_KEY:
            logger.warning("LLM_API_KEY not set — OpenAI embeddings unavailable.")
            return None, settings.EMBEDDING_DIMENSIONS
        from langchain_openai import OpenAIEmbeddings

        emb = OpenAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            api_key=settings.LLM_API_KEY,
        )
        return emb, 1536

    if provider == "local":
        try:
            from langchain_community.embeddings import HuggingFaceEmbeddings

            emb = HuggingFaceEmbeddings(
                model_name=settings.EMBEDDING_MODEL,
            )
            return emb, 384
        except Exception as e:
            logger.warning(f"Local HuggingFaceEmbeddings unavailable: {e}")
            return None, settings.EMBEDDING_DIMENSIONS

    logger.error(f"Unknown EMBEDDING_PROVIDER '{provider}'. Returning None.")
    return None, settings.EMBEDDING_DIMENSIONS
