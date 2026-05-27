"""Add cognito_sub to users and make password_hash nullable.

Revision ID: 002
Revises: 001
Create Date: 2026-05-27

Cognito users authenticate via JWT — they never set a local password,
so password_hash must be nullable. cognito_sub is the Cognito user UUID
used to look up or auto-provision accounts on first login.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("cognito_sub", sa.String(length=128), nullable=True),
    )
    op.create_index("ix_users_cognito_sub", "users", ["cognito_sub"], unique=True)
    op.alter_column(
        "users",
        "password_hash",
        existing_type=sa.String(length=255),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "users",
        "password_hash",
        existing_type=sa.String(length=255),
        nullable=False,
    )
    op.drop_index("ix_users_cognito_sub", table_name="users")
    op.drop_column("users", "cognito_sub")
