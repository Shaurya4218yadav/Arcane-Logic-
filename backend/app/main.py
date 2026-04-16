import logging, sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import CORS_ORIGINS, DATABASE_URL
from app.db.session import engine, Base

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logger = logging.getLogger("vayuguard")

# import routers
from app.api import auth, policies, events, claims, video, earnings, audit, simulation, fraud, payouts, admin

# Log DB URL (mask password)
_safe_url = DATABASE_URL
if "@" in _safe_url:
    _safe_url = _safe_url.split("@")[0][:20] + "***@" + _safe_url.split("@")[-1]
logger.info(f"DATABASE_URL = {_safe_url}")

try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created successfully")
except Exception as e:
    logger.error(f"❌ Database connection failed: {e}")

app = FastAPI(title="VayuGuard Backend", description="AI-Powered Income Stabilization Engine for Gig Workers")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(policies.router, prefix="/policies", tags=["policies"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(claims.router, prefix="/claims", tags=["claims"])
app.include_router(video.router, prefix="/video", tags=["video"])
app.include_router(earnings.router, prefix="/earnings", tags=["earnings"])
app.include_router(audit.router, prefix="/audit", tags=["audit"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(simulation.router, prefix="/simulation", tags=["simulation"])
app.include_router(fraud.router, prefix="/fraud", tags=["fraud"])
app.include_router(payouts.router, prefix="/payouts", tags=["payouts"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "VayuGuard Backend"}
