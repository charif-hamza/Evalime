"""Routes for storing user MCQ results."""

from datetime import datetime

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
        day=datetime.fromisoformat(payload.date),
        score=int(round(payload.score * 100)),
    )
    db.add(result)
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    return {"inserted": 1}


@router.get("/{user_id}", response_model=list[schemas.UserResult])
def list_results(user_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(models.UserResult)
        .filter(models.UserResult.user_id == user_id)
        .order_by(models.UserResult.day.desc())
        .all()
    )
    return [
        schemas.UserResult(
            bank_name=r.bank_name,
            date=r.day.date().isoformat(),
            score=r.score / 100,
        )
        for r in results
    ]
