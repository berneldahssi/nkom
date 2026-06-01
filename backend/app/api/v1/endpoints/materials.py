"""Study material endpoints — CRUD + sections + questions + flashcards."""

import uuid
import structlog

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.flashcard import Flashcard
from app.models.material_section import MaterialSection
from app.models.quiz import QuizQuestion
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.study import (
    FlashcardPublicResponse,
    GenerateRequest,
    MaterialCreateRequest,
    MaterialResponse,
    QuizQuestionPublicResponse,
    SectionResponse,
)
from app.services import ai_service

logger = structlog.get_logger()

router = APIRouter()


# ── Materials ─────────────────────────────────────────────────────


@router.post("/", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
async def create_material(
    body: MaterialCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudyMaterial:
    material = StudyMaterial(
        user_id=current_user.id,
        content_id=body.content_id,
        title=body.title,
        subject=body.subject,
        source_type=body.source_type,
        material_type="uploaded",
        generated_formats={},
    )
    db.add(material)
    await db.flush()
    await db.commit()
    return material


@router.get("/", response_model=list[MaterialResponse])
async def list_materials(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[StudyMaterial]:
    result = await db.execute(
        select(StudyMaterial)
        .where(StudyMaterial.user_id == current_user.id)
        .order_by(StudyMaterial.created_at.asc())
    )
    return list(result.scalars().all())


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(
    material_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudyMaterial:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
    return material


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_material(
    material_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
    await db.delete(material)
    await db.commit()


# ── Sections ──────────────────────────────────────────────────────


@router.get("/{material_id}/sections", response_model=list[SectionResponse])
async def list_sections(
    material_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[SectionResponse]:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    result = await db.execute(
        select(MaterialSection)
        .where(MaterialSection.material_id == material_id)
        .order_by(MaterialSection.section_number)
    )
    sections = list(result.scalars().all())

    # Attach question counts
    responses = []
    for s in sections:
        count_result = await db.execute(
            select(QuizQuestion).where(QuizQuestion.section_id == s.id)
        )
        q_count = len(count_result.scalars().all())
        responses.append(
            SectionResponse(
                id=s.id,
                section_number=s.section_number,
                title=s.title,
                summary=s.summary,
                difficulty=s.difficulty,
                question_count=q_count,
                created_at=s.created_at,
            )
        )
    return responses


@router.get("/{material_id}/sections/{section_id}", response_model=SectionResponse)
async def get_section(
    material_id: uuid.UUID,
    section_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> SectionResponse:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    section = await db.get(MaterialSection, section_id)
    if not section or section.material_id != material_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")

    count_result = await db.execute(
        select(QuizQuestion).where(QuizQuestion.section_id == section_id)
    )
    q_count = len(count_result.scalars().all())

    return SectionResponse(
        id=section.id,
        section_number=section.section_number,
        title=section.title,
        summary=section.summary,
        difficulty=section.difficulty,
        question_count=q_count,
        created_at=section.created_at,
    )


# ── Questions ─────────────────────────────────────────────────────


@router.get(
    "/{material_id}/sections/{section_id}/questions",
    response_model=list[QuizQuestionPublicResponse],
)
async def list_questions(
    material_id: uuid.UUID,
    section_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[QuizQuestionPublicResponse]:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    result = await db.execute(
        select(QuizQuestion)
        .where(
            QuizQuestion.material_id == material_id,
            QuizQuestion.section_id == section_id,
        )
        .order_by(QuizQuestion.source_ref)
    )
    questions = list(result.scalars().all())

    return [
        QuizQuestionPublicResponse(
            id=q.id,
            source_ref=q.source_ref,
            question_text=q.question_text,
            question_type=q.question_type,
            options=q.options if isinstance(q.options, list) else None,
            correct_answer=q.correct_answer,
            hint=q.hint,
            difficulty=q.difficulty,
        )
        for q in questions
    ]


# ── Flashcards ────────────────────────────────────────────────────


@router.get(
    "/{material_id}/sections/{section_id}/flashcards",
    response_model=list[FlashcardPublicResponse],
)
async def list_flashcards(
    material_id: uuid.UUID,
    section_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[FlashcardPublicResponse]:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    result = await db.execute(
        select(Flashcard).where(
            Flashcard.material_id == material_id,
            Flashcard.section_id == section_id,
            Flashcard.user_id == current_user.id,
        )
    )
    flashcards = list(result.scalars().all())

    # Enrich with source_ref from matching quiz question
    ref_result = await db.execute(
        select(QuizQuestion).where(
            QuizQuestion.section_id == section_id,
            QuizQuestion.material_id == material_id,
        )
    )
    q_by_text = {q.question_text: q.source_ref for q in ref_result.scalars().all()}

    return [
        FlashcardPublicResponse(
            id=fc.id,
            source_ref=q_by_text.get(fc.front_text),
            front_text=fc.front_text,
            back_text=fc.back_text,
            mnemonic_hint=fc.mnemonic_hint,
            ease_factor=fc.ease_factor,
            interval=fc.interval,
            next_review=fc.next_review,
        )
        for fc in flashcards
    ]


# ── Generate ──────────────────────────────────────────────────────


@router.post("/{material_id}/generate", response_model=MaterialResponse)
async def generate_format(
    material_id: uuid.UUID,
    body: GenerateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudyMaterial:
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    text_content = material.summary or ""
    if not text_content and material.content_id:
        from app.models.content import ContentUpload
        content = await db.get(ContentUpload, material.content_id)
        text_content = content.extracted_text if content else ""

    if not text_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No text content available to generate from",
        )

    try:
        if body.format == "summary":
            if not material.summary:
                material.summary = await ai_service.generate_summary(text_content)
        elif body.format == "flashcards":
            flashcards_data = await ai_service.generate_flashcards(text_content)
            for fc_data in flashcards_data:
                db.add(Flashcard(
                    material_id=material_id,
                    user_id=current_user.id,
                    front_text=fc_data.get("front", ""),
                    back_text=fc_data.get("back", ""),
                    mnemonic_hint=fc_data.get("mnemonic_hint"),
                ))
        elif body.format == "quiz":
            quiz_data = await ai_service.generate_quiz(text_content)
            for q_data in quiz_data:
                db.add(QuizQuestion(
                    material_id=material_id,
                    question_text=q_data.get("question", ""),
                    question_type="multiple_choice",
                    options=q_data.get("options"),
                    correct_answer=q_data.get("correct_answer", ""),
                    explanation=q_data.get("explanation"),
                    difficulty=q_data.get("difficulty", 2),
                ))

        formats = material.generated_formats or {}
        formats[body.format] = "completed"
        material.generated_formats = formats
        await db.flush()
        await db.commit()

    except Exception as e:
        logger.error("Generation failed", format=body.format, error=str(e))
        formats = material.generated_formats or {}
        formats[body.format] = "failed"
        material.generated_formats = formats
        await db.flush()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate {body.format}: {str(e)}",
        )

    return material
