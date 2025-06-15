import os
os.environ.setdefault("JWT_SECRET", "testsecret")
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from API_serv.app.main import app
from API_serv.app import models
from API_serv.app import database
from API_serv.app.database import Base, get_db


DB_FILE = "test.db"
if os.path.exists(DB_FILE):
    os.remove(DB_FILE)
DATABASE_URL = f"sqlite:///{DB_FILE}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)
database.engine = engine
database.SessionLocal = TestingSessionLocal


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_submit_answers():
    db = TestingSessionLocal()
    user = models.User(username="u", hashed_password="h")
    eval = models.Evaluation(summary_data={})
    question = models.Question(question_text="q", evaluation=eval)
    choice = models.Choice(identifier="A", choice_text="a", is_correct_solution=True, question=question)
    tag = models.QuestionTag(name="t")
    db.add_all([user, eval, question, choice, tag])
    db.commit()
    db.refresh(user)
    db.refresh(question)
    db.refresh(choice)
    db.refresh(tag)
    user_id = user.id
    question_id = question.id
    choice_id = choice.id
    tag_id = tag.id
    link = models.QuestionTagLink(question_id=question_id, tag_id=tag_id)
    db.add(link)
    db.commit()
    db.close()

    payload = {"user_id": user_id, "answers": [{"question_id": question_id, "choice_id": choice_id}]}
    resp = client.post("/api/answers", json=payload)
    assert resp.status_code == 200
    assert resp.json().get("inserted") == 1

    db2 = TestingSessionLocal()
    stored = db2.query(models.UserAnswer).filter_by(user_id=user_id).one()
    assert stored.is_correct is True
    # check aggregated stats
    topic = db2.query(models.UserTopicStats).filter_by(user_id=user_id, tag_id=tag_id).one()
    assert topic.attempts == 1
    assert topic.correct == 1
    daily = db2.query(models.UserDailyScore).filter_by(user_id=user_id).one()
    assert daily.score == 1
    db2.close()


def test_results_submission_and_listing():
    db = TestingSessionLocal()
    user = models.User(username="u2", hashed_password="h")
    db.add(user)
    db.commit()
    db.refresh(user)
    user_id = user.id
    db.close()

    payload = {"userId": user_id, "bankName": "Bank", "date": "2025-01-01", "score": 0.75}
    resp = client.post("/api/results", json=payload)
    assert resp.status_code == 200

    resp = client.get(f"/api/results/{user_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 1
    result = data[0]
    assert result["bankName"] == "Bank"
    assert abs(result["score"] - 0.75) < 1e-6
