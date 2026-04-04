import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Testing URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("Successfully connected to Supabase!")
        result = connection.execute("SELECT now()")
        print(f"Database time: {result.fetchone()[0]}")
except Exception as e:
    with open("error.log", "w") as f:
        f.write(str(e))
    print(f"Error connecting: {e}")
