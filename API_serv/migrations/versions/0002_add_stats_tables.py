"""Add user stats tables and answered_at column

Revision ID: 0002
Revises: 0001
Create Date: 2025-01-01 00:00:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'user_topic_stats',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.Column('attempts', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('correct', sa.Integer(), nullable=False, server_default='0'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['tag_id'], ['question_tags.id']),
        sa.PrimaryKeyConstraint('user_id', 'tag_id')
    )
    op.create_table(
        'user_daily_scores',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('day', sa.DateTime(), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False, server_default='0'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('user_id', 'day')
    )


def downgrade():
    op.drop_table('user_daily_scores')
    op.drop_table('user_topic_stats')
