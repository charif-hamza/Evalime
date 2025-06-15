from sqlalchemy import text
from sqlalchemy.orm import Session
from .database import SessionLocal


def refresh_user_topic_stats():
    """Recalculate topic stats for all users."""
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM user_topic_stats"))
        db.execute(
            text(
                """
                INSERT INTO user_topic_stats (user_id, tag_id, attempts, correct)
                SELECT ua.user_id, qtl.tag_id,
                       COUNT(*) AS attempts,
                       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct
                FROM user_answers ua
                JOIN question_tag_links qtl ON ua.question_id = qtl.question_id
                GROUP BY ua.user_id, qtl.tag_id
                """
            )
        )
        db.commit()
    finally:
        db.close()


def update_user_topic_stats(db: Session, user_id: int) -> None:
    """Update topic stats for a single user."""
    db.execute(text("DELETE FROM user_topic_stats WHERE user_id = :uid"), {"uid": user_id})
    db.execute(
        text(
            """
            INSERT INTO user_topic_stats (user_id, tag_id, attempts, correct)
            SELECT ua.user_id, qtl.tag_id,
                   COUNT(*) AS attempts,
                   SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) AS correct
            FROM user_answers ua
            JOIN question_tag_links qtl ON ua.question_id = qtl.question_id
            WHERE ua.user_id = :uid
            GROUP BY ua.user_id, qtl.tag_id
            """
        ),
        {"uid": user_id},
    )


def refresh_user_daily_scores():
    """Aggregate daily score totals for each user."""
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM user_daily_scores"))
        db.execute(
            text(
                """
                INSERT INTO user_daily_scores (user_id, day, score)
                SELECT ua.user_id, DATE(ua.answered_at) as day,
                       SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as score
                FROM user_answers ua
                GROUP BY ua.user_id, DATE(ua.answered_at)
                """
            )
        )
        db.commit()
    finally:
        db.close()


def update_user_daily_scores(db: Session, user_id: int) -> None:
    """Update daily scores for a single user."""
    db.execute(text("DELETE FROM user_daily_scores WHERE user_id = :uid"), {"uid": user_id})
    db.execute(
        text(
            """
            INSERT INTO user_daily_scores (user_id, day, score)
            SELECT ua.user_id, DATE(ua.answered_at) as day,
                   SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as score
            FROM user_answers ua
            WHERE ua.user_id = :uid
            GROUP BY ua.user_id, DATE(ua.answered_at)
            """
        ),
        {"uid": user_id},
    )
