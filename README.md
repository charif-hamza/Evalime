# EvaLime – AI-powered MCQ Practice Platform

> *"Learn smarter, score higher."*  
> EvaLime transforms static multiple-choice questionnaires into a personalised, data-driven learning experience powered by modern web technologies and generative AI.

---

## Table of Contents
1. [Project Vision](#project-vision)
2. [Live Demo](#live-demo)
3. [Key Features](#key-features)
4. [Technical Stack](#technical-stack)
5. [Architecture Overview](#architecture-overview)
6. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Variables](#environment-variables)
   - [Backend (API)](#backend-api)
   - [Frontend (Web Client)](#frontend-web-client)
7. [Project Structure](#project-structure)
8. [Important Scripts](#important-scripts)
9. [API Reference](#api-reference)
10. [Testing](#testing)
11. [Roadmap & Future Improvements](#roadmap--future-improvements)
12. [Contributing](#contributing)
13. [License](#license)

---

## Project Vision
EvaLime helps students master large banks of MCQs by blending:
* **Adaptive practice** – Questions can be filtered by topic and difficulty (planned).
* **AI explanations** – Every answer can be explained on-demand by Google Gemini.
* **Actionable analytics** – Dashboards highlight strengths and blind-spots before exam day.

While the project started as a proof-of-concept, its modular architecture allows it to evolve into a full-scale learning platform.

## Live Demo
*(Coming soon – deploy to Fly.io / Render / Vercel)*

---

## Key Features
* 🔐 **Auth & JWT** – Register / login backed by FastAPI & PostgreSQL.
* 📚 **Evaluation library** – Browse available MCQ sets with rich metadata.
* 📝 **Interactive player** – Mobile-friendly UI with keyboard shortcuts.
* 🤖 **LLM integration** – Calls Gemini 1.5-Pro via `generateContent` to produce step-by-step explanations.
* 📊 **Real-time dashboard** – Aggregates per-question performance into intuitive topic insights (accuracy, strengths, blind-spots).
* 🎨 **Cinematic landing page** – Anime.js, Tailwind CSS & DaisyUI for delightful micro-interactions.
* 🧪 **Component tests** – Vitest + React Testing Library for UI confidence.

---

## Technical Stack
| Layer | Technology |
|-------|------------|
|Frontend|React 19 • Vite 6 • Tailwind 4 • DaisyUI 5 • Anime.js • React Router 7|
|Backend|FastAPI > 0.100 • SQLAlchemy 2 • PostgreSQL • Pydantic 2|
|Auth|JSON Web Tokens (jose) • passlib (bcrypt)|
|AI Service|Google Gemini 1.5 via REST βeta API|
|Tooling|ESLint 9 • Vitest 1 • JSDOM • pre-commit (suggested)|

---

## Architecture Overview
```
┌───────────────────────────┐        HTTP/JSON        ┌─────────────────────────┐
│        React Client       │  <────────────────────► │      FastAPI Backend     │
│  • Vite dev server (5173) │                        │  • uvicorn (8000)        │
│  • Tailwind / DaisyUI     │                        │  • CORS, JWT Auth        │
│  • React Router           │                        │  • SQLAlchemy ORM        │
└─────────────┬─────────────┘                        │  • Gemini proxy service  │
              │  Proxy /api/*                       │  • Static React build    │
              ▼                                      └─────────────┬───────────┘
        Reverse Proxy                                         PostgreSQL
              ▼                                                    ▲
        Localhost:8000  ◄──────────── SQLAlchemy 2  ───────────────┘
```
*During development Vite proxies `/api/**` to `localhost:8000`.  
In production FastAPI serves the bundled React app from `dist/`.*

---

## Getting Started
### Prerequisites
* **Node >= 20** (front-end tooling)
* **Python >= 3.11** (backend)
* **PostgreSQL** database instance
* (Optional) **Poetry / virtualenv** for python isolation

### Environment Variables
Create an `.env` file at `API_serv/` (copied to the container in CI):
```
# Database
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/evalime

# JWT secret for access tokens
JWT_SECRET=change_me_in_production

# Google AI Studio
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE
# Optionally override model (default: gemini-1.5-pro)
VITE_GEMINI_MODEL=gemini-1.5-flash
```
> **Note** : Front-end reads the last two keys at *build-time*, therefore they must be prefixed with `VITE_`.

---

### Backend (API)
```bash
# 1. Create & activate virtual environment
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r API_serv/requirements.txt

# 3. Run database migrations (Alembic placeholder)
alembic upgrade head   # or python API_serv/app/models.py to auto-create during dev

# 4. Start dev server
uvicorn API_serv.app.main:app --reload --port 8000
```
The API is now available at `http://localhost:8000`.  Docs live at `/docs` (Swagger) and `/redoc`.

### Frontend (Web Client)
```bash
# 1. Install JS deps
cd Evalime
npm install

# 2. Launch Vite dev server (auto-proxy to 8000)
npm run dev
```
Navigate to `http://localhost:5173` – hot-reload should be active.

---

## Project Structure
```
Evalime/
├── API_serv/           ← FastAPI source & requirements
│   └── app/
│       ├── routers/    ← auth, questions, dashboard endpoints
│       ├── models.py   ← SQLAlchemy ORM
│       ├── schemas.py  ← Pydantic models
│       └── main.py     ← FastAPI app entry-point
├── src/                ← React codebase
│   ├── pages/          ← Route-level screens (Landing, MCQ, Dashboard…)
│   ├── components/     ← Reusable UI components (Question, Button…)
│   ├── services/       ← API & Gemini helpers
│   ├── hooks/          ← Custom React hooks
│   └── assets/
├── public/             ← Static files (favicon, images)
├── tailwind.config.js  ← Styling theme + DaisyUI colours
├── vite.config.js      ← Build & proxy configuration
└── README.md           ← **(you are here)**
```

---

## Important Scripts
| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | root | Run Vite dev server (5173) |
| `npm run build` | root | Production bundle to `dist/` |
| `npm run preview` | root | Preview built site |
| `npm test` | root | Execute Vitest unit tests |
| `uvicorn API_serv.app.main:app --reload` | backend | Hot-reload FastAPI |
| `alembic revision --autogenerate -m "…"` | backend | DB migrations |

---

## API Reference
Swagger docs are generated automatically and served at runtime.  Below is a condensed overview:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/evaluations/<id>/questions` | Retrieve all questions (with choices) for an evaluation |
| `GET` | `/api/evaluations/list` | List evaluations for dashboard cards |
| `POST` | `/api/auth/register` | Create new user & return JWT |
| `POST` | `/api/auth/login` | Login existing user & return JWT |
| `POST` | `/api/dashboard/insights` | Compute per-topic performance statistics |

> See `app/routers/*.py` for implementation details.

---

## Testing
* **Frontend** – `vitest` + `@testing-library/react` (`npm test`)
* **Backend** – *(not yet implemented)* ‑ suggested: `pytest`, `pytest-asyncio`, `httpx` test client.

---

## Roadmap & Future Improvements
1. 🗃️ **Question import pipeline** – CLI to bulk-load EvaExam PDFs via OCR.
2. 📈 **Adaptive algorithm** – Dynamic difficulty & spaced repetition scheduling.
3. 🌐 **Multilingual UI** – i18n via `react-i18next`.
4. 🚀 **CI/CD** – GitHub Actions to run tests & deploy container images.
5. 🔒 **Role-based Access** – Teacher dashboards, group analytics.
6. 💬 **Collaborative explanations** – Allow users to upvote / propose alternative explanations.
7. 📱 **PWA** – Offline support & installable experience.

---

## Contributing
Pull requests are welcome! Please file an issue first if you plan major changes.  
Make sure your code passes `npm run lint` and `pytest` (once added).

1. Fork the repo & create your branch: `git checkout -b feature/awesome`  
2. Commit your changes with clear messages.  
3. Push to the branch & open a PR.

---

## License
This project is licensed under the **MIT License** – see `LICENSE` for details.

---

### Acknowledgements
* [FastAPI](https://fastapi.tiangolo.com/) – delightful async Python web framework.
* [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/) for rapid UI styling.
* [Anime.js](https://animejs.com/) for immersive micro-interactions.
* Google AI Studio for powering the explanation engine.

---

*Happy learning!* 