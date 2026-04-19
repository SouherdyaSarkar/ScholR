from supabase import create_client
import os

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    supabase_url=url,
    supabase_key=key
)
