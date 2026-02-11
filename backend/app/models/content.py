"""Content upload model — represents raw uploaded learning material."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ContentUpload(Base):
    __tablename__ = "content_uploads"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    file_type: Mapped[str] = mapped_column(
        String(20)
    )  # image | audio | pdf | text
    file_url: Mapped[str | None] = mapped_column(String(500))
    original_filename: Mapped[str | None] = mapped_column(String(255))
    extracted_text: Mapped[str | None] = mapped_column(Text)
    extracted_concepts: Mapped[dict | None] = mapped_column(JSONB)
    processing_status: Mapped[str] = mapped_column(
        String(20), default="pending"
    )  # pending | processing | completed | failed
    error_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="content_uploads")
    study_materials = relationship("StudyMaterial", back_populates="content", lazy="selectin")

    def __repr__(self) -> str:
        return f"<ContentUpload {self.id} [{self.file_type}] {self.processing_status}>"
