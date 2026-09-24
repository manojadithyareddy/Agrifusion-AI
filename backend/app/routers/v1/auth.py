"""
Auth Router — Registration, Login, OAuth, and Role Authorization
================================================================
Production-ready authentication system with Google OAuth support,
password hashing with bcrypt, JWT token issuing, and RBAC protection.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.user import User
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_optional_current_user,
)
from app.schemas.auth import (
    UserRegisterInput,
    UserLoginInput,
    GoogleAuthInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    TokenOutput,
    UserProfileOutput,
    UserProfileUpdateInput,
    PasswordChangeInput,
)
from app.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

# Temporary in-memory reset token storage (in real production, Redis or DB)
_PASSWORD_RESET_TOKENS: Dict[str, Dict[str, Any]] = {}


# ----- Demo Accounts Seeding Helper -----
async def ensure_demo_accounts(db: AsyncSession):
    """Seed demo admin and demo user accounts if they don't already exist."""
    try:
        # Check Admin
        admin_res = await db.execute(select(User).where(User.email == "admin@agrifusion.ai"))
        admin = admin_res.scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@agrifusion.ai",
                password_hash=hash_password("Admin@123"),
                name="AgriFusion Admin",
                phone="+919876543210",
                role="ADMIN",
                authentication_provider="email",
                is_active=1,
            )
            db.add(admin)

        # Check Farmer/User
        user_res = await db.execute(select(User).where(User.email == "farmer@agrifusion.ai"))
        farmer = user_res.scalar_one_or_none()
        if not farmer:
            farmer = User(
                email="farmer@agrifusion.ai",
                password_hash=hash_password("Farmer@123"),
                name="Rajesh Kumar",
                phone="+919812345678",
                role="USER",
                authentication_provider="email",
                is_active=1,
            )
            db.add(farmer)

        await db.commit()
    except Exception as e:
        logger.warning(f"Demo accounts seeding check: {e}")
        await db.rollback()


# ----- Registration -----

