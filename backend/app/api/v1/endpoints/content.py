"""Content upload and processing endpoints."""

import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.content import ContentUpload
from app.models.user import User
from app.schemas.content import ContentExtractResponse, ContentTextInput, ContentUploadResponse

router = APIRouter()

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "pdf", "mp3", "wav", "m4a"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


@router.post("/upload", response_model=ContentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_content(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> ContentUpload:
    """Upload an image, audio, or PDF file for processing."""
    # Validate extension
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: .{ext}",
        )

    # Determine file type category
    if ext in {"jpg", "jpeg", "png", "gif"}:
        file_type = "image"
    elif ext in {"mp3", "wav", "m4a"}:
        file_type = "audio"
    elif ext == "pdf":
        file_type = "pdf"
    else:
        file_type = "other"

    # TODO: Upload to S3 and get URL
    file_url = f"uploads/{current_user.id}/{uuid.uuid4()}.{ext}"

    content = ContentUpload(
        user_id=current_user.id,
        file_type=file_type,
        file_url=file_url,
        original_filename=file.filename,
        processing_status="pending",
    )
    db.add(content)
    await db.flush()

    # TODO: Dispatch async processing task (Celery)
    # process_content.delay(str(content.id))

    return content


@router.post("/text", response_model=ContentUploadResponse, status_code=status.HTTP_201_CREATED)
async def submit_text(
    body: ContentTextInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> ContentUpload:
    """Submit raw text instead of uploading a file."""
    content = ContentUpload(
        user_id=current_user.id,
        file_type="text",
        original_filename=body.title,
        extracted_text=body.text,
        processing_status="completed",
    )
    db.add(content)
    await db.flush()
    return content


@router.get("/{content_id}", response_model=ContentUploadResponse)
async def get_content(
    content_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> ContentUpload:
    """Get a specific content upload."""
    content = await db.get(ContentUpload, content_id)
    if not content or content.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")
    return content


@router.get("/{content_id}/extract", response_model=ContentExtractResponse)
async def get_extraction(
    content_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> ContentUpload:
    """Get the extracted text and concepts for a content upload."""
    content = await db.get(ContentUpload, content_id)
    if not content or content.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")
    return content


@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    content_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a content upload and its associated file."""
    content = await db.get(ContentUpload, content_id)
    if not content or content.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")
    # TODO: Delete file from S3
    await db.delete(content)
