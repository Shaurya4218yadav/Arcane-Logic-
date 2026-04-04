"""Weather Service — OpenWeatherMap API with Chennai-specific fallback simulation."""

import requests
import random
from app.core.config import OPENWEATHER_API_KEY

# Chennai zone coordinates for reference
CHENNAI_ZONES = {
    "Adyar": (13.0067, 80.2206),
    "Velachery": (12.9758, 80.2205),
    "T. Nagar": (13.0418, 80.2341),
    "Anna Nagar": (13.0860, 80.2101),
    "Tambaram": (12.9249, 80.1000),
    "Perungudi": (12.9611, 80.2470),
    "Sholinganallur": (12.9010, 80.2279),
}


def get_weather(lat: float, lon: float) -> dict:
    """Return weather data dict. Falls back to Chennai-realistic simulation if no API key."""
    if not OPENWEATHER_API_KEY:
        return _simulate_chennai_weather(lat, lon)

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"}
    try:
        r = requests.get(url, params=params, timeout=5)
        r.raise_for_status()
        return r.json()
    except Exception:
        return _simulate_chennai_weather(lat, lon)


def _simulate_chennai_weather(lat: float, lon: float) -> dict:
    """Simulate realistic Chennai weather for demo purposes.
    
    Chennai climate: tropical, avg 28-35°C, monsoon Oct-Dec with heavy rain.
    """
    in_chennai = (12.8 <= lat <= 13.3) and (80.0 <= lon <= 80.4)

    # Randomly pick a condition weighted towards disruption for demo impact
    conditions = [
        {"main": "Rain", "description": "heavy intensity rain", "weight": 35},
        {"main": "Thunderstorm", "description": "thunderstorm with heavy rain", "weight": 15},
        {"main": "Clear", "description": "clear sky", "weight": 20},
        {"main": "Clouds", "description": "overcast clouds", "weight": 15},
        {"main": "Drizzle", "description": "light drizzle", "weight": 10},
        {"main": "Extreme", "description": "extreme heat advisory", "weight": 5},
    ]

    if not in_chennai:
        # Outside Chennai — mostly clear
        return {
            "weather": [{"main": "Clear", "description": "clear sky"}],
            "main": {"temp": 32, "humidity": 60},
            "rain": {},
        }

    # Weighted random selection
    total = sum(c["weight"] for c in conditions)
    r = random.uniform(0, total)
    cumulative = 0
    selected = conditions[0]
    for c in conditions:
        cumulative += c["weight"]
        if r <= cumulative:
            selected = c
            break

    weather_entry = {"main": selected["main"], "description": selected["description"]}

    # Temperature
    if selected["main"] == "Extreme":
        temp = random.uniform(44, 48)
    elif selected["main"] in ["Rain", "Thunderstorm"]:
        temp = random.uniform(24, 30)
    else:
        temp = random.uniform(30, 38)

    # Rain data
    rain_data = {}
    if selected["main"] in ["Rain", "Thunderstorm"]:
        rain_data = {"1h": round(random.uniform(8, 25), 1)}
    elif selected["main"] == "Drizzle":
        rain_data = {"1h": round(random.uniform(1, 4), 1)}

    return {
        "weather": [weather_entry],
        "main": {"temp": round(temp, 1), "humidity": random.randint(60, 95)},
        "rain": rain_data,
        "wind": {"speed": round(random.uniform(2, 15), 1)},
        "name": "Chennai",
    }


def check_thresholds(weather_data: dict) -> dict:
    """Check if weather meets parametric trigger thresholds.
    
    Triggers:
    - Rain > 15mm/hr
    - Temperature > 45°C
    - Thunderstorm conditions
    """
    rain_mm = 0
    temp_c = 30
    triggered = False
    trigger_type = "none"
    reasons = []

    if isinstance(weather_data, dict):
        # Rain check
        rain = weather_data.get("rain", {})
        if isinstance(rain, dict):
            rain_mm = rain.get("1h", 0) or rain.get("3h", 0) or 0

        # Temperature check
        main_data = weather_data.get("main", {})
        if isinstance(main_data, dict):
            temp_c = main_data.get("temp", 30)

        # Condition check
        for w in weather_data.get("weather", []):
            condition = w.get("main", "").lower()
            if condition == "thunderstorm":
                triggered = True
                trigger_type = "flood"
                reasons.append(f"Thunderstorm detected")

        if rain_mm >= 15:
            triggered = True
            trigger_type = "flood"
            reasons.append(f"Rain {rain_mm}mm/hr > 15mm threshold")
        elif rain_mm >= 5:
            triggered = True
            trigger_type = "heavy_rain"
            reasons.append(f"Rain {rain_mm}mm/hr — moderate disruption")

        if temp_c >= 45:
            triggered = True
            trigger_type = "heat"
            reasons.append(f"Temperature {temp_c}°C > 45°C threshold")
        elif temp_c >= 42:
            reasons.append(f"Temperature {temp_c}°C — heat advisory zone")

    return {
        "triggered": triggered,
        "trigger_type": trigger_type,
        "rain_mm": rain_mm,
        "temp_c": temp_c,
        "reasons": reasons,
    }
