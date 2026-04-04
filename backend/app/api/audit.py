"""Audit API — Compliance and audit trail endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
from app import crud
from typing import Optional

router = APIRouter()


@router.get("/trail")
def audit_trail(
    limit: Optional[int] = Query(20),
    db: Session = Depends(get_db_dep),
    current_user=Depends(get_current_user),
):
    """Get audit trail for the current user's claims.
    
    Shows: why each payout was triggered, signal snapshots, and decisions.
    """
    logs = crud.get_audit_trail(db, current_user.id, limit=limit)
    return [
        {
            "id": log.id,
            "claim_id": log.claim_id,
            "reason": log.reason,
            "decision": log.decision,
            "trust_score": log.trust_score,
            "signals_snapshot": log.signals_snapshot,
            "created_at": str(log.created_at) if log.created_at else None,
        }
        for log in logs
    ]
