"""Multi-Layer Trust Engine — 6-signal fraud detection system.

Signals:
1. Motion validation (accelerometer/gyroscope patterns)
2. Behavioral patterns (earnings consistency, pre-disruption activity)
3. Hyperlocal cluster validation (500m peer consensus)
4. Environmental validation (weather cross-check)
5. Network validation (VPN/proxy detection)
6. Coordinated fraud detection (multi-user anomaly clustering)

Trust Score tiers:
  85+ → Instant payout (zero-touch)
  50-84 → Partial payout + video verification
  <50 → Flagged for review
"""

import random
from app import crud
from app.services import ip_check


# Signal weights (must sum to 1.0)
WEIGHTS = {
    "motion": 0.15,
    "behavior": 0.25,
    "cluster": 0.15,
    "environment": 0.15,
    "network": 0.15,
    "coordinated": 0.15,
}


def score_motion(user) -> float:
    """Layer 1: Physical Validation — motion pattern analysis.
    
    In production: analyze accelerometer/gyroscope data for delivery movement patterns.
    Demo: simulate based on user trust history.
    """
    base = user.trust_score if user.trust_score else 80
    noise = random.uniform(-10, 10)
    return round(min(max(base * 0.85 + noise, 20), 100), 1)


def score_behavior(db, user) -> float:
    """Layer 3: Behavioral Intelligence.
    
    Checks: earnings consistency, pre-disruption activity, time-to-claim analysis.
    Demo: penalizes users with many recent claims.
    """
    recent_claims = crud.count_recent_claims(db, user.id, days=30)
    base = 90

    # Penalty for frequent claims
    if recent_claims > 4:
        base -= 30
    elif recent_claims > 2:
        base -= 15

    noise = random.uniform(-5, 8)
    return round(min(max(base + noise, 15), 100), 1)


def score_cluster(lat: float, lon: float) -> float:
    """Layer 2: Hyperlocal Consensus — 10-20 workers within 500m.
    
    In production: check if peer workers in same 500m radius also report disruption.
    Demo: simulate peer consensus. Chennai coordinates get higher scores.
    """
    # Check if coordinates are within Chennai metro area roughly
    in_chennai = (12.8 <= lat <= 13.3) and (80.0 <= lon <= 80.4)

    if in_chennai:
        base = random.uniform(75, 95)
    else:
        base = random.uniform(40, 70)  # Outside Chennai = fewer peers = lower consensus

    return round(base, 1)


def score_environment(weather_data: dict) -> float:
    """Layer 4: Environmental Validation — cross-check weather data.
    
    Verifies that the claimed disruption matches actual environmental conditions.
    """
    if not weather_data or not isinstance(weather_data, dict):
        return 50.0  # Unknown weather = neutral

    score = 70.0

    # Check rain
    rain = weather_data.get("rain", {})
    if isinstance(rain, dict):
        rain_mm = rain.get("1h", 0) or rain.get("3h", 0) or 0
        if rain_mm >= 15:
            score = 95.0  # Strong environmental signal confirms disruption
        elif rain_mm >= 5:
            score = 85.0
        elif rain_mm > 0:
            score = 75.0

    # Check temperature
    main_data = weather_data.get("main", {})
    if isinstance(main_data, dict):
        temp = main_data.get("temp", 30)
        if temp >= 45:
            score = max(score, 95.0)
        elif temp >= 40:
            score = max(score, 85.0)

    # Check weather condition description
    weather_list = weather_data.get("weather", [])
    for w in weather_list:
        main_cond = w.get("main", "").lower()
        if main_cond in ["rain", "thunderstorm", "drizzle"]:
            score = max(score, 80.0)
        elif main_cond == "extreme":
            score = max(score, 90.0)

    return round(score, 1)


def score_network(ip: str) -> float:
    """Layer 6: Network Validation — VPN/proxy detection.
    
    Detects VPN/proxy usage, ASN analysis, IP reputation.
    """
    if not ip or ip == "0.0.0.0":
        # Demo mode: simulate
        return round(random.uniform(65, 95), 1)

    info = ip_check.check_ip(ip)
    score = 90.0

    org = info.get("org", "") or info.get("asn", "") or ""
    org_lower = org.lower()

    # Known cloud/VPN providers
    vpn_keywords = ["amazon", "aws", "digitalocean", "linode", "google", "azure",
                    "vpn", "proxy", "tunnel", "nord", "express", "surfshark"]

    if any(k in org_lower for k in vpn_keywords):
        score -= 50  # Severe penalty for VPN/cloud IP

    # Check if IP geo matches GPS region (simplified)
    ip_country = info.get("country", "")
    if ip_country and ip_country != "IN":
        score -= 30  # Non-India IP with India GPS = suspicious

    return round(min(max(score, 10), 100), 1)


def score_coordinated(db, user) -> float:
    """Layer 4 (plan): Coordinated Fraud Detection.
    
    Detects claim bursts and multi-user anomaly clusters.
    In production: clustering algorithm on claim timestamps and locations.
    Demo: check if many users filed claims in same timeframe.
    """
    # For demo, simulate with slight randomness
    # In production this would analyze claim_burst patterns
    base = 85
    recent = crud.count_recent_claims(db, user.id, days=7)

    if recent > 3:
        base -= 25  # Suspiciously frequent
    elif recent > 1:
        base -= 10

    noise = random.uniform(-5, 5)
    return round(min(max(base + noise, 15), 100), 1)


def compute_trust_score(db, user, ip: str, weather_data: dict = None, lat: float = 13.0, lon: float = 80.2) -> dict:
    """Compute the full 6-signal trust score.
    
    Returns overall score, individual signals, and tier classification.
    """
    signals = {
        "motion": score_motion(user),
        "behavior": score_behavior(db, user),
        "cluster": score_cluster(lat, lon),
        "environment": score_environment(weather_data or {}),
        "network": score_network(ip),
        "coordinated": score_coordinated(db, user),
    }

    # Weighted average
    overall = sum(signals[k] * WEIGHTS[k] for k in WEIGHTS)
    overall = round(overall, 1)

    # Tier classification
    if overall >= 85:
        tier = "HIGH"
    elif overall >= 50:
        tier = "MEDIUM"
    else:
        tier = "LOW"

    return {
        "overall": overall,
        "signals": signals,
        "tier": tier,
    }


# Backward-compatible wrapper for existing claims.py
def compute_fraud_score(db, user, ip: str, gps_mismatch: bool, lat: float = None, lon: float = None) -> float:
    """Legacy wrapper: returns a simple fraud score 0-100 (higher = more fraudulent).
    
    Maps to: fraud_score = 100 - trust_score
    """
    result = compute_trust_score(db, user, ip, lat=lat or 13.0, lon=lon or 80.2)
    # Invert: trust 90 → fraud 10
    return round(100 - result["overall"], 1)
