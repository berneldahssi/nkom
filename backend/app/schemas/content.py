"""Content upload request/response schemas."""

import uuid
from datetime import datetime

from pydantic import BaseModel


class ContentUploadResponse(BaseModel):
    id: uuid.UUID
    file_type: str
    original_filename: str | None
    processing_status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ContentExtractResponse(BaseModel):
    id: uuid.UUID
    extracted_text: str | None
    extracted_concepts: dict | None
    processing_status: str

    model_config = {"from_attributes": True}


class ContentTextInput(BaseModel):
    """For pasting text directly instead of uploading a file."""

    text: str
    title: str | None = None
