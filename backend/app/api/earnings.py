"""Earnings API — Worker earnings dashboard and simulation endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
from app.services import earnings_engine, risk_model
from typing import Optional

router = APIRouter()


@router.get("/dashboard")
def earnings_dashboard(
    zone: Optional[str] = Query("Adyar"),
    disruption_type: Optional[str] = Query("none"),
    db: Session = Depends(get_db_dep),
    current_user=Depends(get_current_user),
):
    """Get the earnings dashboard data for the logged-in worker.
    
    Shows: predicted earnings, guaranteed floor, current earnings, gap covered,
    dynamic premium, and premium reasoning.
    """
    user_zone = zone or current_user.zone or "Adyar"

    # Get earnings data
    earnings = earnings_engine.get_earnings_dashboard(user_zone, disruption_type)

    # Get dynamic premium
    premium_data = risk_model.compute_dynamic_premium(user_zone)

    return {
        "predicted_earnings": earnings["predicted_earnings"],
        "guaranteed_floor": earnings["guaranteed_floor"],
        "current_earnings": earnings["current_earnings"],
        "gap_covered": earnings["gap_covered"],
        "disruption_active": earnings["disruption_active"],
        "disruption_type": earnings["disruption_type"],
        "dynamic_premium": premium_data["premium"],
        "premium_reasoning": premium_data["reasoning"],
    }
