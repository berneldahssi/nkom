"""User model."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(100))
    last_name: Mapped[str | None] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(20))
    country: Mapped[str | None] = mapped_column(String(100))
    timezone: Mapped[str | None] = mapped_column(String(50))
    learning_style: Mapped[str | None] = mapped_column(
        String(20)
    )  # visual | auditory | reading | kinesthetic
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    subscription_tier: Mapped[str | None] = mapped_column(
        String(20)
    )  # free | student | pro | family
    subscription_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    last_active: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    content_uploads = relationship("ContentUpload", back_populates="user", lazy="selectin")
    study_materials = relationship("StudyMaterial", back_populates="user", lazy="selectin")
    flashcards = relationship("Flashcard", back_populates="user", lazy="selectin")
    study_sessions = relationship("StudySession", back_populates="user", lazy="selectin")

    def __repr__(self) -> str:
        return f"<User {self.email}>"
