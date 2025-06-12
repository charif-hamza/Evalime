# app/crud.py
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

from . import models

def get_questions_by_evaluation(db: Session, eval_id: int):
    """
    Retrieves all questions and their associated choices for a given evaluation ID.
    
    Args:
        db (Session): The database session.
        eval_id (int): The ID of the evaluation.
        
    Returns:
        A list of Question ORM objects, with their choices eagerly loaded.
    """
    questions = (
        db.query(models.Question)
        .filter(models.Question.evaluation_id == eval_id)
        .options(
            # joinedload is an "eager load" strategy. It fetches the related
            # choices in the same query, preventing the "N+1" problem.
            joinedload(models.Question.choices)
        )
        .order_by(models.Question.id)
        .all()
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail=f"No questions found for evaluation ID {eval_id}."
        )
        
    # To ensure choices are sorted by identifier (e.g., A, B, C)
    for question in questions:
        question.choices.sort(key=lambda x: x.identifier)

    return questions