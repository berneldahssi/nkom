"""Analytics endpoints — progress overview, performance stats."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.flashcard import Flashcard
from app.models.study_material import StudyMaterial
from app.models.study_session import StudySession
from app.models.user import User
from app.schemas.user import UserProgressResponse

router = APIRouter()


@router.get("/overview", response_model=UserProgressResponse)
async def get_overview(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> UserProgressResponse:
    """Get a high-level progress overview for the current user."""
    # Total sessions
    sessions_result = await db.execute(
        select(func.count(StudySession.id)).where(
            StudySession.user_id == current_user.id
        )
    )
    total_sessions = sessions_result.scalar() or 0

    # Total materials
    materials_result = await db.execute(
        select(func.count(StudyMaterial.id)).where(
            StudyMaterial.user_id == current_user.id
        )
    )
    total_materials = materials_result.scalar() or 0

    # Total flashcards
    flashcards_result = await db.execute(
        select(func.count(Flashcard.id)).where(
            Flashcard.user_id == current_user.id
        )
    )
    total_flashcards = flashcards_result.scalar() or 0

    # Average quiz score
    avg_score_result = await db.execute(
        select(func.avg(StudySession.score)).where(
            StudySession.user_id == current_user.id,
            StudySession.score.is_not(None),
        )
    )
    avg_quiz_score = avg_score_result.scalar()

    # Total study minutes
    total_minutes_result = await db.execute(
        select(func.coalesce(func.sum(StudySession.duration_minutes), 0)).where(
            StudySession.user_id == current_user.id
        )
    )
    total_study_minutes = total_minutes_result.scalar() or 0

    # TODO: Calculate study streak from session dates
    study_streak = 0

    return UserProgressResponse(
        total_sessions=total_sessions,
        total_materials=total_materials,
        total_flashcards=total_flashcards,
        study_streak=study_streak,
        avg_quiz_score=round(avg_quiz_score, 1) if avg_quiz_score else None,
        total_study_minutes=total_study_minutes,
    )
