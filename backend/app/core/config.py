from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[2]
_env = BASE_DIR / ".env"
if _env.exists():
    load_dotenv(_env)
else:
    # fallback to environment
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./backend.db")

# Render / Supabase compat: postgres:// → postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Supabase requires SSL from external hosts
if DATABASE_URL.startswith("postgresql://") and "sslmode" not in DATABASE_URL:
    sep = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL += f"{sep}sslmode=require"
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:5173").split(",") if o.strip()]
SECRET_KEY = os.getenv("SECRET_KEY", "devkey")
