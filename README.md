# PhatPanda Production TVs

Five plant-floor TV dashboards for **Grow Op Farms / PhatPanda**, plus a landing page. Pure static HTML/CSS/JS — drops onto Vercel (or any static host) with zero build step.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing page with cards linking to every TV |
| `shipping.html` | TV 1 — loading dock: today's routes, store progress, TRUCK OUT celebration |
| `cultivation.html` | TV 2 — bucking (14-day) + prune (today) + trim queue |
| `joint-room.html` | TV 3 — infused joints leaderboard, strain mix, JNation tile |
| `packaging.html` | TV 4 — Scale Squad machine tiles + Extraction packaging leaderboard |
| `manager.html` | TV 5 — whole-plant roll-up: 6 KPI tiles + per-team top 3 + scrolling ticker |
| `styles.css` | Shared PhatPanda design tokens + components |
| `common.js` | Shared helpers: clock, confetti, audio, celebration overlay, 1280×720 stage scaler |

## Design

Each dashboard renders on a fixed **1280×720** stage that auto-scales to fill any TV viewport with letterboxing. Colors:

- **Black** background, **Phat Green** (`#72BC44`) for branding and "on pace"
- **Amber** (`#FFC24B`) for "behind / in progress", **Red** (`#FF4D5E`) for "at risk / down"
- Font: **Archivo** (free Google Fonts substitute for PhatPanda's paid Termina)

Each dashboard auto-fires its headline celebration shortly after page load so a presentation lands the wow moment.

## Deploy to Vercel

The simplest path:

1. Create a new GitHub repo (empty, no README needed — we already have one).
2. From this folder:
   ```sh
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), import the repo. Framework preset: **Other**. Build command: leave blank. Output directory: leave blank (root). Click Deploy.
4. Done — the landing page is at the project root, each TV is `/shipping.html`, `/cultivation.html`, etc.

Alternative (no GitHub): `vercel deploy --prod` from this folder using the Vercel CLI, or drag-and-drop the folder onto a new project at vercel.com/new.

## Local preview

Just open `index.html` in a browser. No server needed.

## Wiring up live data later

These dashboards ship with baked-in demo data so the presentation works offline. To wire each one to its source (Pull Sheet, Bucking Productivity, etc.), replace the `const DATA = { ... };` block in each HTML with a small fetch from your data source, or pre-render the JSON server-side and inject it the same way the `shipping/` folder's Python generator already does for the loading dock.
