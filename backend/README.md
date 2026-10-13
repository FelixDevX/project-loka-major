# Project Loka — Backend

FastAPI prediction server for Kepler Object of Interest classification.

## Setup

```bash
# Activate your virtual environment first, then:
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

Server starts at `http://localhost:8000`.
API docs at `http://localhost:8000/docs`.

## Endpoints

- `GET /` — Status
- `GET /health` — Health check
- `POST /predict` — Run classification
