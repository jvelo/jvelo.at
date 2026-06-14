# CLAUDE.md

## Project

Personal website for Jérôme Velociter. Built with Hono (JSX) + TypeScript.

## Design rules

- **Figma to CSS scaling**: multiply all Figma dimension values by 0.9 before using in CSS
- **Units**: use `rem` for font-size, line-height, and spacing. Keep `px` only for borders, outlines, and border-radius
- **Fonts**: IBM Plex Sans (body), IBM Plex Sans Condensed (headings), IBM Plex Mono (code), Crimson Text (serif accents)
- **Breakpoints**: mobile < 576px, tablet 576px–1023px, desktop >= 1024px

## Stack

- Runtime: Hono with JSX on Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Styles: plain CSS (`public/styles.css`), CSS variables for theming
- Package manager: pnpm (enforced via `packageManager` field and `preinstall` guard)
- Build: `pnpm run build` (runs `tsc`)
- Deploy: `pnpm run deploy` (runs `wrangler deploy`)
- Content: Markdown bundled via `scripts/bundle-content.ts`
- Admin: [Tapemark](https://github.com/jvelo/tapemark) (`@jvelo/tapemark-hono` + `@jvelo/tapemark-d1`)

## Atlas (curated sites)

Member-only `/atlas` page listing curated websites with fetched metadata and AI-generated blurbs.

- **Tables**: `sites` (id, url, note, ai_blurb, display_order) and `url_metadata` (keyed by `url`). Joined read-side via the `sites_with_metadata` view.
- **`url_metadata` is decoupled by design** — shared URL-metadata cache, not a `sites` detail table. No FK, no cascade. Orphan rows are fine.
- **Metadata provider**: opengraph.io (`OPENGRAPH_API_KEY`). Free tier has no proxy, so sites that block datacenter IPs return ~empty pages — `url-metadata.ts` demotes those to `fetch_error` so they don't cache as silent success.
- **Blurb generation**: Claude Haiku via `ANTHROPIC_API_KEY`. Triggered on site insert (`afterInsert` hook) and via admin "regenerate blurb" action.
- **Visual fallback**: `og_image_url` → stored screenshot → WordPress mshots (`s0.wp.com/mshots/v1/...`) → hidden. Wired in `AtlasPage.tsx` with an `onerror` cascade.
