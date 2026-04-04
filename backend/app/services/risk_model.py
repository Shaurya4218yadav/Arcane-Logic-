"""Risk Model Service — AI-driven risk scoring for dynamic premium calculation.

Inputs: location (Chennai zones), historical disruption patterns, time-of-day
Output: disruption probability (0.0-1.0) and premium in ₹40-₹65 range
"""

import random
from datetime import datetime

# Chennai zone risk profiles (simulated XGBoost output)
ZONE_RISK = {
    "Adyar": {"base_risk": 0.35, "flood_prone": True, "heat_prone": False, "waterlog_prone": True},
    "Velachery": {"base_risk": 0.45, "flood_prone": True, "heat_prone": False, "waterlog_prone": True},
    "T. Nagar": {"base_risk": 0.20, "flood_prone": False, "heat_prone": False, "waterlog_prone": True},
    "Anna Nagar": {"base_risk": 0.25, "flood_prone": True, "heat_prone": False, "waterlog_prone": False},
    "Tambaram": {"base_risk": 0.30, "flood_prone": False, "heat_prone": True, "waterlog_prone": False},
    "Perungudi": {"base_risk": 0.40, "flood_prone": True, "heat_prone": False, "waterlog_prone": True},
    "Sholinganallur": {"base_risk": 0.38, "flood_prone": True, "heat_prone": False, "waterlog_prone": True},
}

# Seasonal risk multipliers (Chennai monsoon: Oct-Dec)
MONTH_MULTIPLIER = {
    1: 0.8, 2: 0.7, 3: 0.9, 4: 1.1, 5: 1.2, 6: 0.9,
    7: 0.85, 8: 0.9, 9: 1.0, 10: 1.4, 11: 1.5, 12: 1.3,
}


def get_zone_risk(zone: str) -> dict:
    """Get risk profile for a Chennai zone."""
    return ZONE_RISK.get(zone, ZONE_RISK["Adyar"])


def compute_disruption_probability(zone: str, hour: int = None) -> float:
    """Compute weekly disruption probability for a zone.
    
    Simulates an XGBoost model output using zone data + seasonal + time factors.
    """
    profile = get_zone_risk(zone)
    base = profile["base_risk"]

    # Seasonal adjustment
    month = datetime.now().month
    seasonal = MONTH_MULTIPLIER.get(month, 1.0)

    # Time-of-day adjustment (peak hours = higher risk impact)
    if hour is None:
        hour = datetime.now().hour
    if 7 <= hour <= 10 or 17 <= hour <= 20:
        time_factor = 1.15  # peak delivery hours
    elif 22 <= hour or hour <= 5:
        time_factor = 0.7   # low activity
    else:
        time_factor = 1.0

    # Small random noise to simulate model variance
    noise = random.uniform(-0.03, 0.03)

    probability = min(max(base * seasonal * time_factor + noise, 0.05), 0.95)
    return round(probability, 3)


def compute_dynamic_premium(zone: str, hour: int = None) -> dict:
    """Calculate dynamic premium in ₹40-₹65 range based on risk score.

    Returns premium amount and human-readable reasoning.
    """
    probability = compute_disruption_probability(zone, hour)
    profile = get_zone_risk(zone)

    # Premium = 40 + (probability * 25), clamped to [40, 65]
    premium = round(40 + (probability * 25), 0)
    premium = max(40, min(65, premium))

    # Build reasoning
    reasons = []
    if profile["flood_prone"]:
        reasons.append("flood-prone zone")
    if profile["heat_prone"]:
        reasons.append("heat-risk zone")
    if profile["waterlog_prone"]:
        reasons.append("waterlogging area")

    month = datetime.now().month
    if month in [10, 11, 12]:
        reasons.append("monsoon season active")

    zone_label = zone if zone in ZONE_RISK else "Adyar"
    risk_pct = round(probability * 100)
    reasoning = f"{zone_label}: {', '.join(reasons) if reasons else 'moderate risk'} — {risk_pct}% disruption probability → ₹{int(premium)}/week"

    return {
        "premium": premium,
        "probability": probability,
        "reasoning": reasoning,
        "zone": zone_label,
        "risk_factors": reasons,
    }
