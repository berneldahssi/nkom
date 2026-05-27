"""Add cognito_sub to users and make password_hash nullable.

Revision ID: 002
Revises: 001
Create Date: 2026-05-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("cognito_sub", sa.String(length=128), nullable=True))
    op.create_index("ix_users_cognito_sub", "users", ["cognito_sub"], unique=True)
    # Cognito-only users have no local password hash
    op.alter_column("users", "password_hash", existing_type=sa.String(length=255), nullable=True)


def downgrade() -> None:
    # Re-populate password_hash with a placeholder before restoring NOT NULL
    op.execute("UPDATE users SET password_hash = 'COGNITO_USER' WHERE password_hash IS NULL")
    op.alter_column("users", "password_hash", existing_type=sa.String(length=255), nullable=False)
    op.drop_index("ix_users_cognito_sub", table_name="users")
    op.drop_column("users", "cognito_sub")
