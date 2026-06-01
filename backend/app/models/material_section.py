"""Material section model — groups questions/flashcards within a study material."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class MaterialSection(Base):
    __tablename__ = "material_sections"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    material_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("study_materials.id", ondelete="CASCADE"),
        index=True,
    )
    section_number: Mapped[int | None] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str | None] = mapped_column(Text)
    difficulty: Mapped[str | None] = mapped_column(String(20))  # easy | medium | hard
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    material = relationship("StudyMaterial", back_populates="sections")
    quiz_questions = relationship(
        "QuizQuestion", back_populates="section", lazy="select"
    )
    flashcards = relationship("Flashcard", back_populates="section", lazy="select")

    def __repr__(self) -> str:
        return f"<MaterialSection {self.section_number}: {self.title}>"
