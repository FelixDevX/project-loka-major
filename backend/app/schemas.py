from pydantic import BaseModel


class PredictionRequest(BaseModel):
    koi_period: float
    koi_period_err1: float
    koi_duration: float
    koi_duration_err1: float
    koi_depth: float
    koi_depth_err1: float
    koi_insol: float
    koi_model_snr: float


class PredictionResponse(BaseModel):
    prediction: str
    probability: float


class BulkPredictionRow(BaseModel):
    row: int
    koi_period: float
    koi_period_err1: float
    koi_duration: float
    koi_duration_err1: float
    koi_depth: float
    koi_depth_err1: float
    koi_insol: float
    koi_model_snr: float
    prediction: str
    probability: float


class BulkPredictionResponse(BaseModel):
    total: int
    candidates: int
    false_positives: int
    results: list[BulkPredictionRow]


class StatusResponse(BaseModel):
    status: str
    service: str


class HealthResponse(BaseModel):
    status: str
