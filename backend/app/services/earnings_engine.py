"""Earnings Engine — Predicted earnings, guaranteed floor, and gap calculation.

Core of the Dynamic Earnings Floor differentiator:
  Predicted Earnings → Disruption Detected → Earnings Drop → Floor Breach → Gap Calculation → Auto Payout
"""

import random

# Default earnings profiles for demo (simulating historical data)
DEFAULT_PROFILES = {
    "Adyar": {"predicted": 4200, "floor": 3000},
    "Velachery": {"predicted": 3800, "floor": 2800},
    "T. Nagar": {"predicted": 4500, "floor": 3200},
    "Anna Nagar": {"predicted": 4100, "floor": 3000},
    "Tambaram": {"predicted": 3600, "floor": 2600},
    "Perungudi": {"predicted": 4000, "floor": 2900},
    "Sholinganallur": {"predicted": 3900, "floor": 2800},
}

# Disruption impact on earnings (percentage of predicted earnings retained)
DISRUPTION_IMPACT = {
    "flood": 0.45,        # Severe — worker retains only 45% of predicted
    "heavy_rain": 0.55,   # Moderate-severe
    "heat": 0.65,         # Moderate — some deliveries still possible
    "waterlog": 0.50,     # Severe in affected pockets
    "area_shutdown": 0.30, # Very severe
    "none": 1.0,          # No disruption
}


def predict_weekly_earnings(zone: str = "Adyar") -> float:
    """Predict expected weekly earnings based on zone and historical patterns."""
    profile = DEFAULT_PROFILES.get(zone, DEFAULT_PROFILES["Adyar"])
    # Add small variance to simulate model prediction
    variance = random.uniform(-150, 150)
    return round(profile["predicted"] + variance, 0)


def get_guaranteed_floor(zone: str = "Adyar") -> float:
    """Get the guaranteed minimum income floor for a worker in a zone."""
    profile = DEFAULT_PROFILES.get(zone, DEFAULT_PROFILES["Adyar"])
    return profile["floor"]


def calculate_disrupted_earnings(predicted: float, disruption_type: str) -> float:
    """Calculate actual earnings during a disruption event."""
    retention = DISRUPTION_IMPACT.get(disruption_type, DISRUPTION_IMPACT["none"])
    # Add some noise
    noise = random.uniform(-100, 100)
    return round(max(predicted * retention + noise, 0), 0)


def calculate_gap(current_earnings: float, floor: float) -> float:
    """Calculate the income gap that needs to be covered.
    
    Gap = max(0, floor - current_earnings)
    Only triggers if current earnings are below the guaranteed floor.
    """
    gap = max(0, floor - current_earnings)
    return round(gap, 0)


def should_trigger_payout(current_earnings: float, floor: float) -> bool:
    """Determine if an auto-adjustment payout should be triggered."""
    return current_earnings < floor


def cap_payout(gap: float, predicted: float, cap_percent: float = 0.30) -> float:
    """Cap payout at 30% of verified historical earnings (risk control)."""
    max_payout = predicted * cap_percent
    return round(min(gap, max_payout), 0)


def get_earnings_dashboard(zone: str = "Adyar", disruption_type: str = "none") -> dict:
    """Build the full earnings dashboard data for the frontend."""
    predicted = predict_weekly_earnings(zone)
    floor = get_guaranteed_floor(zone)

    if disruption_type and disruption_type != "none":
        current = calculate_disrupted_earnings(predicted, disruption_type)
    else:
        current = predicted

    gap = calculate_gap(current, floor)
    payout = cap_payout(gap, predicted) if gap > 0 else 0
    trigger = should_trigger_payout(current, floor)

    return {
        "predicted_earnings": predicted,
        "guaranteed_floor": floor,
        "current_earnings": current,
        "gap_covered": payout,
        "disruption_active": disruption_type != "none" and trigger,
        "disruption_type": disruption_type,
        "raw_gap": gap,
        "payout_capped": payout < gap if gap > 0 else False,
    }
