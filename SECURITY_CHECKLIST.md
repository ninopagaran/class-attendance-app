# Security Checklist

Use this checklist before making the app public.

## Current Controls

- [x] `SECRET_KEY` comes from environment in production
- [x] sign up can be disabled with `ALLOW_SIGNUP`
- [x] frontend respects signup availability with `NEXT_PUBLIC_ALLOW_SIGNUP`
- [x] secure session cookie support is controlled with env vars
- [x] production config uses `SESSION_COOKIE_SECURE=true` in `render.yaml`
- [x] request body size is capped with `MAX_CONTENT_LENGTH_MB`
- [x] oversized proof uploads are capped with `MAX_PROOF_BASE64_CHARS`
- [x] basic input validation exists for auth fields
- [x] backend sends baseline security headers
- [x] backend runs with Gunicorn for deployment
- [x] Render deployment uses Postgres instead of ephemeral local SQLite

## Required Before Public Demo

- [ ] set a strong `SECRET_KEY`
- [ ] verify `NEXT_PUBLIC_BACKEND_URL` matches the actual backend Render URL
- [ ] keep `ALLOW_SIGNUP=false` and `NEXT_PUBLIC_ALLOW_SIGNUP=false` unless you explicitly want open registration
- [ ] create your own demo/test accounts before closing signup
- [ ] confirm `SESSION_COOKIE_SECURE=true` in production
- [ ] confirm `APP_ENV=production`
- [ ] verify the frontend and backend are both using HTTPS on Render
- [ ] review Render logs after first deploy for failed auth/database requests

## Recommended If You Ever Open Public Signup

- [ ] add rate limiting for `POST /signup` and `POST /signin`
- [ ] add email verification
- [ ] add password reset flow
- [ ] add account lockout or cooldown on repeated failed logins
- [ ] add abuse monitoring/log review

## Known Limits

- Render free web services cold start after idle
- Render free is acceptable for a portfolio demo, not for a serious public production app
- current auth is session-cookie based and intentionally simple; it is fine for a demo, but not a fully hardened consumer auth system
