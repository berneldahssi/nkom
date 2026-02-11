"""Study material endpoints — create, list, generate formats."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.study import GenerateRequest, MaterialCreateRequest, MaterialResponse

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
    """Generate a specific output format (summary, podcast, flashcards, quiz)."""
    material = await db.get(StudyMaterial, material_id)
    if not material or material.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")

    # TODO: Dispatch AI generation task based on body.format
    # generate_format_task.delay(str(material.id), body.format)

    # Mark as in-progress
    formats = material.generated_formats or {}
    formats[body.format] = "generating"
    material.generated_formats = formats
    await db.flush()

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
