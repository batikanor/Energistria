# Energistria

Energistria is a Vercel-ready demo for renewable installer outreach.

It turns three sample customer profiles into a visual sales argument:

- fictional LinkedIn-style lead profile and Berlin address
- ArcGIS Living Atlas Wayback neighborhood imagery animation
- customer-specific solar persuasion brief
- quote metrics, objections, and next outreach action

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Verify

```bash
npm run lint
npm run build
```

## Vercel

The app uses standard Next.js App Router routes and deploys directly on Vercel. No required environment variables are needed for the current demo.

The `/api/wayback` route calls `@esri/wayback-core` for local-change imagery releases and falls back to curated Wayback releases if Esri is unavailable during a pitch.
