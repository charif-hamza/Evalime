# app/database.py
import os
from pydantic_settings import BaseSettings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

class Settings(BaseSettings):
    """Loads environment variables from .env file or uses a sensible default."""
    database_url: str = "sqlite:///./app.db"

    class Config:
        env_file = ".env"

settings = Settings()

# Create the SQLAlchemy engine
# The 'pool_pre_ping' argument checks for stale connections in the pool
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True
)

# Each instance of SessionLocal will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our ORM models to inherit from.
Base = declarative_base()

# Dependency to get a DB session for each request.
# It ensures the database session is always closed after the request.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()