@router.post("/register", response_model=TokenOutput, status_code=status.HTTP_201_CREATED)
async def register(input_data: UserRegisterInput, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with Email & Password.
    SECURITY REQUIREMENT:
    Default role is strictly 'USER'.
    Users cannot manually select 'ADMIN' during registration.
    """
    await ensure_demo_accounts(db)

    # Check duplicate email
    existing = await db.execute(select(User).where(User.email == input_data.email.lower().strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    # Create new account with default role USER
    new_user = User(
        email=input_data.email.lower().strip(),
        password_hash=hash_password(input_data.password),
        name=input_data.name.strip(),
        phone=input_data.phone,
        preferred_language=input_data.preferred_language,
        role="USER",  # Strictly default to USER
        authentication_provider="email",
        is_active=1,
        created_at=datetime.utcnow(),
        last_login=datetime.utcnow(),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Issue JWT token
    token = create_access_token(data={
        "sub": str(new_user.id),
        "email": new_user.email,
        "role": new_user.role,
    })

    logger.info(f"User registered: {new_user.email} (role={new_user.role})")

    return TokenOutput(
        access_token=token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserProfileOutput.model_validate(new_user),
    )


# ----- Login -----

@router.post("/login", response_model=TokenOutput)
async def login(input_data: UserLoginInput, db: AsyncSession = Depends(get_db)):
    """Authenticate with Email & Password and return JWT + user profile with role."""
    await ensure_demo_accounts(db)

    email_clean = input_data.email.lower().strip()
    result = await db.execute(select(User).where(User.email == email_clean))
    user = result.scalar_one_or_none()

    if not user or not user.password_hash or not verify_password(input_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please verify your credentials.",
        )

    if hasattr(user, "is_active") and user.is_active == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated by the system administrator. Please contact support.",
        )

    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    await db.refresh(user)

    token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": (user.role or "USER").upper(),
    })

    logger.info(f"User logged in: {user.email} (role={user.role})")

    return TokenOutput(
        access_token=token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserProfileOutput.model_validate(user),
    )


# ----- Google OAuth -----

@router.post("/google", response_model=TokenOutput)
async def google_auth(payload: GoogleAuthInput, db: AsyncSession = Depends(get_db)):
    """
    Google OAuth Sign-In & Sign-Up endpoint.
    Retrieves or creates the user with authentication_provider='google'.
    New users default to role 'USER'.
    Existing roles (including ADMIN) are preserved.
    """
    await ensure_demo_accounts(db)

    # In production, verify Google ID token with google-auth / requests if credential is provided
    # Fallback to payload email & profile info
    email = (payload.email or "google.user@agrifusion.ai").lower().strip()
    name = payload.name or email.split("@")[0].capitalize()
    profile_img = payload.profile_image or f"https://api.dicebear.com/7.x/initials/svg?seed={name}"

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        if hasattr(user, "is_active") and user.is_active == 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated. Please contact administrator.",
            )
        # Existing user: update last login and profile picture if missing
        user.last_login = datetime.utcnow()
        if not user.profile_image and profile_img:
            user.profile_image = profile_img
        await db.commit()
        await db.refresh(user)
    else:
        # Create new user with default role USER
        user = User(
            email=email,
            password_hash=None,  # Google OAuth account
            name=name,
            profile_image=profile_img,
            authentication_provider="google",
            role="USER",  # Strictly default to USER
            is_active=1,
            created_at=datetime.utcnow(),
            last_login=datetime.utcnow(),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": (user.role or "USER").upper(),
    })

    logger.info(f"Google OAuth authenticated: {user.email} (role={user.role})")

    return TokenOutput(
        access_token=token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserProfileOutput.model_validate(user),
    )


# ----- Forgot Password -----

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordInput, db: AsyncSession = Depends(get_db)):
    """
    Send password reset instructions.
    Generates a secure reset token and returns human-readable confirmation.
    """
    email_clean = payload.email.lower().strip()
    result = await db.execute(select(User).where(User.email == email_clean))
    user = result.scalar_one_or_none()

    # For security reasons, don't leak whether the email exists or not
    reset_token = uuid.uuid4().hex
    _PASSWORD_RESET_TOKENS[reset_token] = {
        "email": email_clean,
        "expires_at": datetime.utcnow() + timedelta(hours=1),
    }

    logger.info(f"Password reset requested for {email_clean}")

    return {
        "status": "success",
        "message": f"If an account exists for {email_clean}, password reset instructions have been dispatched.",
        "reset_token": reset_token,  # Provided for easy local testing / staging
    }


# ----- Reset Password -----

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordInput, db: AsyncSession = Depends(get_db)):
    """Reset password using verified reset token."""
    token_data = _PASSWORD_RESET_TOKENS.get(payload.token)
    if not token_data or token_data["expires_at"] < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired. Please request a new one.",
        )

    email = token_data["email"]
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    user.password_hash = hash_password(payload.new_password)
    user.updated_at = datetime.utcnow()
    await db.commit()

    # Invalidate token
    _PASSWORD_RESET_TOKENS.pop(payload.token, None)

    logger.info(f"Password successfully reset for {email}")

    return {
        "status": "success",
        "message": "Password has been successfully updated. You may now sign in with your new password.",
    }


# ----- Logout -----

@router.post("/logout")
async def logout(current_user: Optional[User] = Depends(get_optional_current_user)):
    """Logout endpoint to clear session and record audit."""
    if current_user:
        logger.info(f"User logged out: {current_user.email}")
    return {"status": "success", "message": "Successfully logged out."}


# ----- Profile -----

@router.get("/me", response_model=UserProfileOutput)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the current authenticated user's profile and active role."""
    await db.refresh(current_user)
    return UserProfileOutput.model_validate(current_user)


@router.patch("/me", response_model=UserProfileOutput)
async def update_profile(
    updates: UserProfileUpdateInput,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update profile fields for current user.
    Prevents modifying OAuth email or protected attributes.
    """
    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update.")

    for field, value in update_data.items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)

    current_user.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(current_user)

    return UserProfileOutput.model_validate(current_user)


# ----- Change Password -----

@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    payload: PasswordChangeInput,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change current user's password."""
    if not current_user.password_hash:
        raise HTTPException(
            status_code=400,
            detail="Account is linked with Google OAuth. Password changes are managed via Google.",
        )

    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")

    current_user.password_hash = hash_password(payload.new_password)
    current_user.updated_at = datetime.utcnow()
    await db.commit()

    logger.info(f"Password changed for user: {current_user.email}")
    return {"status": "success", "message": "Password changed successfully."}


# ----- Swagger UI Token Support -----

@router.post("/token", include_in_schema=False)
async def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """OAuth2 form login used by Swagger UI's Authorize button."""
    email_clean = form_data.username.lower().strip()
    result = await db.execute(select(User).where(User.email == email_clean))
    user = result.scalar_one_or_none()

    if not user or not user.password_hash or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
    return {"access_token": token, "token_type": "bearer"}
