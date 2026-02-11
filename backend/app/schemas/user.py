"""User request/response schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    first_name: str | None
    last_name: str | None
    phone: str | None
    country: str | None
    timezone: str | None
    learning_style: str | None
    is_premium: bool
    subscription_tier: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    country: str | None = None
    timezone: str | None = None


class LearningStyleUpdate(BaseModel):
    learning_style: str  # visual | auditory | reading | kinesthetic


class UserProgressResponse(BaseModel):
    total_sessions: int
    total_materials: int
    total_flashcards: int
    study_streak: int
    avg_quiz_score: float | None
    total_study_minutes: int
