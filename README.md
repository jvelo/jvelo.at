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

## Build & Deploy

```bash
pnpm run build
pnpm run deploy
```

## Résumé

The résumé source is `resume/resume.typ` ([Typst](https://typst.app)). `pnpm run resume` compiles it to `public/`, and `pnpm run deploy` does so automatically. It is served at `/resume`. The build needs the `typst` binary and the IBM Plex Sans, IBM Plex Sans Condensed and Departure Mono fonts installed; it fails if the document exceeds two pages.

## Database

See [ADMIN.md](ADMIN.md) for D1 database commands (execute SQL, export, manage users, apply migrations).

## License

The code for the site is licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/).
