# app/main.py
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# In production, use a migration tool like Alembic to manage your database schema.
# For development, you might create tables like this, but it's not recommended for production.
from . import database, models
from .routers import answers, auth, questions, results, stats

# In a full app, you would import other routers here too
# from .routers import attempts


models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(
    title="EvaLime - AI Powered MCQ",
    description="A full-stack application to serve and check MCQ evaluations.",
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include API Routers ---
# All routes from questions.py will be prefixed with /api
app.include_router(questions.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(answers.router, prefix="/api")
app.include_router(results.router, prefix="/api")

# --- Static File Serving ---
# Static files live in the repo's public/ directory
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "public")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/", include_in_schema=False)
async def read_index():
    """Serves the main index.html file."""
    html_file_path = os.path.join(static_dir, "index.html")
    if not os.path.exists(html_file_path):
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(html_file_path)
