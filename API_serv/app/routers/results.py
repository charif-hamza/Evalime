"""Routes for storing user MCQ results."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/results", tags=["Results"], redirect_slashes=False)

@router.post("")
@router.post("/")
def submit_result(payload: schemas.UserResultCreate, db: Session = Depends(get_db)):
    result = models.UserResult(
        user_id=payload.user_id,
        bank_name=payload.bank_name,
        score=int(round(payload.score * 100))
    )
    db.add(result)
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    return {"inserted": 1}
