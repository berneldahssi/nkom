"""Study material, flashcard, quiz, and session schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# ── Study Materials ──────────────────────────────────────────────


class MaterialCreateRequest(BaseModel):
    content_id: uuid.UUID
    title: str = Field(..., max_length=255)
    subject: str | None = None
    source_type: str | None = None


class MaterialResponse(BaseModel):
    id: uuid.UUID
    title: str
    subject: str | None
    description: str | None
    material_type: str
    exam_code: str | None
    source_type: str | None
    summary: str | None
    podcast_url: str | None
    generated_formats: dict | None
    difficulty_level: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class SectionResponse(BaseModel):
    id: uuid.UUID
    section_number: int | None
    title: str
    summary: str | None
    difficulty: str | None
    question_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class QuizQuestionPublicResponse(BaseModel):
    """Question for quiz/flashcard — correct_answer included (frontend controls visibility)."""

    id: uuid.UUID
    source_ref: str | None
    question_text: str
    question_type: str
    options: list[str] | None
    correct_answer: str
    hint: str | None
    difficulty: int | None

    model_config = {"from_attributes": True}


class FlashcardPublicResponse(BaseModel):
    id: uuid.UUID
    source_ref: str | None = None
    front_text: str
    back_text: str
    mnemonic_hint: str | None
    ease_factor: float
    interval: int
    next_review: datetime | None

    model_config = {"from_attributes": True}


class GenerateRequest(BaseModel):
    """Request to generate a specific output format from a study material."""

    format: str  # summary | podcast | flashcards | quiz


# ── Flashcards ───────────────────────────────────────────────────


class FlashcardResponse(BaseModel):
    id: uuid.UUID
    front_text: str
    back_text: str
    mnemonic_hint: str | None
    ease_factor: float
    interval: int
    next_review: datetime | None

    model_config = {"from_attributes": True}


class FlashcardReviewRequest(BaseModel):
    quality: int = Field(..., ge=0, le=5)  # SM-2 quality rating


# ── Quiz ─────────────────────────────────────────────────────────


class QuizQuestionResponse(BaseModel):
    id: uuid.UUID
    question_text: str
    question_type: str
    options: dict | None
    difficulty: int | None

    model_config = {"from_attributes": True}


class QuizSubmitRequest(BaseModel):
    answers: list[dict]  # [{"question_id": "...", "answer": "..."}]


class QuizResultResponse(BaseModel):
    total_questions: int
    correct: int
    score: float
    results: list[dict]  # per-question breakdown


# ── Study Sessions ───────────────────────────────────────────────


class SessionCreateRequest(BaseModel):
    material_id: uuid.UUID | None = None
    session_type: str  # review | quiz | podcast | study


class SessionResponse(BaseModel):
    id: uuid.UUID
    material_id: uuid.UUID | None
    session_type: str
    started_at: datetime
    ended_at: datetime | None
    duration_minutes: int | None
    cards_reviewed: int | None
    correct_answers: int | None
    score: float | None

    model_config = {"from_attributes": True}
