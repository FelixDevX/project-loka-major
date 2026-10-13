import csv
import io
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from .config import ALLOWED_ORIGINS, FEATURE_ORDER
from .model import load_model, predict, predict_bulk
from .schemas import (
    BulkPredictionResponse,
    BulkPredictionRow,
    HealthResponse,
    PredictionRequest,
    PredictionResponse,
    StatusResponse,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(
    title="Project Loka API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=StatusResponse)
async def root():
    return StatusResponse(status="ok", service="Project Loka API")


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy")


@app.post("/predict", response_model=PredictionResponse)
async def run_prediction(request: PredictionRequest):
    try:
        return predict(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/predict/bulk", response_model=BulkPredictionResponse)
async def run_bulk_prediction(file: UploadFile = File(...)):
    """Accept a CSV file with required feature columns and return batch predictions."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    try:
        content = await file.read()
        text = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))

        # Validate columns
        if reader.fieldnames is None:
            raise HTTPException(status_code=400, detail="CSV file is empty or has no header row.")

        missing = [col for col in FEATURE_ORDER if col not in reader.fieldnames]
        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"CSV is missing required columns: {', '.join(missing)}. "
                       f"Required: {', '.join(FEATURE_ORDER)}",
            )

        # Parse rows
        requests = []
        row_data = []
        for i, row in enumerate(reader, start=1):
            try:
                req = PredictionRequest(
                    **{col: float(row[col]) for col in FEATURE_ORDER}
                )
                requests.append(req)
                row_data.append((i, row))
            except (ValueError, KeyError) as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Row {i}: Invalid data — {str(e)}",
                ) from e

        if not requests:
            raise HTTPException(status_code=400, detail="CSV file contains no data rows.")

        # Run batch prediction
        predictions = predict_bulk(requests)

        # Assemble response
        results = []
        for idx, (req, pred) in enumerate(zip(requests, predictions)):
            results.append(BulkPredictionRow(
                row=idx + 1,
                koi_period=req.koi_period,
                koi_period_err1=req.koi_period_err1,
                koi_duration=req.koi_duration,
                koi_duration_err1=req.koi_duration_err1,
                koi_depth=req.koi_depth,
                koi_depth_err1=req.koi_depth_err1,
                koi_insol=req.koi_insol,
                koi_model_snr=req.koi_model_snr,
                prediction=pred.prediction,
                probability=pred.probability,
            ))

        candidates = sum(1 for r in results if r.prediction == "CANDIDATE")
        return BulkPredictionResponse(
            total=len(results),
            candidates=candidates,
            false_positives=len(results) - candidates,
            results=results,
        )

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
