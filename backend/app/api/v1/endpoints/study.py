"""Study session, flashcard review, and quiz endpoints."""

import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.flashcard import Flashcard
from app.models.quiz import QuizQuestion
from app.models.study_session import StudySession
from app.models.user import User
from app.schemas.study import (
    FlashcardResponse,
    FlashcardReviewRequest,
    QuizQuestionResponse,
    QuizResultResponse,
    QuizSubmitRequest,
    SessionCreateRequest,
    SessionResponse,
)

router = APIRouter()


# ── Study Sessions ───────────────────────────────────────────────


@router.get("/sessions", response_model=list[SessionResponse])
async def list_sessions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[StudySession]:
    """List study sessions for the current user."""
    result = await db.execute(
        select(StudySession)
        .where(StudySession.user_id == current_user.id)
        .order_by(StudySession.started_at.desc())
        .limit(50)
    )
    return list(result.scalars().all())


@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def start_session(
    body: SessionCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudySession:
    """Start a new study session."""
    session = StudySession(
        user_id=current_user.id,
        material_id=body.material_id,
        session_type=body.session_type,
    )
    db.add(session)
    await db.flush()
    return session


@router.post("/sessions/{session_id}/complete", response_model=SessionResponse)
async def complete_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudySession:
    """Complete a study session and record duration."""
    session = await db.get(StudySession, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    session.ended_at = datetime.now(timezone.utc)
    if session.started_at:
        delta = session.ended_at - session.started_at
        session.duration_minutes = int(delta.total_seconds() / 60)
    await db.flush()
    return session


# ── Flashcard Review ─────────────────────────────────────────────


@router.get("/flashcards/due", response_model=list[FlashcardResponse])
async def get_due_flashcards(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[Flashcard]:
    """Get flashcards due for review (spaced repetition)."""
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(Flashcard)
        .where(
            Flashcard.user_id == current_user.id,
            (Flashcard.next_review <= now) | (Flashcard.next_review.is_(None)),
        )
        .order_by(Flashcard.next_review.asc().nullsfirst())
        .limit(20)
    )
    return list(result.scalars().all())


@router.post("/flashcards/{flashcard_id}/review", response_model=FlashcardResponse)
async def review_flashcard(
    flashcard_id: uuid.UUID,
    body: FlashcardReviewRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Flashcard:
    """Submit a review rating for a flashcard (SM-2 algorithm update)."""
    card = await db.get(Flashcard, flashcard_id)
    if not card or card.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard not found")

    # SM-2 algorithm
    q = body.quality
    if q < 3:
        # Incorrect — reset repetitions
        card.repetitions = 0
        card.interval = 1
    else:
        if card.repetitions == 0:
            card.interval = 1
        elif card.repetitions == 1:
            card.interval = 6
        else:
            card.interval = round(card.interval * card.ease_factor)

        card.repetitions += 1

    # Update ease factor
    card.ease_factor = max(
        1.3,
        card.ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
    )

    card.last_reviewed = datetime.now(timezone.utc)
    card.next_review = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0
    )
    # Add interval days — simplified; in production use timedelta
    from datetime import timedelta

    card.next_review = datetime.now(timezone.utc) + timedelta(days=card.interval)

    await db.flush()
    return card


# ── Quiz ─────────────────────────────────────────────────────────


@router.get("/quiz/{material_id}", response_model=list[QuizQuestionResponse])
async def get_quiz(
    material_id: uuid.UUID,
    randomize: bool = Query(True, description="Randomize question order and answers"),
    limit: int = Query(30, ge=1, le=100, description="Number of questions to return"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[QuizQuestion]:
    """Get quiz questions for a material.

    - `randomize`: If true, randomizes question order and shuffles answer options
    - `limit`: Number of questions to return (for random sampling from larger pools)
    """
    result = await db.execute(
        select(QuizQuestion).where(QuizQuestion.material_id == material_id)
    )
    questions = list(result.scalars().all())

    # If more questions than limit, randomly sample
    if len(questions) > limit:
        questions = random.sample(questions, limit)

    # Randomize question order and shuffle answers if requested
    if randomize and len(questions) > 0:
        random.shuffle(questions)
        # Shuffle answer options for each question
        for question in questions:
            if question.options and isinstance(question.options, list):
                # Keep track of which option is correct before shuffling
                correct_option = question.correct_answer
                shuffled_options = question.options.copy()
                random.shuffle(shuffled_options)
                question.options = shuffled_options

    return questions


@router.post("/quiz/submit", response_model=QuizResultResponse)
async def submit_quiz(
    body: QuizSubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> QuizResultResponse:
    """Submit quiz answers and get results."""
    results = []
    correct_count = 0

    for answer in body.answers:
        question = await db.get(QuizQuestion, answer["question_id"])
        if not question:
            continue
        is_correct = answer["answer"].strip().lower() == (question.correct_answer or "").strip().lower()
        if is_correct:
            correct_count += 1
        results.append(
            {
                "question_id": str(question.id),
                "correct": is_correct,
                "your_answer": answer["answer"],
                "correct_answer": question.correct_answer,
                "explanation": question.explanation,
            }
        )

    total = len(results)
    return QuizResultResponse(
        total_questions=total,
        correct=correct_count,
        score=round(correct_count / total * 100, 1) if total > 0 else 0,
        results=results,
    )
