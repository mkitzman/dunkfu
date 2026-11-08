# dunkfu

What happened in the NBA last night: scores, box scores, standings.

Vue 3 (`<script setup>`) + plain CSS, built with Vite. The original PHP site lives on the `legacy` branch and the `v1-php` tag.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Layout

- `src/pages/` — LastNight (`/`, `/:date`), BoxScore (`/game/:id`), Standings (`/standings`)
- `src/components/` — header, team/seed marks, game card, tables, leader cards
- `src/styles/tokens.css` — color/type tokens (light + dark) and the shared table pattern
- `src/api/` — data access; reads the JSON in `public/data/` (set `VITE_MOCK=1` for the design mock data)
- `server/pipeline.js` — pulls data from the Highlightly API (shared by the local script and Netlify)
- `netlify/functions/` — `data-refresh` (daily at 10:00 UTC, writes to Netlify Blobs) and `data` (serves `/data/*` from Blobs)
- `src/data/teams.json` — team abbreviations, divisions, colors

## Data

Copy `.env.example` to `.env` and add a Highlightly API key, then:

```sh
npm run fetch-data
```

This writes games, box scores, player lines, season averages and standings to `public/data/` (override with `DATA_DIR`). Raw API responses for finished games are cached in `data/cache/`, and daily standings snapshots in `data/history/` power last night's seed change. The free plan allows 100 requests a day; the script stops before the limit and resumes on the next run.

Set `VITE_TODAY=YYYY-MM-DD` to pin "today" (useful with the mock data, which covers Oct 30 – Nov 2, 2026).

## Deploy (Netlify)

`netlify.toml` builds with `npm run build` and publishes `dist/`. Set `HIGHLIGHTLY_API_KEY` in the site's environment variables. The scheduled `data-refresh` function fills Netlify Blobs each morning; the site reads it through `/data/*`. Local runs and Netlify share the key's 100 requests a day.
