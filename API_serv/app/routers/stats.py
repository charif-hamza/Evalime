# app/routers/stats.py
from functools import lru_cache
import time
from fastapi import APIRouter

from .. import models
from ..database import SessionLocal

router = APIRouter(prefix="/stats", tags=["Stats"])

CACHE_TTL = 3600  # 1 hour

def invalidate_caches() -> None:
    """Clear cached stats so new data is returned on next request."""
    _cached_topic_stats.cache_clear()
    _cached_progress.cache_clear()

@lru_cache(maxsize=128)
def _cached_topic_stats(user_id: int, ts: int):
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
def get_topic_stats(user_id: int, nocache: bool = False):
    ts = int(time.time() // CACHE_TTL) if not nocache else int(time.time())
    return _cached_topic_stats(user_id, ts)


@lru_cache(maxsize=128)
def _cached_progress(user_id: int, ts: int):
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
def get_progress(user_id: int, nocache: bool = False):
    ts = int(time.time() // CACHE_TTL) if not nocache else int(time.time())
    return _cached_progress(user_id, ts)
