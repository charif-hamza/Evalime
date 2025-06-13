# app/main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .routers import questions, auth
# In a full app, you would import other routers here too
# from .routers import attempts

# In production, use a migration tool like Alembic to manage your database schema.
# For development, you might create tables like this, but it's not recommended for production.
# from . import models, database
# models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(
    title="EvaLime - AI Powered MCQ",
    description="A full-stack application to serve and check MCQ evaluations."
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include API Routers ---
# All routes from questions.py will be prefixed with /api
app.include_router(questions.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

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
    return FileResponse(html_file_path, media_type="text/html")


@app.get("/{full_path:path}", include_in_schema=False)
async def spa_fallback(full_path: str):
    """Serve the React app for any non-API route."""
    # Skip paths meant for the API or static files
    if full_path.startswith("api") or full_path.startswith("static"):
        raise HTTPException(status_code=404, detail="Not Found")

    html_file_path = os.path.join(static_dir, "index.html")
    if not os.path.exists(html_file_path):
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(html_file_path, media_type="text/html")
