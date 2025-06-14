"""Add question_tags tables and duration to user_answers

Revision ID: 0001
Revises: 
Create Date: 2023-01-01 00:00:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'question_tags',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False, unique=True)
    )
    op.create_table(
        'question_tag_links',
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id']),
        sa.ForeignKeyConstraint(['tag_id'], ['question_tags.id']),
        sa.PrimaryKeyConstraint('question_id', 'tag_id')
    )
    op.add_column('user_answers', sa.Column('duration_ms', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('user_answers', 'duration_ms')
    op.drop_table('question_tag_links')
    op.drop_table('question_tags')
