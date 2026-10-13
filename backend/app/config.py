from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

MODEL_PATH = str(MODELS_DIR / "kepler_tabnet_model.zip")
YEO_JOHNSON_PATH = str(MODELS_DIR / "yeo_johnson.pkl")
SCALER_PATH = str(MODELS_DIR / "scaler.pkl")

FEATURE_ORDER = [
    "koi_period",
    "koi_period_err1",
    "koi_duration",
    "koi_duration_err1",
    "koi_depth",
    "koi_depth_err1",
    "koi_insol",
    "koi_model_snr",
]

CLASS_LABELS = {0: "FALSE POSITIVE", 1: "CANDIDATE"}

ALLOWED_ORIGINS = ["*"]
