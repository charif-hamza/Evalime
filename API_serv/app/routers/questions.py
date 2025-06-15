# app/routers/questions.py
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/evaluations",
    tags=["Evaluations and Questions"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{evaluation_id}/questions",
    response_model=List[schemas.Question],
    response_model_by_alias=True,
)
def get_questions_for_evaluation(evaluation_id: int, db: Session = Depends(get_db)):
    """
    Fetches all questions, with their choices, for a specific evaluation.
    The response model ensures the data is shaped according to the `schemas.Question`
    and `schemas.Choice` Pydantic models.
    """
    questions = crud.get_questions_by_evaluation(db=db, eval_id=evaluation_id)
    return questions


# This schema is defined here for clarity, but ideally lives in schemas.py
class EvaluationCard(schemas.EvaluationInList):
    year: Optional[int] = None
    department: Optional[str] = None


@router.get("/list", response_model=List[EvaluationCard])
async def list_evaluations(db: Session = Depends(get_db)):
    """List all evaluations with metadata for displaying as cards."""
    try:
        evaluations = db.query(models.Evaluation).all()
        result = []
        for ev in evaluations:
            summary: dict[str, Any] = (
                ev.summary_data if isinstance(ev.summary_data, dict) else {}
            )

            # Fallback to a default title if ouvrage isn't present
            ouvrage = (
                summary.get("ouvrage")
                or getattr(ev, "title", None)
                or f"Evaluation #{ev.id}"
            )

            result.append(
                {
                    "id": ev.id,
                    "ouvrage": ouvrage,
                    "epreuve": summary.get("epreuve", ""),
                    "type_question": summary.get("type_question", ""),
                    "total_question": str(summary.get("total_question", "0")),
                    # NEW: Add year and department from summary_data
                    "year": summary.get("year"),
                    "department": summary.get("department"),
                }
            )
        return result
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
