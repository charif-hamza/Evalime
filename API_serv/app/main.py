# app/main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .routers import questions, auth, stats, answers, results
# In a full app, you would import other routers here too
# from .routers import attempts

# In production, use a migration tool like Alembic to manage your database schema.
# For development, you might create tables like this, but it's not recommended for production.
from . import models, database
models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(
    title="EvaLime - AI Powered MCQ",
    description="A full-stack application to serve and check MCQ evaluations."
)

# --- CORS Middleware ---
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = (
    [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
    if allowed_origins_env else ["*"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
# This assumes your index.html is in the root directory alongside the `app` folder.
# If your static files are elsewhere, adjust the path.
static_dir = os.path.join(os.path.dirname(__file__), "..", "..") # Goes up to API_serv/
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", include_in_schema=False)
async def read_index():
    """Serves the main index.html file."""
    html_file_path = os.path.join(static_dir, "index.html")
    if not os.path.exists(html_file_path):
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(html_file_path)