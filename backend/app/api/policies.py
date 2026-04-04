from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
from app.schemas import PolicyCreate, PolicyOut
from app import crud

router = APIRouter()


@router.post("/", response_model=PolicyOut)
def create_policy(payload: PolicyCreate, db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    p = crud.create_policy(db, current_user.id, payload.premium, payload.coverage)
    return p


@router.get("/me", response_model=PolicyOut)
def my_policy(db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    p = crud.get_policy_for_user(db, current_user.id)
    if not p:
        raise HTTPException(status_code=404, detail="Policy not found")
    return p
