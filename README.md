Source code for my personal website at [jvelo.at](https://jvelo.at).

## Stack

- **Runtime**: [Hono](https://hono.dev/) with JSX on [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **Styles**: Plain CSS with CSS variables for theming
- **Fonts**: IBM Plex Sans, IBM Plex Sans Condensed, IBM Plex Mono, Crimson Text, Departure Mono
- **Admin**: [Tapemark](src/admin/) (D1 database admin panel)

## Development

```bash
pnpm install
pnpm run dev
```

Opens at [http://localhost:8787](http://localhost:8787).

Markdown pages and the résumé are compiled into `src/content-bundle.ts` at build time. To rebuild the bundle automatically while editing content, run this in a second terminal:

```bash
pnpm run dev:content
```

## Build & Deploy

```bash
pnpm run build
pnpm run deploy
```

## Résumé

The résumé content lives in `resume/resume.yaml`, with its logos in `public/images/resume/`. Text fields accept Markdown links. Two renderers read it: `resume/resume.typ` ([Typst](https://typst.app)) produces the PDF, and `src/components/ResumePage.tsx` renders `/resume`. The content bundle step pre-renders the Markdown, so the page updates on the next build; the PDF is built by `pnpm run resume`, which `pnpm run deploy` runs automatically. The PDF build needs the `typst` binary and the IBM Plex Sans, IBM Plex Sans Condensed and Departure Mono fonts installed, and fails if the document exceeds two pages.

## Database

See [ADMIN.md](ADMIN.md) for D1 database commands (execute SQL, export, manage users, apply migrations).

## Footer artwork

See [the artwork guide](docs/footer-artwork.md) for the approved owl reference, reusable processing prompt, pixel/dithering workflow, and light/dark footer integration requirements.

## License

The code for the site is licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/).
