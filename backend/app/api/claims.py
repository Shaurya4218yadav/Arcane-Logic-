from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
from app.schemas import ClaimCreate, ClaimOut
from app import crud, models
from app.services import event_engine, fraud as fraud_svc, payments

router = APIRouter()


@router.post("/", response_model=ClaimOut)
def create_claim(payload: ClaimCreate, db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    # Check event trigger
    lat = payload.lat
    lon = payload.lon
    if lat is None or lon is None:
        raise HTTPException(status_code=400, detail="Provide lat and lon for claim")

    ev = event_engine.check_event_trigger(db, current_user.id, lat, lon)
    # compute fraud score (simple)
    ip = "0.0.0.0"
    gps_mismatch = False
    risk = fraud_svc.compute_fraud_score(db, current_user, ip, gps_mismatch, lat=lat, lon=lon)

    policy = crud.get_policy_for_user(db, current_user.id)
    payout = 0.0
    status = "PENDING"

    if risk < 30:
        status = "APPROVED"
        if policy:
            payout = policy.coverage * 0.5
        else:
            payout = 150.0
    elif risk < 60:
        status = "VERIFY"
        payout = 0.0
    else:
        status = "REJECT"
        payout = 0.0

    claim = crud.create_claim(db, current_user.id, payload.event_type or "WEATHER", risk, payout, status)

    if status == "APPROVED":
        payments.process_payout(db, claim.id, payout)

    return claim


@router.get("/me")
def my_claims(db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    cs = db.query(models.Claim).filter_by(user_id=current_user.id).all()
    return [{"id": c.id, "status": c.status, "risk_score": c.risk_score, "payout": c.payout} for c in cs]
