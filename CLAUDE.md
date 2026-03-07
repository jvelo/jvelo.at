# CLAUDE.md

## Project

Personal website for Jérôme Velociter. Built with Hono (JSX) + TypeScript.

## Design rules

- **Figma to CSS scaling**: multiply all Figma dimension values by 0.9 before using in CSS
- **Units**: use `rem` for font-size, line-height, and spacing. Keep `px` only for borders, outlines, and border-radius
- **Fonts**: IBM Plex Sans (body), IBM Plex Sans Condensed (headings), IBM Plex Mono (code), Crimson Text (serif accents)
- **Breakpoints**: mobile < 576px, tablet 576px–1023px, desktop >= 1024px

## Stack

- Runtime: Hono with JSX
- Styles: plain CSS (`public/styles.css`), CSS variables for theming
- Build: `npm run build` (runs `tsc`)
- Content: Markdown bundled via `scripts/bundle-content.ts`
