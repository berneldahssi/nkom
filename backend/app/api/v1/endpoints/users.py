"""User profile and settings endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.user import (
    LearningStyleUpdate,
    UserResponse,
    UserUpdateRequest,
)

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Get the current user's profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    body: UserUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Update profile fields."""
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    await db.flush()
    return current_user


@router.put("/me/learning-style", response_model=UserResponse)
async def update_learning_style(
    body: LearningStyleUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Set or update the user's preferred learning style."""
    current_user.learning_style = body.learning_style
    await db.flush()
    return current_user
