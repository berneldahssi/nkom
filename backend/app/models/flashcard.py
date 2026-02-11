"""Flashcard model with spaced repetition fields (SM-2 algorithm)."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    material_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("study_materials.id", ondelete="CASCADE"),
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    front_text: Mapped[str] = mapped_column(Text, nullable=False)
    back_text: Mapped[str] = mapped_column(Text, nullable=False)
    mnemonic_hint: Mapped[str | None] = mapped_column(Text)

    # SM-2 spaced repetition fields
    ease_factor: Mapped[float] = mapped_column(Float, default=2.5)
    interval: Mapped[int] = mapped_column(Integer, default=0)  # days
    repetitions: Mapped[int] = mapped_column(Integer, default=0)
    next_review: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_reviewed: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    material = relationship("StudyMaterial", back_populates="flashcards")
    user = relationship("User", back_populates="flashcards")

    def __repr__(self) -> str:
        return f"<Flashcard {self.id} next_review={self.next_review}>"
