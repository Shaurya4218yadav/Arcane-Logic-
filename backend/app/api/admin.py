from fastapi import APIRouter, Depends
from app.ml.earnings_predictor import predictor
from app.api import deps
import pandas as pd
import random

router = APIRouter()

@router.get("/metrics")
async def get_admin_metrics():
    # Mock some historical data for prediction
    # In reality, this would query the DB
    history = pd.DataFrame({
        'day_of_week': [0, 1, 2, 3, 4, 5, 6],
        'rain_prob': [0.1, 0.2, 0.8, 0.9, 0.1, 0.0, 0.0],
        'active_hours': [8, 9, 4, 3, 10, 11, 10],
        'earnings': [1200, 1300, 500, 400, 1500, 1700, 1600]
    })
    
    if not predictor.is_trained:
        predictor.train(history)
    
    # Predict for next week (average)
    prediction = predictor.predict_next_week([0, 0.3, 8]) # Monday, 30% rain, 8 hours
    
    return {
        "total_claims_paid": 452000,
        "total_premiums_collected": 680000,
        "loss_ratio": 0.66,
        "fraud_rate": 0.045,
        "weekly_prediction": round(prediction, 2),
        "recent_anomalies": random.randint(2, 8),
        "portfolio_health": "STABLE" if prediction > 4000 else "AT_RISK"
    }
