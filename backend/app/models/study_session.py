"""Study session model — tracks a user's study activity."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class StudySession(Base):
    __tablename__ = "study_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    material_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("study_materials.id", ondelete="SET NULL"),
    )
    session_type: Mapped[str] = mapped_column(
        String(50)
    )  # review | quiz | podcast | study
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int | None] = mapped_column(Integer)
    cards_reviewed: Mapped[int | None] = mapped_column(Integer)
    correct_answers: Mapped[int | None] = mapped_column(Integer)
    score: Mapped[float | None] = mapped_column(Float)

    # Relationships
    user = relationship("User", back_populates="study_sessions")
    material = relationship("StudyMaterial")

    def __repr__(self) -> str:
        return f"<StudySession {self.id} [{self.session_type}]>"
