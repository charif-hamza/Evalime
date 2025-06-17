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
from . import models, database
models.Base.metadata.create_all(bind=database.engine)


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
# Serve the built front-end from the ``dist`` directory. Vite outputs the
# production assets here.
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "dist")

if os.path.isdir(static_dir):
    # If the build directory exists, mount it as the app's root so requests for
    # ``/`` return ``index.html`` and assets resolve correctly.
    app.mount(
        "/",
        StaticFiles(directory=static_dir, html=True),
        name="static",
    )
else:
    # In development, serve files from the project root so Vite's dev server can
    # handle module loading.
    dev_static = os.path.join(os.path.dirname(__file__), "..", "..")
    app.mount("/", StaticFiles(directory=dev_static, html=True), name="static")
