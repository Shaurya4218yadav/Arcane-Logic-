"""Simulation API — Full Zero-Touch Claims Pipeline.

Runs the complete 5-engine pipeline:
1. Event Engine → detects disruption
2. Risk Engine → evaluates severity
3. Earnings Engine → calculates gap
4. Trust Engine → validates authenticity
5. Claims Engine → triggers auto adjustment
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
from app.schemas import SimulationRequest
from app.services import event_engine, risk_model, earnings_engine, fraud as fraud_svc
from app import crud

router = APIRouter()

# Chennai zone coordinates
ZONE_COORDS = {
    "Adyar": (13.0067, 80.2206),
    "Velachery": (12.9758, 80.2205),
    "T. Nagar": (13.0418, 80.2341),
    "Anna Nagar": (13.0860, 80.2101),
    "Tambaram": (12.9249, 80.1000),
    "Perungudi": (12.9611, 80.2470),
    "Sholinganallur": (12.9010, 80.2279),
}

SCENARIO_MAP = {
    "flood": "flood",
    "heat": "heat",
    "waterlog": "waterlog",
    "heavy_rain": "heavy_rain",
    "area_shutdown": "area_shutdown",
}


@router.post("/run")
def run_simulation(
    payload: SimulationRequest,
    db: Session = Depends(get_db_dep),
    current_user=Depends(get_current_user),
):
    """Run the full zero-touch claims pipeline simulation.
    
    Returns step-by-step results from all 5 engines.
    """
    zone = payload.zone or current_user.zone or "Adyar"
    coords = ZONE_COORDS.get(zone, ZONE_COORDS["Adyar"])
    lat = payload.lat or coords[0]
    lon = payload.lon or coords[1]
    scenario = SCENARIO_MAP.get(payload.scenario, "flood")

    steps = []

    # ── Step 1: Event Engine ──
    event_result = event_engine.evaluate_event(lat, lon, scenario)
    steps.append({
        "step": 1,
        "engine": "Event Engine",
        "label": "Detecting disruption...",
        "status": "triggered" if event_result["triggered"] else "clear",
        "data": {
            "signals_triggered": event_result["signals_count"],
            "disruption_type": event_result["disruption_type"],
            "environmental": {
                "triggered": event_result["environmental"]["triggered"],
                "rain_mm": event_result["environmental"]["rain_mm"],
                "temp_c": event_result["environmental"]["temp_c"],
                "details": event_result["environmental"]["details"],
            },
            "platform": {
                "triggered": event_result["platform_activity"]["triggered"],
                "drop_pct": event_result["platform_activity"]["drop_percentage"],
            },
            "behavioral": {
                "triggered": event_result["behavioral"]["triggered"],
                "deviation": event_result["behavioral"]["inactivity_deviation"],
            },
        },
    })

    # ── Step 2: Risk Engine ──
    risk_data = risk_model.compute_dynamic_premium(zone)
    steps.append({
        "step": 2,
        "engine": "Risk Engine",
        "label": "Evaluating severity...",
        "status": "assessed",
        "data": {
            "disruption_probability": risk_data["probability"],
            "premium": risk_data["premium"],
            "reasoning": risk_data["reasoning"],
            "risk_factors": risk_data["risk_factors"],
        },
    })

    # ── Step 3: Earnings Engine ──
    earnings_data = earnings_engine.get_earnings_dashboard(zone, scenario)
    steps.append({
        "step": 3,
        "engine": "Earnings Engine",
        "label": "Calculating earnings gap...",
        "status": "gap_detected" if earnings_data["gap_covered"] > 0 else "no_gap",
        "data": {
            "predicted_earnings": earnings_data["predicted_earnings"],
            "guaranteed_floor": earnings_data["guaranteed_floor"],
            "current_earnings": earnings_data["current_earnings"],
            "gap": earnings_data["gap_covered"],
        },
    })

    # ── Step 4: Trust Engine ──
    trust_result = fraud_svc.compute_trust_score(
        db, current_user, "0.0.0.0",
        weather_data=event_result.get("weather_data", {}),
        lat=lat, lon=lon,
    )
    steps.append({
        "step": 4,
        "engine": "Trust Engine",
        "label": "Validating authenticity...",
        "status": trust_result["tier"].lower(),
        "data": {
            "overall_score": trust_result["overall"],
            "tier": trust_result["tier"],
            "signals": trust_result["signals"],
        },
    })

    # ── Verify Policy Lock-In ──
    from datetime import datetime
    policy = crud.get_policy_for_user(db, current_user.id)
    policy_active = False
    audit_reason_extra = ""
    if policy:
        if policy.activation_date and policy.activation_date > datetime.utcnow():
            audit_reason_extra = " (Blocked: 24h Cooling Period)"
        else:
            policy_active = True
    else:
        audit_reason_extra = " (No Active Policy)"

    # ── Step 5: Claims Engine ──
    payout = earnings_data["gap_covered"] if policy_active else 0
    payout_eligible = event_result["triggered"] and payout > 0 and policy_active
    requires_verification = trust_result["tier"] == "MEDIUM"

    if trust_result["tier"] == "LOW":
        payout_eligible = False
        decision = "FLAGGED"
    elif trust_result["tier"] == "MEDIUM":
        decision = "VERIFY"
    else:
        decision = "APPROVED"

    if not event_result["triggered"]:
        decision = "NO_TRIGGER"
        payout_eligible = False
        payout = 0

    # Build audit reason
    audit_parts = []
    env = event_result["environmental"]
    if env["rain_mm"] >= 15:
        audit_parts.append(f"Rain {env['rain_mm']}mm > 15mm threshold")
    elif env["rain_mm"] >= 5:
        audit_parts.append(f"Rain {env['rain_mm']}mm — moderate")
    if env["temp_c"] >= 45:
        audit_parts.append(f"Temp {env['temp_c']}°C > 45°C threshold")
    if event_result["platform_activity"]["triggered"]:
        audit_parts.append(f"{event_result['platform_activity']['drop_percentage']}% platform activity drop")
    if event_result["behavioral"]["triggered"]:
        audit_parts.append(f"inactivity deviation {event_result['behavioral']['inactivity_deviation']}%")
    audit_parts.append(f"trust score {trust_result['overall']}")

    audit_reason = f"Auto Adjustment {decision.lower()}: {' + '.join(audit_parts)}{audit_reason_extra}"

    upi_message = ""
    if payout_eligible and decision == "APPROVED":
        upi_message = f"₹{int(payout)} credited to your account"

    steps.append({
        "step": 5,
        "engine": "Claims Engine",
        "label": "Processing Auto Adjustment...",
        "status": decision.lower(),
        "data": {
            "payout": payout,
            "decision": decision,
            "audit_reason": audit_reason,
        },
    })

    # Save audit log
    try:
        if payout_eligible or decision in ["VERIFY", "FLAGGED"]:
            crud.create_audit_log(
                db,
                claim_id=0,
                user_id=current_user.id,
                reason=audit_reason,
                weather_data=event_result.get("weather_data", {}),
                trust_score=trust_result["overall"],
                signals=trust_result["signals"],
                decision=decision,
            )
    except Exception:
        pass  # Non-critical for demo

    return {
        "steps": steps,
        "trust_result": {
            "overall": trust_result["overall"],
            "signals": trust_result["signals"],
            "tier": trust_result["tier"],
        },
        "earnings_before": earnings_data["predicted_earnings"],
        "earnings_after": earnings_data["current_earnings"],
        "floor": earnings_data["guaranteed_floor"],
        "gap": earnings_data["gap_covered"],
        "payout": payout if payout_eligible else 0,
        "payout_eligible": payout_eligible,
        "requires_verification": requires_verification,
        "audit_reason": audit_reason,
        "upi_message": upi_message,
    }
