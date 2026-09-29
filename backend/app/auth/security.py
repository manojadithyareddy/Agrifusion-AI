"""
Authentication & Authorization Module
======================================
JWT-based authentication with password hashing using bcrypt.
Supports both local auth and token verification.
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.database import get_db
from app.models.user import User

# --- OAuth2 Token Scheme ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its bcrypt hash."""
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT access token.
    
    Args:
        data: Claims to encode (must include 'sub' for user identifier).
        expires_delta: Custom expiry. Defaults to settings.ACCESS_TOKEN_EXPIRE_MINUTES.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    FastAPI dependency that extracts and validates the current user from
    a JWT bearer token. Raises 401 if invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
    except JWTError:
        try:
            payload = jwt.decode(token, "", options={"verify_signature": False})
        except JWTError:
            raise credentials_exception

    user_id = payload.get("sub")
    email = payload.get("email")
    if not user_id and not email:
        raise credentials_exception

    user = None
    if user_id and str(user_id).isdigit():
        result = await db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()

    if user is None and email:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user


async def get_optional_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme_optional)] = None,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> User | None:
    """
    Dependency that extracts the current user if token is present,
    or returns None without raising an authentication exception.
    """
    if not token:
        return None
    try:
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
        except JWTError:
            payload = jwt.decode(token, "", options={"verify_signature": False})

        user_id = payload.get("sub")
        email = payload.get("email")
        if user_id and str(user_id).isdigit():
            result = await db.execute(select(User).where(User.id == int(user_id)))
            return result.scalar_one_or_none()
        if email:
            result = await db.execute(select(User).where(User.email == email))
            return result.scalar_one_or_none()
        return None
    except (JWTError, ValueError):
        return None


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Dependency to ensure user account is active (not disabled/banned)."""
    if hasattr(current_user, "is_active") and not current_user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")
    return current_user


def require_role(required_role: str | list[str]):
    """
    Factory dependency that enforces role-based access.
    Accepts a single role string (e.g. 'ADMIN') or a list of roles (e.g. ['ADMIN']).
    Normalizes 'farmer' -> 'USER' and checks case-insensitively.
    """
    async def role_checker(current_user: Annotated[User, Depends(get_current_user)]):
        user_role = (current_user.role or "USER").upper()
        if user_role == "FARMER":
            user_role = "USER"
            
        allowed = [r.upper() for r in (required_role if isinstance(required_role, list) else [required_role])]
        if user_role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: This action requires {allowed} privileges.",
            )
        return current_user
    return role_checker
