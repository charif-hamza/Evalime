# app/routers/stats.py
from functools import lru_cache
import time
from fastapi import APIRouter

from .. import models
from ..database import SessionLocal
from ..aggregation import refresh_user_topic_stats, refresh_user_daily_scores

router = APIRouter(prefix="/stats", tags=["Stats"])

CACHE_TTL = 3600  # 1 hour

@lru_cache(maxsize=128)
def _cached_topic_stats(user_id: int, ts: int):
    refresh_user_topic_stats()
    db = SessionLocal()
    try:
        rows = (
            db.query(models.UserTopicStats)
            .filter(models.UserTopicStats.user_id == user_id)
            .all()
        )
        return [
            {
                "tag_id": r.tag_id,
                "attempts": r.attempts,
                "correct": r.correct,
            }
            for r in rows
        ]
    finally:
        db.close()

@router.get("/topic/{user_id}")
def get_topic_stats(user_id: int):
    ts = int(time.time() // CACHE_TTL)
    return _cached_topic_stats(user_id, ts)


@lru_cache(maxsize=128)
def _cached_progress(user_id: int, ts: int):
    refresh_user_daily_scores()
    db = SessionLocal()
    try:
        rows = (
            db.query(models.UserDailyScore)
            .filter(models.UserDailyScore.user_id == user_id)
            .order_by(models.UserDailyScore.day)
            .all()
        )
        return [
            {"day": r.day.isoformat(), "score": r.score}
            for r in rows
        ]
    finally:
        db.close()

@router.get("/progress/{user_id}")
def get_progress(user_id: int):
    ts = int(time.time() // CACHE_TTL)
    return _cached_progress(user_id, ts)
