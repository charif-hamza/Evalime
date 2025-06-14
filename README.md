# EvaLime - MCQ Practice Platform

EvaLime is a full-stack application for browsing and answering multiple choice questions (MCQs). The front‑end is built with **React** and **Vite**, while the back‑end uses **FastAPI** with SQLAlchemy.

## Features

- User registration and login
- Light and dark themes
- Searchable dashboard of available evaluations
- Interactive MCQ page with instant correction
- REST API served by FastAPI

## Project Structure

```
root
├─ API_serv/               # FastAPI backend
│  ├─ app/
│  └─ requirements.txt
├─ public/                 # Static assets
├─ src/                    # React front-end source
│  ├─ components/
│  ├─ pages/
│  └─ services/
└─ vite.config.js          # Vite configuration
```

## Prerequisites

- Node.js and npm
- Python 3.10+
- A PostgreSQL database (connection string provided via `DATABASE_URL`)

## Setup

### 1. Install Front‑end Dependencies

```bash
npm install
```

### 2. Install Back‑end Dependencies

```bash
cd API_serv
pip install -r requirements.txt
```

Create a `.env` file in `API_serv` with at least the following variable:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### 3. Run the Development Servers

In separate terminals, start the FastAPI server and the Vite dev server:

```bash
# FastAPI
cd API_serv
uvicorn app.main:app --reload

# Front-end
npm run dev
```

The Vite dev server proxies API calls to the FastAPI server as configured in `vite.config.js`.

## Building for Production

Run `npm run build` to generate optimized static files in the `dist` directory. You can serve these files with any static server and run the FastAPI app separately.

## Linting

Use `npm run lint` to check the front‑end code with ESLint.

---

EvaLime aims to simplify practicing MCQs with a clean interface and a simple API.
