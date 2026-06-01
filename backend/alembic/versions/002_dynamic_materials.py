"""Dynamic materials: Cognito auth + material_sections + section FKs on questions/flashcards.

Revision ID: 002
Revises: 001
Create Date: 2026-06-01
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── users: add cognito_sub, make password_hash nullable ──────
    op.add_column(
        "users",
        sa.Column("cognito_sub", sa.String(length=128), nullable=True),
    )
    op.create_unique_constraint("uq_users_cognito_sub", "users", ["cognito_sub"])
    op.create_index("ix_users_cognito_sub", "users", ["cognito_sub"])
    op.alter_column("users", "password_hash", existing_type=sa.String(255), nullable=True)

    # ── study_materials: add material_type, exam_code ─────────────
    op.add_column(
        "study_materials",
        sa.Column("material_type", sa.String(length=20), nullable=False, server_default="uploaded"),
    )
    op.add_column(
        "study_materials",
        sa.Column("exam_code", sa.String(length=20), nullable=True),
    )
    op.create_index("ix_study_materials_exam_code", "study_materials", ["exam_code"])

    # ── material_sections (new table) ─────────────────────────────
    op.create_table(
        "material_sections",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("material_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("section_number", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("difficulty", sa.String(length=20), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.ForeignKeyConstraint(
            ["material_id"], ["study_materials.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_material_sections_material_id"),
        "material_sections",
        ["material_id"],
    )

    # ── quiz_questions: add section_id, source_ref, hint ──────────
    op.add_column(
        "quiz_questions",
        sa.Column("section_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "quiz_questions",
        sa.Column("source_ref", sa.String(length=20), nullable=True),
    )
    op.add_column(
        "quiz_questions",
        sa.Column("hint", sa.Text(), nullable=True),
    )
    op.create_foreign_key(
        "fk_quiz_questions_section_id",
        "quiz_questions",
        "material_sections",
        ["section_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_quiz_questions_section_id", "quiz_questions", ["section_id"])

    # ── flashcards: add section_id ────────────────────────────────
    op.add_column(
        "flashcards",
        sa.Column("section_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_foreign_key(
        "fk_flashcards_section_id",
        "flashcards",
        "material_sections",
        ["section_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_flashcards_section_id", "flashcards", ["section_id"])


def downgrade() -> None:
    op.drop_index("ix_flashcards_section_id", table_name="flashcards")
    op.drop_constraint("fk_flashcards_section_id", "flashcards", type_="foreignkey")
    op.drop_column("flashcards", "section_id")

    op.drop_index("ix_quiz_questions_section_id", table_name="quiz_questions")
    op.drop_constraint("fk_quiz_questions_section_id", "quiz_questions", type_="foreignkey")
    op.drop_column("quiz_questions", "hint")
    op.drop_column("quiz_questions", "source_ref")
    op.drop_column("quiz_questions", "section_id")

    op.drop_index(op.f("ix_material_sections_material_id"), table_name="material_sections")
    op.drop_table("material_sections")

    op.drop_index("ix_study_materials_exam_code", table_name="study_materials")
    op.drop_column("study_materials", "exam_code")
    op.drop_column("study_materials", "material_type")

    op.alter_column("users", "password_hash", existing_type=sa.String(255), nullable=False)
    op.drop_index("ix_users_cognito_sub", table_name="users")
    op.drop_constraint("uq_users_cognito_sub", "users", type_="unique")
    op.drop_column("users", "cognito_sub")
