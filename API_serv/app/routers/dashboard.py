from typing import List, Dict
from fastapi import APIRouter, HTTPException

from ..schemas import QuestionPerformance, DashboardInsights, TopicInsight

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    responses={404: {"description": "Not found"}},
)


def _classify_status(acc: float) -> str:
    """Helper to classify a topic performance into strength / blind-spot / moderate."""
    if acc >= 0.75:
        return "strength"
    if acc < 0.5:
        return "blind-spot"
    return "moderate"


@router.post("/insights", response_model=DashboardInsights)
async def compute_insights(performance: List[QuestionPerformance]):
    """Compute strengths and blind-spots from question-level performance.

    The endpoint expects the *same* payload the LLM receives — a list of questions with
    information on whether the student's answer was correct or not. Only questions the
    user requested an explanation for should be sent.
    """

    if not performance:
        raise HTTPException(status_code=400, detail="No performance data provided.")

    total_questions = len(performance)
    correct = sum(1 for p in performance if p.is_correct)
    incorrect = total_questions - correct
    accuracy = correct / total_questions if total_questions else 0.0

    # --- Aggregate by topic ---
    topic_stats: Dict[str, Dict[str, int]] = {}
    for p in performance:
        topic_key = p.topic or "Misc"
        if topic_key not in topic_stats:
            topic_stats[topic_key] = {"correct": 0, "total": 0}
        topic_stats[topic_key]["total"] += 1
        if p.is_correct:
            topic_stats[topic_key]["correct"] += 1

    topic_breakdown: List[TopicInsight] = []
    strengths: List[str] = []
    blind_spots: List[str] = []

    for topic, stats in topic_stats.items():
        acc = stats["correct"] / stats["total"] if stats["total"] else 0.0
        status = _classify_status(acc)
        if status == "strength":
            strengths.append(topic)
        elif status == "blind-spot":
            blind_spots.append(topic)
        topic_breakdown.append(
            TopicInsight(
                topic=topic,
                correct=stats["correct"],
                total=stats["total"],
                accuracy=round(acc, 2),
                status=status,
            )
        )

    insights = DashboardInsights(
        total_questions=total_questions,
        correct=correct,
        incorrect=incorrect,
        accuracy=round(accuracy, 2),
        topic_breakdown=topic_breakdown,
        strengths=strengths,
        blind_spots=blind_spots,
    )

    return insights 