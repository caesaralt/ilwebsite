# Integratd Website

Modern marketing site foundation built with **Next.js (App Router)** + **TypeScript** + **Tailwind**.

## What’s included
- Dark, premium UI baseline (theme tokens via CSS variables)
- Responsive menu/navigation (desktop + mobile)
- Landing page structure migrated from current Integratd content
- Working enquiry form posting to `POST /api/lead` (currently logs to server output)

## Local development
```bash
npm install
npm run dev
```

## Deployment (Render)
Recommended setup:
- Connect Render to this GitHub repo
- Web Service:
  - Build command: `npm ci && npm run build`
  - Start command: `npm run start`
  - Node version: `18+`

Leads submitted through the enquiry form are logged to server output for now. Next step is to persist them (e.g., Render Postgres) or forward to a CRM.

## Brand/theme
Update theme tokens in `src/app/globals.css`:
- `--bg`, `--panel`, `--fg`, `--muted`, `--border`
- `--accent`, `--accent2`


