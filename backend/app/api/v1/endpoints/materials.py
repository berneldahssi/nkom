"""Study material endpoints — create, list, generate formats."""

import uuid
import structlog

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.study import GenerateRequest, MaterialCreateRequest, MaterialResponse
from app.services import ai_service

logger = structlog.get_logger()

router = APIRouter()


@router.post("/", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
async def create_material(
    body: MaterialCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudyMaterial:
    """Create a new study material from processed content."""
    material = StudyMaterial(
        user_id=current_user.id,
        content_id=body.content_id,
        title=body.title,
        subject=body.subject,
        source_type=body.source_type,
        generated_formats={},
    )
    db.add(material)
    await db.flush()
    return material


@router.get("/", response_model=list[MaterialResponse])
async def list_materials(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[StudyMaterial]:
    """List all study materials for the current user."""
    result = await db.execute(
        select(StudyMaterial)
        .where(StudyMaterial.user_id == current_user.id)
        .order_by(StudyMaterial.created_at.desc())
    )
    return list(result.scalars().all())


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(
    material_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudyMaterial:
    """Get a specific study material."""
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
    return material


@router.post("/{material_id}/generate", response_model=MaterialResponse)
async def generate_format(
    material_id: uuid.UUID,
    body: GenerateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StudyMaterial:
    """Generate a specific output format (summary, flashcards, quiz)."""
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    # Get the text content to generate from
    text_content = material.summary or ""

    # If we don't have extracted text in material yet, try to get it from content
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
        # Generate based on format type
        if body.format == "summary":
            if not material.summary:
                material.summary = await ai_service.generate_summary(text_content)
        elif body.format == "flashcards":
            from app.models.flashcard import Flashcard
            flashcards_data = await ai_service.generate_flashcards(text_content)
            for fc_data in flashcards_data:
                flashcard = Flashcard(
                    material_id=material_id,
                    user_id=current_user.id,
                    front_text=fc_data.get("front", ""),
                    back_text=fc_data.get("back", ""),
                    mnemonic_hint=fc_data.get("mnemonic_hint"),
                )
                db.add(flashcard)
        elif body.format == "quiz":
            from app.models.quiz import QuizQuestion
            quiz_data = await ai_service.generate_quiz(text_content)
            for q_data in quiz_data:
                question = QuizQuestion(
                    material_id=material_id,
                    question_text=q_data.get("question", ""),
                    question_type="multiple_choice",
                    options=q_data.get("options"),
                    correct_answer=q_data.get("correct_answer", ""),
                    explanation=q_data.get("explanation"),
                    difficulty=q_data.get("difficulty", 2),
                )
                db.add(question)

        # Mark as completed
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
            detail=f"Failed to generate {body.format}: {str(e)}"
        )

    return material


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_material(
    material_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a study material and all associated generated content."""
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
    await db.delete(material)
