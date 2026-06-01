"""Study material model — AI-transformed learning content."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    content_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("content_uploads.id", ondelete="SET NULL"),
    )
    title: Mapped[str] = mapped_column(String(255))
    subject: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    material_type: Mapped[str] = mapped_column(String(20), default="uploaded")  # preset | uploaded
    exam_code: Mapped[str | None] = mapped_column(String(20), nullable=True, index=True)  # PSTAR | ROC-A | null
    source_type: Mapped[str | None] = mapped_column(
        String(50)
    )  # lecture_notes | textbook | article | other
    summary: Mapped[str | None] = mapped_column(Text)
    podcast_url: Mapped[str | None] = mapped_column(String(500))
    generated_formats: Mapped[dict | None] = mapped_column(
        JSONB
    )  # tracks which formats have been generated
    difficulty_level: Mapped[int | None] = mapped_column(Integer)  # 1-5
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="study_materials")
    content = relationship("ContentUpload", back_populates="study_materials")
    sections = relationship(
        "MaterialSection", back_populates="material", lazy="select",
        order_by="MaterialSection.section_number"
    )
    flashcards = relationship("Flashcard", back_populates="material", lazy="select")
    quiz_questions = relationship("QuizQuestion", back_populates="material", lazy="select")

    def __repr__(self) -> str:
        return f"<StudyMaterial {self.title}>"
