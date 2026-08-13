@AGENTS.md

# Project: enfineitz case-studies site

Jürgen's design portfolio / case-studies site, served at `case-studies.enfineitz.com`.

## Stack

- **Next.js 16** (App Router) + **React 19**, **TypeScript** (strict).
- **Tailwind CSS v4** (via `@tailwindcss/postcss`).
- **Static export** — `next.config.ts` sets `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. The build emits plain HTML/CSS/JS to `/out`.
- Path alias: `@/*` → repo root (e.g. `@/components/Navigation`).

## Commands

- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — static export to `/out`
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm run tokens` — regenerate design tokens (`scripts/sync-tokens.mjs`)

## Static-export constraints (important)

Because this is a static export, there is **no server runtime**. Do NOT add API routes, server actions, middleware, ISR, or SSR/`dynamic` data fetching. Everything must be renderable at build time. `next/image` optimization is off — size images manually.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` runs on GitHub Actions: `npm ci`, `npm run build`, then **rsync** `/out` to the VPS over SSH (secrets: `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_SSH_KEY`). This is **not** Vercel or GitHub Pages — ignore the Vercel section in `README.md`.

## Content model

Case studies are **content-driven, not hardcoded**:

- Each case study body is a JSON file of typed content blocks in `content/case-studies/*.json`.
- Block types (`hero`, `summary`, `gallery`, `section`, …) are defined in `content/case-studies/contentMap.ts`, which also imports every case-study JSON.
- The index/list metadata lives in `content/case-studies.json` (slug, title, client, role, year, tags, cover image, `published`).
- The template `app/case-study/[slug]/page.tsx` renders blocks via `components/CaseStudyContent.tsx`.
- Site/bio content also lives as JSON in `content/` (`bio.json`, `enfineitz.json`).

To add a case study: create `content/case-studies/<slug>.json`, register it in `contentMap.ts`, and add its metadata to `content/case-studies.json`.

## Design tokens

Source of truth is `tokens/enfineitz-tokens.json`; `npm run tokens` syncs them into the Tailwind config. Edit tokens there, not by hardcoding values in components.

## Known issues

- `.github/workflows/validate-tokens.yml` references npm scripts (`validate:schema`, `validate:refs`) and files (`primitives.json`, `semantic/**`, `token-schema.json`) that don't exist in the repo — that workflow will fail if triggered. Flag before relying on it.
