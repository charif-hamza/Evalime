import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

from API_serv.app import crud, models
from API_serv.app.database import Base


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


def test_question_tag_crud(db_session):
    tag = crud.create_question_tag(db_session, "math")
    assert tag.id is not None

    fetched = crud.get_question_tag(db_session, tag.id)
    assert fetched.name == "math"

    updated = crud.update_question_tag(db_session, tag.id, name="science")
    assert updated.name == "science"

    crud.delete_question_tag(db_session, tag.id)
    assert crud.get_question_tag(db_session, tag.id) is None


def test_alembic_upgrade_runs(tmp_path):
    from alembic.config import Config
    from alembic import command

    db_file = tmp_path / "test.db"
    url = f"sqlite:///{db_file}"

    cfg = Config("API_serv/alembic.ini")
    cfg.set_main_option("sqlalchemy.url", url)
    command.upgrade(cfg, "head")

    engine = create_engine(url)
    inspector = inspect(engine)
    assert "question_tags" in inspector.get_table_names()


