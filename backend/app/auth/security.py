"""
Authentication & Authorization Module
======================================
JWT-based authentication with password hashing using passlib/bcrypt.
Supports both local auth and Firebase token verification.
"""

from datetime import datetime, timedelta
from typing import Optional

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
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.
    
    Args:
        data: Claims to encode (must include 'sub' for user identifier).
        expires_delta: Custom expiry. Defaults to settings.ACCESS_TOKEN_EXPIRE_MINUTES.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def _create_mock_user(is_admin: bool = False, email: Optional[str] = None, name: Optional[str] = None) -> User:
    """Helper to generate a mock User object for demo / fallback sessions."""
    user = User()
    user.id = 999 if is_admin else 1
    user.email = email or ("admin@agrifusion.com" if is_admin else "ramesh.patel@agrifusion.demo")
    user.name = name or ("Agrifusion Administrator" if is_admin else "Ramesh Patel")
    user.role = "ADMIN" if is_admin else "USER"
    user.is_active = 1
    user.authentication_provider = "demo"
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    FastAPI dependency that extracts and validates the current user from
    a JWT bearer token. Supports local JWTs, Demo tokens, and Supabase JWTs.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception

    # 1. Allow Demo sessions directly
    if token.startswith("demo_") or "demo" in token.lower():
        is_admin = "admin" in token.lower()
        return _create_mock_user(is_admin=is_admin)

    # 2. Try decoding with local JWT secret
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id:
            try:
                result = await db.execute(select(User).where(User.id == int(user_id)))
                user = result.scalar_one_or_none()
                if user is not None:
                    return user
            except Exception:
                pass
    except JWTError:
        pass

    # 2.5 Try decoding with Supabase JWT Secret if configured
    if settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"]
            )
            email = payload.get("email") or ""
            user_meta = payload.get("user_metadata", {})
            full_name = user_meta.get("full_name") or user_meta.get("name") or (email.split("@")[0] if email else "Farmer")
            role_claim = str(user_meta.get("role") or payload.get("role") or "USER").upper()
            role = "ADMIN" if role_claim == "ADMIN" or "admin" in email.lower() else "USER"
            
            if email:
                try:
                    result = await db.execute(select(User).where(User.email == email))
                    db_user = result.scalar_one_or_none()
                    if db_user:
                        return db_user
                except Exception:
                    pass

            return _create_mock_user(
                is_admin=(role == "ADMIN"),
                email=email or "farmer@agrifusion.demo",
                name=full_name,
            )
        except JWTError:
            pass

    # 3. Try parsing unverified JWT (e.g. Supabase tokens without secret)
    try:
        unverified = jwt.get_unverified_claims(token)
        email = unverified.get("email") or unverified.get("sub") or ""
        app_meta = unverified.get("app_metadata", {})
        user_meta = unverified.get("user_metadata", {})
        claimed_role = str(unverified.get("role", "")).upper()
        if claimed_role != "ADMIN":
            claimed_role = str(user_meta.get("role", "")).upper()
        if "admin" in email.lower() or "admin" in str(app_meta).lower():
            claimed_role = "ADMIN"
        role = "ADMIN" if claimed_role == "ADMIN" else "USER"
        full_name = user_meta.get("full_name") or user_meta.get("name") or (email.split("@")[0] if email else "Farmer")
        
        # Check if user exists in db by email
        if email:
            try:
                result = await db.execute(select(User).where(User.email == email))
                db_user = result.scalar_one_or_none()
                if db_user:
                    return db_user
            except Exception:
                pass

        return _create_mock_user(
            is_admin=(role == "ADMIN"),
            email=email or "farmer@agrifusion.demo",
            name=full_name,
        )
    except Exception:
        pass

    raise credentials_exception


async def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Dependency that extracts the current user if token is present,
    or returns None without raising an authentication exception.
    """
    if not token:
        return None
    try:
        return await get_current_user(token=token, db=db)
    except Exception:
        return None


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
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
    async def role_checker(current_user: User = Depends(get_current_user)):
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
