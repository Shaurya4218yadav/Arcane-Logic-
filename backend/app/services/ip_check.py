import requests

def check_ip(ip: str):
    """Simple IP lookup using ipapi.co (no token required for basic info)."""
    try:
        r = requests.get(f"https://ipapi.co/{ip}/json/", timeout=5)
        r.raise_for_status()
        return r.json()
    except Exception:
        return {}
