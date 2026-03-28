# Local Docker

```bash
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:3001`
Backend: `http://localhost:5000`

# Public Deployment Notes

Set these in `.env` before deploying publicly:

- `SECRET_KEY`: required for stable and secure Flask sessions
- `DATABASE_URL`: set this to use Postgres in production; if unset, local SQLite is used
- `ALLOW_SIGNUP=true|false`: backend boolean for whether new accounts can be created
- `NEXT_PUBLIC_ALLOW_SIGNUP=true|false`: frontend boolean so the UI matches signup availability
- `SESSION_COOKIE_SECURE=true`: turn this on behind HTTPS in production
- `APP_ENV=production`: enables stricter backend expectations

Docker note:

- the backend now stores SQLite data in a Docker volume at `/data/attendance.db` to avoid root-owned database files in the repo working tree

# Render Free Tier

This repo is prepared for Render with [render.yaml](/home/nino/personal/uni/128proj/render.yaml):

- `attends-128proj-frontend`: Next.js web service
- `attends-128proj-backend`: Flask web service behind Gunicorn
- `attends-128proj-db`: Render Postgres database

Deploy flow:

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from the repo.
3. Review the generated service names from `render.yaml`.
4. If Render gives the backend a different public URL than `https://attends-128proj-backend.onrender.com`, update `NEXT_PUBLIC_BACKEND_URL` on the frontend service after the first deploy.
5. Leave `ALLOW_SIGNUP=false` and `NEXT_PUBLIC_ALLOW_SIGNUP=false` for a portfolio deployment unless you explicitly want open public registration.

Notes:

- local development still uses SQLite by default
- Render deployment uses Postgres through `DATABASE_URL`
- Render free web services spin down on idle, so cold starts are expected
- this setup is suitable for a portfolio demo, not a production-grade public service

# Security Checklist

See [SECURITY_CHECKLIST.md](/home/nino/personal/uni/128proj/SECURITY_CHECKLIST.md) before making the deployment public.
