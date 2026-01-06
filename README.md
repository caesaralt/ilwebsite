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

### Cloudflare R2 (media + config persistence)
This project supports storing **uploads (hero, logos, project images)** and **`site.json` config** in Cloudflare R2 so they survive deploys/restarts and load fast via a CDN URL.

Set these environment variables in Render:
- **R2_ACCOUNT_ID**: Cloudflare account ID
- **R2_ACCESS_KEY_ID**: R2 access key ID
- **R2_SECRET_ACCESS_KEY**: R2 secret access key
- **R2_BUCKET**: R2 bucket name
- **R2_PUBLIC_BASE_URL**: public base URL for your bucket (custom domain or public bucket URL). Example: `https://media.yourdomain.com`

Notes:
- Upload endpoints will return **500** if `R2_PUBLIC_BASE_URL` is missing (because assets must be publicly fetchable by browsers).
- Uploaded objects are stored with unique keys and `Cache-Control: public, max-age=31536000, immutable` for fast repeat loads.

Leads submitted through the enquiry form are logged to server output for now. Next step is to persist them (e.g., Render Postgres) or forward to a CRM.

## Brand/theme
Update theme tokens in `src/app/globals.css`:
- `--bg`, `--panel`, `--fg`, `--muted`, `--border`
- `--accent`, `--accent2`


