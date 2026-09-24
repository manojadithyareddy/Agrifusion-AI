"""
LLM Factory — config-driven LangChain LLM provider.

Reads settings.LLM_PROVIDER and returns the matching ChatModel.
Falls back to None when provider is "offline" or API key is missing.
"""

import logging
from typing import Optional

from langchain_core.language_models.chat_models import BaseChatModel

from app.config import settings

logger = logging.getLogger(__name__)


def get_llm(
    temperature: float = 0.2,
    provider: Optional[str] = None,
    model: Optional[str] = None,
) -> Optional[BaseChatModel]:
    provider = (provider or settings.LLM_PROVIDER).lower()
    model = model or settings.LLM_MODEL

    import os
    api_key = settings.LLM_API_KEY or getattr(settings, "GEMINI_API_KEY", None) or os.environ.get("GEMINI_API_KEY") or os.environ.get("LLM_API_KEY")

    if not api_key:
        logger.warning("LLM_API_KEY/GEMINI_API_KEY not set — LLM running in offline/fallback mode.")
        return None

    if provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            model=model,
            google_api_key=api_key,
            temperature=temperature,
            convert_system_message_to_human=True,
        )

    if provider == "openai":
        from langchain_openai import ChatOpenAI

        return ChatOpenAI(
            model=model,
            api_key=settings.LLM_API_KEY,
            temperature=temperature,
        )

    if provider == "anthropic":
        from langchain_community.chat_models import ChatAnthropic

        return ChatAnthropic(
            model=model,
            anthropic_api_key=settings.LLM_API_KEY,
            temperature=temperature,
        )

    if provider == "offline":
        logger.info("LLM provider set to 'offline' — no LLM will be used.")
        return None

    logger.error(f"Unknown LLM_PROVIDER '{provider}'. Returning None.")
    return None
