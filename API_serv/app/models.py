# app/models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB  # Add this import

from .database import Base

# --- User Model ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

# Note: In a full refactor, User and UserAttempt models would also be here.
# I'm defining the models relevant to the 'questions' endpoint as requested.

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    summary_data = Column(JSONB, nullable=True)  # Stores evaluation metadata including ouvrage name
    
    # This establishes the one-to-many relationship
    # 'questions' will be a list of Question objects.
    questions = relationship("Question", back_populates="evaluation")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    question_image_url = Column(String, nullable=True)
    topic = Column(String, index=True, nullable=True)
    
    # Foreign Key to link back to the parent evaluation
    evaluation_id = Column(Integer, ForeignKey("evaluations.id"))

    # Establishes relationships to parent (Evaluation) and children (Choice)
    evaluation = relationship("Evaluation", back_populates="questions")
    choices = relationship("Choice", back_populates="question", cascade="all, delete-orphan")

class Choice(Base):
    __tablename__ = "choices"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String(1), nullable=False) # e.g., 'A', 'B', 'C'
    choice_text = Column(String, nullable=False)
    is_correct_solution = Column(Boolean, default=False, nullable=False)
    
    # Foreign Key to link back to the parent question
    question_id = Column(Integer, ForeignKey("questions.id"))
    
    # Establishes relationship back to the parent Question
    question = relationship("Question", back_populates="choices")


class QuestionTag(Base):
    """A label that can be applied to questions."""

    __tablename__ = "question_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    questions = relationship(
        "Question",
        secondary="question_tag_links",
        back_populates="tags",
    )


class QuestionTagLink(Base):
    """Many-to-many link table between questions and tags."""

    __tablename__ = "question_tag_links"

    question_id = Column(Integer, ForeignKey("questions.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("question_tags.id"), primary_key=True)


class UserAnswer(Base):
    """Stores a user's answer for a question."""

    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    choice_id = Column(Integer, ForeignKey("choices.id"))
    is_correct = Column(Boolean, default=False, nullable=False)
    duration_ms = Column(Integer, nullable=True)

    user = relationship("User")
    question = relationship("Question")
    choice = relationship("Choice")


# Establish many-to-many relationship on Question now that QuestionTag exists
Question.tags = relationship(
    "QuestionTag",
    secondary="question_tag_links",
    back_populates="questions",
)
