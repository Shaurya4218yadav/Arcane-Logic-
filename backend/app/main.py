from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import CORS_ORIGINS
from app.db.session import engine, Base

# import routers
from app.api import auth, policies, events, claims, video, earnings, audit, simulation

Base.metadata.create_all(bind=engine)

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
app.include_router(simulation.router, prefix="/simulation", tags=["simulation"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "VayuGuard Backend"}
