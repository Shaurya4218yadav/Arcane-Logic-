from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import UserCreate
from app.api.deps import get_db_dep
from app import crud

router = APIRouter()


@router.post("/register")
def register(payload: UserCreate, db: Session = Depends(get_db_dep)):
    existing = crud.get_user_by_phone(db, payload.phone)
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")
    user = crud.create_user(db, payload.phone, payload.platform)
    return {"api_key": user.api_key, "user": {"id": user.id, "phone": user.phone, "platform": user.platform, "trust_score": user.trust_score}}


@router.get("/me")
def me():
    raise HTTPException(status_code=501, detail="Use protected endpoints with X-API-Key header")
