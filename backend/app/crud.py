import uuid
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app import models


def get_user_by_phone(db: Session, phone: str):
    return db.query(models.User).filter(models.User.phone == phone).first()


def get_user_by_api_key(db: Session, api_key: str):
    return db.query(models.User).filter(models.User.api_key == api_key).first()


def create_user(db: Session, phone: str, platform: str = None, city: str = "Chennai", zone: str = "Adyar"):
    api_key = uuid.uuid4().hex
    user = models.User(phone=phone, platform=platform, api_key=api_key, city=city, zone=zone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_policy(db: Session, user_id: int, premium: float, coverage: float, reasoning: str = ""):
    p = models.Policy(user_id=user_id, premium=premium, coverage=coverage, premium_reasoning=reasoning)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def get_policy_for_user(db: Session, user_id: int):
    return db.query(models.Policy).filter(models.Policy.user_id == user_id).first()


def create_event(db: Session, user_id: int, lat: float, lon: float, weather: dict):
    ev = models.Event(user_id=user_id, lat=lat, lon=lon, weather=weather)
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


def create_claim(db: Session, user_id: int, event_type: str, risk_score: float, payout: float, status: str = "PENDING", audit_reason: str = ""):
    c = models.Claim(user_id=user_id, event_type=event_type, risk_score=risk_score, payout=payout, status=status, audit_reason=audit_reason)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def count_recent_claims(db: Session, user_id: int, days: int = 30):
    since = datetime.utcnow() - timedelta(days=days)
    return db.query(models.Claim).filter(models.Claim.user_id == user_id, models.Claim.created_at >= since).count()


def mark_claim_paid(db: Session, claim_id: int):
    c = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not c:
        return None
    c.paid = "YES"
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


# --- Earnings ---

def get_latest_earnings(db: Session, user_id: int):
    return db.query(models.EarningsRecord).filter(
        models.EarningsRecord.user_id == user_id
    ).order_by(models.EarningsRecord.week_start.desc()).first()


def create_earnings_record(db: Session, user_id: int, predicted: float, floor: float, current: float, gap: float, disruption_type: str = ""):
    rec = models.EarningsRecord(
        user_id=user_id,
        predicted_earnings=predicted,
        guaranteed_floor=floor,
        current_earnings=current,
        gap_amount=gap,
        disruption_type=disruption_type,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


# --- Audit ---

def create_audit_log(db: Session, claim_id: int, user_id: int, reason: str, weather_data: dict, trust_score: float, signals: dict, decision: str):
    log = models.AuditLog(
        claim_id=claim_id,
        user_id=user_id,
        reason=reason,
        weather_data=weather_data,
        trust_score=trust_score,
        signals_snapshot=signals,
        decision=decision,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_audit_trail(db: Session, user_id: int, limit: int = 20):
    return db.query(models.AuditLog).filter(
        models.AuditLog.user_id == user_id
    ).order_by(models.AuditLog.created_at.desc()).limit(limit).all()
