# PulsePOS

A modern point-of-sale for small shops: fast checkout, inventory, sales history with voids, and a live analytics dashboard.

**Stack:** Laravel 13 · Inertia 3 · React 19 · TypeScript · Tailwind 4 · shadcn/ui · Postgres (Neon) · Pest · GitHub Actions · Vercel

## Features
- **POS:** keyboard-first (`/` search, `F2` charge), stock-capped cart, discounts, tax, cash (quick-amount buttons) or card, printable receipts
- **Correct money:** all totals computed in integer cents, identical on client and server
- **Safe checkout:** single DB transaction, row locks in id order (no deadlocks / oversells)
- **Sales history:** search, filter, void (idempotent, restores stock)
- **Dashboard:** revenue trend, top products, category revenue, low-stock alerts
- **Auth:** Fortify with 2FA and passkeys; one-click demo login
- **Tests:** Pest feature tests for totals, stock rollback, voids, auth

## Run locally
```bash
composer setup
php artisan migrate:fresh --seed   # demo@pulsepos.test / password, 30 days of sales
composer dev
```

## Deploy
- **Vercel** (`vercel.json`, community `vercel-php` runtime): set `APP_KEY`, `DB_CONNECTION=pgsql`, `DB_URL` (Neon), `APP_URL`. Build assets locally (`npm run build`) then `vercel --prod`. Run `php artisan migrate --force --seed` once against the Neon DB.
- **Docker** (`Dockerfile`): any container host.
- Vercel's disk is ephemeral: set `POS_IMAGE_DISK=s3` + AWS_* (R2/S3) for product image uploads.
