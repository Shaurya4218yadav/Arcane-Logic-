from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.ml.fraud_detector import fraud_detector
from app.services.weather_service import weather_service
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ClaimData(BaseModel):
    worker_id: int
    gps_lat: float
    gps_long: float
    claimed_weather: str
    timestamp: int
    claim_amount: float
    route_history: Optional[List[dict]] = None

@router.post("/detect")
async def detect_fraud(data: ClaimData):
    # 1. Weather Validation
    weather_check = weather_service.check_mismatch(
        data.claimed_weather, data.gps_lat, data.gps_long, data.timestamp
    )
    
    # 2. Behavioral/Route Anomaly
    speed_anomaly = False
    if data.route_history and len(data.route_history) > 1:
        # Simple velocity check: if distance between points > possible for bike
        # Mocking for now
        speed_anomaly = False 
    
    # 3. Fraud Score Calculation
    features = [
        data.gps_lat, 
        data.gps_long, 
        1 if data.claimed_weather.lower() == "rain" else 0,
        1 if weather_check['actual'].lower() == "rain" else 0,
        data.claim_amount
    ]
    
    ml_fraud = fraud_detector.predict(features)
    
    score = fraud_detector.calculate_fraud_score(
        {"speed_anomaly": speed_anomaly},
        weather_check,
        {"frequency_high": False}
    )
    
    return {
        "is_fraud": ml_fraud or score > 70,
        "fraud_score": score,
        "details": {
            "weather_mismatch": weather_check['mismatch'],
            "actual_weather": weather_check['actual'],
            "speed_anomaly": speed_anomaly,
            "ml_prediction": "Anomaly" if ml_fraud else "Normal"
        }
    }
