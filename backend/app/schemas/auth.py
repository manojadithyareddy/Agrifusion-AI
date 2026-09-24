from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserRegisterInput(BaseModel):
    """Registration payload. Admin role can NEVER be selected by user."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128, description="At least 8 characters")
    confirm_password: Optional[str] = Field(None, min_length=8, max_length=128)
    name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    preferred_language: str = "en"
    terms_accepted: bool = True

    @model_validator(mode="after")
    def verify_password_match(self):
        if self.confirm_password and self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class UserLoginInput(BaseModel):
    """Login payload."""
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False


class GoogleAuthInput(BaseModel):
    """Google OAuth sign-in / sign-up payload."""
    credential: Optional[str] = None
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    profile_image: Optional[str] = None
    google_id: Optional[str] = None


class ForgotPasswordInput(BaseModel):
    """Forgot password request payload."""
    email: EmailStr


class ResetPasswordInput(BaseModel):
    """Reset password payload with token."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: Optional[str] = Field(None, min_length=8, max_length=128)

    @model_validator(mode="after")
    def verify_password_match(self):
        if self.confirm_password and self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class UserProfileOutput(BaseModel):
    """Public user profile returned by API."""
    id: int
    email: str
    name: str
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    authentication_provider: str = "email"
    phone: Optional[str] = None
    preferred_language: str = "en"
    role: str = "USER"
    is_active: bool = True
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

    @model_validator(mode="after")
    def normalize_fields(self):
        if not self.full_name:
            self.full_name = self.name
        # Normalize role to standard uppercase
        if self.role:
            self.role = self.role.upper()
            if self.role == "FARMER":
                self.role = "USER"
        return self


class TokenOutput(BaseModel):
    """Token response after login/register."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: UserProfileOutput


class UserProfileUpdateInput(BaseModel):
    """Updateable profile fields."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    profile_image: Optional[str] = None
    preferred_language: Optional[str] = None
    state_id: Optional[int] = None
    district_id: Optional[int] = None


class PasswordChangeInput(BaseModel):
    """Change password payload."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class MarketPriceInput(BaseModel):
    crop: str
    state: str
    district: Optional[str] = None
    months_ahead: int = 1


class MarketPriceOutput(BaseModel):
    crop: str
    predicted_price_per_quintal: float
    price_range_min: float
    price_range_max: float
    trend: str
    confidence: float
    historical_avg: float
    best_selling_window: str
    model_version: str
    timestamp: str


# Admin Schemas
class AdminRoleUpdateInput(BaseModel):
    role: str = Field(..., description="Target role: 'USER' or 'ADMIN'")
    reason: Optional[str] = None


class AdminStatusUpdateInput(BaseModel):
    is_active: bool
    reason: Optional[str] = None


# Resolve forward reference
TokenOutput.model_rebuild()
