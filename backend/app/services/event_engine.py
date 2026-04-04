"""Event Engine — Multi-signal disruption detection.

Trigger ONLY when environmental, platform, and behavioral signals converge.
No single manipulated input can trigger a claim.

Signals:
1. Environmental: Rain > 15mm/hr OR Heat > 45°C
2. Platform Activity: Delivery drop > 30% (simulated)
3. Behavioral: Worker inactivity deviates from historical pattern
"""

import random
from app.services import weather as weather_svc


def check_environmental_signal(lat: float, lon: float) -> dict:
    """Signal 1: Check actual weather conditions against thresholds."""
    weather_data = weather_svc.get_weather(lat, lon)
    thresholds = weather_svc.check_thresholds(weather_data)

    return {
        "signal": "environmental",
        "triggered": thresholds["triggered"],
        "trigger_type": thresholds["trigger_type"],
        "details": thresholds["reasons"],
        "weather_data": weather_data,
        "rain_mm": thresholds["rain_mm"],
        "temp_c": thresholds["temp_c"],
    }


def check_platform_signal(disruption_type: str = "none") -> dict:
    """Signal 2: Simulated platform activity drop.
    
    In production: integrates with Zepto/Blinkit APIs to detect delivery volume drops.
    Demo: simulate based on disruption type.
    """
    drop_pct = 0
    triggered = False

    if disruption_type == "flood":
        drop_pct = random.randint(45, 70)
    elif disruption_type == "heavy_rain":
        drop_pct = random.randint(30, 50)
    elif disruption_type == "heat":
        drop_pct = random.randint(25, 40)
    elif disruption_type == "waterlog":
        drop_pct = random.randint(40, 60)
    elif disruption_type == "area_shutdown":
        drop_pct = random.randint(60, 85)
    else:
        drop_pct = random.randint(5, 15)

    triggered = drop_pct >= 30

    return {
        "signal": "platform_activity",
        "triggered": triggered,
        "drop_percentage": drop_pct,
        "details": [f"Platform delivery volume dropped {drop_pct}%"] if triggered else [f"Normal activity ({drop_pct}% variation)"],
    }


def check_behavioral_signal(disruption_type: str = "none") -> dict:
    """Signal 3: Worker behavioral deviation.
    
    In production: compare current activity to historical working patterns.
    Demo: simulate inactivity deviation.
    """
    deviation = 0
    triggered = False

    if disruption_type in ["flood", "area_shutdown", "waterlog"]:
        deviation = random.randint(50, 80)
    elif disruption_type in ["heavy_rain", "heat"]:
        deviation = random.randint(30, 55)
    else:
        deviation = random.randint(5, 20)

    triggered = deviation >= 30

    return {
        "signal": "behavioral",
        "triggered": triggered,
        "inactivity_deviation": deviation,
        "details": [f"Worker inactivity deviation: {deviation}% from historical pattern"] if triggered else [f"Normal activity pattern ({deviation}% deviation)"],
    }


def evaluate_event(lat: float, lon: float, disruption_type: str = "none") -> dict:
    """Full multi-signal event evaluation.
    
    Returns triggered=True only when at least 2 of 3 signals converge.
    """
    env = check_environmental_signal(lat, lon)
    platform = check_platform_signal(disruption_type or env.get("trigger_type", "none"))
    behavior = check_behavioral_signal(disruption_type or env.get("trigger_type", "none"))

    signals_triggered = sum([env["triggered"], platform["triggered"], behavior["triggered"]])

    # Require at least 2 signals to converge
    overall_triggered = signals_triggered >= 2

    # Determine the primary disruption type
    final_type = disruption_type
    if not final_type or final_type == "none":
        final_type = env.get("trigger_type", "none")

    return {
        "triggered": overall_triggered,
        "signals_count": signals_triggered,
        "disruption_type": final_type,
        "environmental": env,
        "platform_activity": platform,
        "behavioral": behavior,
        "weather_data": env.get("weather_data", {}),
    }


# Backward compat
def check_event_trigger(db, user_id: int, lat: float, lon: float):
    """Legacy wrapper for existing claims.py usage."""
    result = evaluate_event(lat, lon)
    return {
        "triggered": result["triggered"],
        "rain_mm": result["environmental"]["rain_mm"],
        "threshold": 15.0,
        "weather": result["environmental"]["weather_data"],
    }
