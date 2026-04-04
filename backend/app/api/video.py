from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_user
import os
import random

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/verify")
def verify_video(file: UploadFile = File(...), db: Session = Depends(get_db_dep), current_user=Depends(get_current_user)):
    # Save uploaded file (mock verification)
    filename = f"{current_user.id}_{file.filename}"
    outpath = os.path.join(UPLOAD_DIR, filename)
    with open(outpath, "wb") as f:
        f.write(file.file.read())

    # Return a mocked verification score
    score = random.randint(50, 95)
    return {"score": score, "message": "Mock verification complete", "file": filename}
