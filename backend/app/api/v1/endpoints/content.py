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

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "pdf", "mp3", "wav", "m4a", "txt"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


@router.post("/upload", response_model=ContentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_content(
    file: UploadFile = File(...),
    file_type: str | None = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> ContentUpload:
    """Upload an image, audio, PDF, or text file for processing."""
    # Read file content to validate and determine type
    content_data = await file.read()

    if len(content_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File is too large (max 25 MB)",
        )

    # Determine file type
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()

    if file_type:
        # Use provided file_type (from frontend)
        detected_type = file_type
    else:
        # Auto-detect
        if ext in {"jpg", "jpeg", "png", "gif"}:
            detected_type = "image"
        elif ext in {"mp3", "wav", "m4a"}:
            detected_type = "audio"
        elif ext == "pdf":
            detected_type = "pdf"
        elif ext in {"txt", "text"}:
            detected_type = "text"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: .{ext}",
            )

    # Store file URL (local storage for MVP, S3 later)
    file_id = str(uuid.uuid4())
    file_url = f"uploads/{current_user.id}/{file_id}.{ext}"

    # For text files, extract text immediately
    extracted_text = None
    processing_status = "pending"

    if detected_type == "text":
        try:
            extracted_text = content_data.decode("utf-8")
            processing_status = "completed"
        except UnicodeDecodeError:
            processing_status = "failed"

    content = ContentUpload(
        user_id=current_user.id,
        file_type=detected_type,
        file_url=file_url,
        original_filename=file.filename,
        extracted_text=extracted_text,
        processing_status=processing_status,
    )
    db.add(content)
    await db.flush()
    await db.commit()

    # TODO: Dispatch async processing task (Celery) for audio/image/pdf
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
