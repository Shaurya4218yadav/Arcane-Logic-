from pydantic import BaseModel
from typing import Optional, Any, List, Dict


class UserCreate(BaseModel):
    phone: str
    platform: Optional[str] = None
    city: Optional[str] = "Chennai"
    zone: Optional[str] = "Adyar"


class UserOut(BaseModel):
    id: int
    phone: str
    platform: Optional[str]
    trust_score: float
    city: Optional[str]
    zone: Optional[str]

    class Config:
        orm_mode = True


class PolicyCreate(BaseModel):
    premium: float = 50.0
    coverage: float = 1000.0


class PolicyOut(BaseModel):
    id: int
    user_id: int
    premium: float
    coverage: float
    status: str
    premium_reasoning: Optional[str] = ""

    class Config:
        orm_mode = True


class EventCreate(BaseModel):
    lat: float
    lon: float


class EventOut(BaseModel):
    id: int
    user_id: int
    lat: float
    lon: float
    weather: Any
    timestamp: str

    class Config:
        orm_mode = True


class ClaimCreate(BaseModel):
    event_type: Optional[str] = "WEATHER"
    lat: Optional[float] = None
    lon: Optional[float] = None


class ClaimOut(BaseModel):
    id: int
    status: str
    risk_score: float
    payout: float
    audit_reason: Optional[str] = ""

    class Config:
        orm_mode = True


# --- Earnings ---

class EarningsDashboard(BaseModel):
    predicted_earnings: float
    guaranteed_floor: float
    current_earnings: float
    gap_covered: float
    dynamic_premium: float
    premium_reasoning: str
    disruption_active: bool
    disruption_type: str


# --- Trust Engine ---

class TrustSignals(BaseModel):
    motion: float
    behavior: float
    cluster: float
    environment: float
    network: float
    coordinated: float


class TrustResult(BaseModel):
    overall: float
    signals: TrustSignals
    tier: str


# --- Audit ---

class AuditEntry(BaseModel):
    id: int
    claim_id: int
    reason: str
    decision: str
    trust_score: float
    signals_snapshot: Any
    created_at: Optional[str] = None

    class Config:
        orm_mode = True


# --- Simulation (full pipeline) ---

class SimulationRequest(BaseModel):
    scenario: str  # "flood", "heat", "waterlog"
    zone: Optional[str] = "Adyar"
    lat: Optional[float] = 13.0067
    lon: Optional[float] = 80.2206


class PipelineStep(BaseModel):
    step: int
    engine: str
    label: str
    status: str
    data: Optional[Dict[str, Any]] = {}


class SimulationResult(BaseModel):
    steps: List[PipelineStep]
    trust_result: TrustResult
    earnings_before: float
    earnings_after: float
    floor: float
    gap: float
    payout: float
    payout_eligible: bool
    requires_verification: bool
    audit_reason: str
    upi_message: str
