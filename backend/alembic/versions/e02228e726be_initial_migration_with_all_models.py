"""Initial migration with all models

Revision ID: e02228e726be
Revises: 
Create Date: 2025-11-03 19:57:11.367016

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e02228e726be'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create all tables based on SQLAlchemy models metadata
    # Note: Using Base.metadata.create_all for the initial migration keeps schema
    # in sync with models without hand-writing every table. Future migrations
    # should be generated with Alembic revisions.
    from alembic import op
    bind = op.get_bind()
    
    # Import Base and models to ensure metadata is populated
    from app.database import Base  # type: ignore
    from app import models  # noqa: F401  # Ensure models are imported and registered

    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    # Drop all tables created by the initial migration
    from alembic import op
    bind = op.get_bind()

    from app.database import Base  # type: ignore
    from app import models  # noqa: F401

    Base.metadata.drop_all(bind=bind)
