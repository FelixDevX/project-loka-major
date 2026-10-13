import warnings

import joblib
import numpy as np
from pytorch_tabnet.tab_model import TabNetClassifier

from .config import CLASS_LABELS, FEATURE_ORDER, MODEL_PATH, SCALER_PATH, YEO_JOHNSON_PATH
from .schemas import PredictionRequest, PredictionResponse

warnings.filterwarnings("ignore")

_power_transformer = None
_scaler = None
_tabnet = None


def load_model():
    global _power_transformer, _scaler, _tabnet

    _power_transformer = joblib.load(YEO_JOHNSON_PATH)
    _scaler = joblib.load(SCALER_PATH)

    _tabnet = TabNetClassifier()
    _tabnet.load_model(MODEL_PATH)


def predict(request: PredictionRequest) -> PredictionResponse:
    features = np.array(
        [[getattr(request, name) for name in FEATURE_ORDER]],
        dtype=np.float64,
    )

    features = _power_transformer.transform(features)
    features = _scaler.transform(features)

    pred_class = _tabnet.predict(features)[0]
    pred_proba = _tabnet.predict_proba(features)[0]

    label = CLASS_LABELS[int(pred_class)]
    probability = float(pred_proba[int(pred_class)])

    return PredictionResponse(
        prediction=label,
        probability=round(probability, 4),
    )


def predict_bulk(requests: list[PredictionRequest]) -> list[PredictionResponse]:
    """Run batch predictions on multiple rows at once for efficiency."""
    features = np.array(
        [[getattr(req, name) for name in FEATURE_ORDER] for req in requests],
        dtype=np.float64,
    )

    features = _power_transformer.transform(features)
    features = _scaler.transform(features)

    pred_classes = _tabnet.predict(features)
    pred_probas = _tabnet.predict_proba(features)

    results = []
    for i, cls in enumerate(pred_classes):
        label = CLASS_LABELS[int(cls)]
        probability = float(pred_probas[i][int(cls)])
        results.append(PredictionResponse(
            prediction=label,
            probability=round(probability, 4),
        ))

    return results
