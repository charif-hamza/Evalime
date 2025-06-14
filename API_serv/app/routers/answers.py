"""Routes for submitting user answers."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .. import models, schemas
from ..database import get_db


router = APIRouter(prefix="/answers", tags=["Answers"], redirect_slashes=False)


@router.post("")
@router.post("/")  # Accept both /answers and /answers/
def submit_answers(payload: schemas.BulkUserAnswerCreate, db: Session = Depends(get_db)):
    """Persist user answers and mark correctness."""
    inserted = 0
    for ans in payload.answers:
        choice = db.get(models.Choice, ans.choice_id)
        if not choice:
            raise HTTPException(status_code=400, detail=f"Choice {ans.choice_id} not found")
        ua = models.UserAnswer(
            user_id=payload.user_id,
            question_id=ans.question_id,
            choice_id=ans.choice_id,
            duration_ms=ans.duration_ms,
            is_correct=choice.is_correct_solution,
        )
        db.add(ua)
        inserted += 1
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    return {"inserted": inserted}

