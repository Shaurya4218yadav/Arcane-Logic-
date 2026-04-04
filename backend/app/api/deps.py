from fastapi import Header, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app import crud


def get_db_dep():
    yield from get_db()


def get_current_user(x_api_key: Optional[str] = Header(None), authorization: Optional[str] = Header(None), db: Session = Depends(get_db_dep)):
    token = x_api_key
    if not token and authorization:
        if authorization.lower().startswith("bearer "):
            token = authorization.split(" ", 1)[1]
            
    # For demo purposes, if no token or token is invalid, auto-register a demo user
    user = None
    if token:
        user = crud.get_user_by_api_key(db, token)
        
    if not user:
        # Check if demo user exists by phone
        demo_phone = "+919999999999"
        user = crud.get_user_by_phone(db, demo_phone)
        if not user:
            # Create the demo user
            user = crud.create_user(db, phone=demo_phone, platform="demo_platform", city="Chennai", zone="Adyar")
            
    return user
