from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Text, func
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    platform = Column(String, nullable=True)
    trust_score = Column(Float, default=100.0)
    api_key = Column(String, unique=True, index=True, nullable=False)
    city = Column(String, default="Chennai")
    zone = Column(String, default="Adyar")

    policies = relationship("Policy", back_populates="user")
    claims = relationship("Claim", back_populates="user")
    events = relationship("Event", back_populates="user")
    earnings = relationship("EarningsRecord", back_populates="user")


class Policy(Base):
    __tablename__ = "policies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    premium = Column(Float, default=50.0)
    coverage = Column(Float, default=1000.0)
    status = Column(String, default="ACTIVE")
    premium_reasoning = Column(String, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    activation_date = Column(DateTime(timezone=True), nullable=True)
    user = relationship("User", back_populates="policies")


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lat = Column(Float)
    lon = Column(Float)
    weather = Column(JSON)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="events")


class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String)
    status = Column(String, default="PENDING")
    risk_score = Column(Float, default=0.0)
    payout = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    paid = Column(String, default="NO")
    audit_reason = Column(Text, default="")
    user = relationship("User", back_populates="claims")
    audit_logs = relationship("AuditLog", back_populates="claim")


class EarningsRecord(Base):
    __tablename__ = "earnings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    week_start = Column(DateTime(timezone=True), server_default=func.now())
    predicted_earnings = Column(Float, default=4200.0)
    guaranteed_floor = Column(Float, default=3000.0)
    current_earnings = Column(Float, default=4200.0)
    gap_amount = Column(Float, default=0.0)
    disruption_type = Column(String, default="")
    user = relationship("User", back_populates="earnings")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    reason = Column(Text, default="")
    weather_data = Column(JSON, default={})
    trust_score = Column(Float, default=0.0)
    signals_snapshot = Column(JSON, default={})
    decision = Column(String, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    claim = relationship("Claim", back_populates="audit_logs")
