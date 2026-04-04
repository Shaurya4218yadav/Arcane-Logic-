from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
from app.schemas import EventCreate, EventOut
from app import crud
from app.services import weather as weather_svc
from typing import Optional

router = APIRouter()


@router.post("/report", response_model=EventOut)
def report_event(payload: EventCreate, db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    weather = weather_svc.get_weather(payload.lat, payload.lon)
    ev = crud.create_event(db, current_user.id, payload.lat, payload.lon, weather)
    return ev


@router.get("/check")
def check_event(lat: Optional[float] = Query(None), lon: Optional[float] = Query(None), db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    if lat is None or lon is None:
        raise HTTPException(status_code=400, detail="Provide lat and lon")
    weather = weather_svc.get_weather(lat, lon)
    # simple threshold logic
    rain_mm = 0
    if isinstance(weather, dict):
        if "rain" in weather:
            # openweather uses e.g. {'1h': 3}
            r = weather.get("rain")
            if isinstance(r, dict):
                rain_mm = r.get("1h", 0) or r.get("3h", 0)
        if not rain_mm and "weather" in weather:
            # fallback: look for "Rain" in weather main
            for w in weather.get("weather", []):
                if w.get("main", "").lower() == "rain":
                    rain_mm = 1

    threshold = 3.0
    triggered = rain_mm >= threshold
    return {"triggered": triggered, "rain_mm": rain_mm, "threshold": threshold, "weather": weather}
