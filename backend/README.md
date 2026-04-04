# VayuGuard Backend (FastAPI)

Quickstart (local/demo):

1. Create virtualenv and install:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and edit keys (see notes below).

3. Run the app:

```powershell
uvicorn app.main:app --reload --port 8000
```

API base: `http://localhost:8000`

Env vars (in `.env`):
- `OPENWEATHER_API_KEY` — Get from https://openweathermap.org (free tier). Create account → API keys → copy key.
- `DATABASE_URL` — If you want Supabase Postgres, create a project at https://supabase.com, open Project → Settings → Database → Connection string and paste the Postgres URL. For local dev the default uses SQLite (`sqlite:///./backend.db`).
- `CORS_ORIGINS` — comma-separated origins for frontend, default: `http://localhost:5173`

Notes:
- If `OPENWEATHER_API_KEY` is not set the service falls back to simulated weather so you can run the demo without external keys.
- `ipapi.co` is used for simple IP lookups; no key required for basic lookup. If you prefer `ipinfo` provide a token and update `app/services/ip_check.py`.

Quick test flow (after server is running):

1. Register a user:

```bash
curl -X POST "http://localhost:8000/auth/register" -H "Content-Type: application/json" -d '{"phone":"+911234567890","platform":"deliver"}'
```

Response includes `api_key` — send it as header `X-API-Key` or `Authorization: Bearer <key>` for protected endpoints.

2. Use `/events/check`, `/claims`, and `/video/verify` as described in the code. Open `http://localhost:8000/docs` for interactive docs.
