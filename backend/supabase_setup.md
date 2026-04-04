# Supabase setup (provided credentials)

Commands you can run locally (supabase CLI required):

```bash
supabase login
supabase init
supabase link --project-ref ybpfvytfzrsbzpjptbfg
```

Connection info (already added to `.env`):

- Supabase URL: https://ybpfvytfzrsbzpjptbfg.supabase.co
- Supabase anon/publishable key: sb_publishable_h2yAQF8JO9oCO111v12mVQ_nspZvLAy
- Postgres URL: postgresql://postgres:Abhinandan@007CR7@db.ybpfvytfzrsbzpjptbfg.supabase.co:5432/postgres

Note: the `DATABASE_URL` in `.env` has the password URL-encoded so SQLAlchemy can connect. If you rotate credentials, update `.env`.
