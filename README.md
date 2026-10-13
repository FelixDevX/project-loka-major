# Project Loka 🪐

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-TabNet-EE4C2C?logo=pytorch)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646C99?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

A full-stack machine learning web application that classifies **Kepler Objects of Interest (KOI)** into **Exoplanet Candidates** or **False Positives** using an attentive deep learning model (**TabNet**) trained on NASA Kepler mission photometric data.

---

## 📑 Table of Contents

- [Overview & Key Features](#overview--key-features)
- [Repository Structure](#repository-structure)
- [Quickstart: Replication Guide](#quickstart-replication-guide)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup & Run](#2-backend-setup--run)
  - [3. Frontend Setup & Run](#3-frontend-setup--run)
- [Machine Learning Pipeline](#machine-learning-pipeline)
  - [Input Features](#input-features)
  - [Evaluation Metrics](#evaluation-metrics)
  - [PCA Experiment Note](#pca-experiment-note)
- [API Reference](#api-reference)
  - [`GET /health`](#get-health)
  - [`POST /predict`](#post-predict)
  - [`POST /predict/bulk`](#post-predictbulk)
- [Troubleshooting & Tips](#troubleshooting--tips)

---

## Overview & Key Features

- **Single Observation Prediction**: Input 8 photometric features manually or load pre-configured real Kepler KOI presets to obtain real-time classification with softmax probability confidence.
- **Bulk CSV Batch Prediction**: Upload a CSV file containing multiple observations to run vectorized TabNet inference, inspect interactive tabular results, and export formatted PDF reports with custom naming and timestamping.
- **Production ML Architecture**: Implements a serialized PyTorch-TabNet model with Yeo-Johnson power transformation and standard feature scaling.
- **Modern Responsive UI**: Built with React 19, Tailwind CSS v4, Lucide icons, and interactive visual indicators.

---

## Repository Structure

```
projectLoka/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints, CORS, lifespan handler
│   │   ├── model.py             # Model loading & TabNet inference pipeline
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   └── config.py            # Feature definitions & path configurations
│   ├── models/                  # Serialized ML artifacts
│   │   ├── kepler_tabnet_model.zip
│   │   ├── yeo_johnson.pkl
│   │   └── scaler.pkl
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React UI components (BulkPredict, PredictionForm, etc.)
│   │   ├── services/api.js      # Axios/fetch API client
│   │   ├── App.jsx              # Application root & tab routing
│   │   └── index.css            # Tailwind CSS styles
│   ├── .env.example             # Frontend environment variables template
│   ├── package.json             # Node dependencies and scripts
│   └── vite.config.js           # Vite configuration
│
├── finalTabnet.ipynb            # Model training & evaluation notebook
└── README.md                    # Project documentation
```

---

## Quickstart: Replication Guide

Follow these sequential steps in your terminal to replicate and run the entire application locally.

### 1. Clone Repository

```bash
git clone https://github.com/anmol-janamatti/project-loka-major.git

cd projectLoka
```

---

### 2. Backend Setup & Run

Open a terminal at the project root (`projectLoka`):

#### Create and activate a Python virtual environment:

**On Linux / macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**On Windows (Command Prompt):**
```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
```

#### Install backend dependencies and run the server:

```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

#### Start the FastAPI server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> **Backend Verification:**
> - Server URL: `http://localhost:8000`
> - Interactive Swagger Docs: `http://localhost:8000/docs`
> - Health Check: `http://localhost:8000/health`

---

### 3. Frontend Setup & Run

Open a **separate terminal window** and navigate to the `frontend/` directory:

```bash
cd projectLoka/frontend
```

#### Configure Environment:

Copy the sample environment file to `.env`:

**On Linux / macOS:**
```bash
cp .env.example .env
```

**On Windows (PowerShell / CMD):**
```powershell
copy .env.example .env
```

*(Ensure `.env` contains: `VITE_API_URL=http://localhost:8000`)*

#### Install dependencies and launch the Vite dev server:

```bash
npm install
npm run dev
```

> **Frontend Verification:**
> - Open `http://localhost:5173` in your browser.
> - The web application is now connected to your local FastAPI backend.

---

## Machine Learning Pipeline

- **Architecture:** TabNet (Attentive Tabular Learning)
- **Task:** Binary classification (`CANDIDATE` vs `FALSE POSITIVE`)
- **Preprocessing Pipeline:** Yeo-Johnson Power Transformation $\rightarrow$ StandardScaler
- **Decision Boundary:** Argmax probability over softmax output units

### Input Features

The model expects the following 8 photometric features derived from the Kepler transit analysis pipeline:

| # | Feature Name | Description | Units |
|---|--------------|-------------|-------|
| 1 | `koi_period` | Orbital period between successive transits | Days |
| 2 | `koi_period_err1` | Period measurement upper uncertainty | Days |
| 3 | `koi_duration` | Transit duration from first to fourth contact | Hours |
| 4 | `koi_duration_err1` | Transit duration upper uncertainty | Hours |
| 5 | `koi_depth` | Ratio of flux drop during transit to stellar flux | Parts per million (ppm) |
| 6 | `koi_depth_err1` | Transit depth upper uncertainty | Parts per million (ppm) |
| 7 | `koi_insol` | Stellar flux received relative to Earth | Earth flux ($S_\oplus$) |
| 8 | `koi_model_snr` | Transit model fit signal-to-noise ratio | Dimensionless |

### Evaluation Metrics

Evaluated on the held-out Kepler test dataset:

| Metric | Score |
|--------|-------|
| **Accuracy** | 83.01% |
| **Precision** | 87.59% |
| **Recall** | 76.35% |
| **F1 Score** | 81.59% |
| **ROC-AUC** | 92.07% |

### PCA Experiment Note

Principal Component Analysis (PCA) was evaluated during research: 5 principal components captured ~97% variance. However, TabNet trained on the original feature space achieved higher ROC-AUC (**92.07%** vs **89.42%** with PCA), because TabNet's sequential attention mechanism learns sparse, interpretable masks directly on raw physical features. Consequently, the original 8 features are retained in the production pipeline.

---

## API Reference

### `GET /health`
Returns backend health status.

```bash
curl -X GET http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy"
}
```

---

### `POST /predict`
Performs classification for a single Kepler observation.

**Request:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "koi_period": 9.4880,
    "koi_period_err1": 0.000027,
    "koi_duration": 2.9575,
    "koi_duration_err1": 0.0819,
    "koi_depth": 615.8,
    "koi_depth_err1": 19.5,
    "koi_insol": 93.59,
    "koi_model_snr": 35.8
  }'
```

**Response:**
```json
{
  "prediction": "CANDIDATE",
  "probability": 0.9421
}
```

---

### `POST /predict/bulk`
Accepts a CSV file upload containing rows with all 8 feature columns, returns batched predictions, and summarizes candidates vs false positives.

**Request:**
```bash
curl -X POST http://localhost:8000/predict/bulk \
  -F "file=@observations.csv"
```

**Response:**
```json
{
  "total": 50,
  "candidates": 38,
  "false_positives": 12,
  "results": [
    {
      "row": 1,
      "koi_period": 9.488,
      "koi_period_err1": 0.000027,
      "koi_duration": 2.9575,
      "koi_duration_err1": 0.0819,
      "koi_depth": 615.8,
      "koi_depth_err1": 19.5,
      "koi_insol": 93.59,
      "koi_model_snr": 35.8,
      "prediction": "CANDIDATE",
      "probability": 0.9421
    }
  ]
}
```

---

## Troubleshooting & Tips

- **PowerShell Execution Policy:**
  If script execution is disabled when running `Activate.ps1`, run:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- **Multipart Form Uploads:**
  The bulk prediction route requires `python-multipart` (already specified in `backend/requirements.txt`).
- **Pretrained Artifacts:**
  Ensure `kepler_tabnet_model.zip`, `yeo_johnson.pkl`, and `scaler.pkl` are present in `backend/models/`. The backend loads them into memory upon FastAPI startup via the lifespan handler.
- **Port Conflict:**
  If port `8000` or `5173` is already in use, pass custom ports:
  - Backend: `uvicorn app.main:app --port <port>`
  - Frontend: `npm run dev -- --port <port>` (and update `VITE_API_URL` accordingly).
