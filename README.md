# BioYou

AI-powered food health advisor for India. Scan barcodes or nutrition labels, get health scores, track meals, and contribute to the community product database.

## Features

- Barcode and label scanning with multi-layer product lookup
- Health score (0–10), harmful ingredients, FSSAI checks, NOVA classification
- Personalized suitability (diabetes, BP, dietary preferences)
- Meal logging, dashboard macros, streaks, weekly insights
- Crowdsourcing: contribute, validate, leaderboard
- Google OAuth, profile setup, GDPR export/delete
- PWA with offline support

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (PostgreSQL), NextAuth (Google)
- Gemini, Groq, Open Food Facts, Resend

## Setup

1. Clone and install:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

Fill in all required values (see `.env.local.example`).

3. Apply Supabase migrations in order (see [`supabase/migrations/README.md`](supabase/migrations/README.md)).

4. Run locally:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest watch |
| `npm run test:run` | Vitest CI run |

## Deployment (Vercel)

- Set all env vars from `.env.local.example`
- `vercel.json` configures weekly report cron (`/api/cron/weekly-report`) — requires `CRON_SECRET` and `Authorization: Bearer <CRON_SECRET>`
- Set `ADMIN_EMAILS` for admin panel access

## Security notes

- AI and scan APIs require authentication and rate limiting
- Unsubscribe links use HMAC-signed tokens
- Admin actions are enforced server-side via `ADMIN_EMAILS`

## License

Private — All rights reserved.
