# Admin Panel — Library Design

## Overview

A generic, self-contained database admin panel for SQLite-compatible databases (D1, better-sqlite3, libSQL). Framework-agnostic core with thin adapters for Hono, Next.js, Koa, Express, and others.

## Goals

- **Generic** — works with any SQLite schema, no codegen or config files required
- **Self-contained** — own routes, components, styles, migrations. No dependency on host app beyond the database instance and an auth check
- **Framework-agnostic** — core logic and rendering are independent of any web framework. Framework adapters are thin wrappers that handle request/response translation
- **Portable** — same code runs on Cloudflare Workers (D1), Node.js (better-sqlite3), or any SQLite-compatible runtime
- **Sync-aware** — understands schema versions and can sync content between local and remote databases

## Database Adapter

The library defines a minimal interface that both D1 and native SQLite can implement:

```typescript
interface Database {
  prepare(query: string): PreparedStatement;
}

interface PreparedStatement {
  bind(...values: unknown[]): PreparedStatement;
  all(): Promise<{ results: Record<string, unknown>[] }>;
  first(): Promise<Record<string, unknown> | null>;
  run(): Promise<void>;
}
```

Adapters wrap the underlying driver to match this interface. The library ships two:
- `D1Adapter` — passthrough, D1 already matches
- `SqliteAdapter` — wraps `better-sqlite3` with async signatures

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│  Framework Adapters (Hono, Next, Koa, ...)  │
│  Translates request/response for each       │
│  framework. Thin glue only.                 │
├─────────────────────────────────────────────┤
│  Core Router                                │
│  Framework-agnostic request handling.       │
│  Receives { method, path, query, body },    │
│  returns { status, headers, html }.         │
├─────────────────────────────────────────────┤
│  Rendering (JSX → HTML string)              │
│  Uses a lightweight JSX-to-string renderer  │
│  (no React, no Hono JSX at this layer).     │
│  Components produce HTML strings.           │
├─────────────────────────────────────────────┤
│  Database Layer                             │
│  Schema introspection, CRUD, config, sync.  │
│  Uses the Database adapter interface.       │
├─────────────────────────────────────────────┤
│  Database Adapters (D1, better-sqlite3, ..) │
└─────────────────────────────────────────────┘
```

### Core Request/Response

The core doesn't depend on any framework's types. It defines its own:

```typescript
interface TapemarkRequest {
  method: string;
  path: string;                          // relative to mount point
  query: Record<string, string>;
  body?: Record<string, string | string[]>;
}

interface TapemarkResponse {
  status: number;
  headers: Record<string, string>;
  html?: string;
  redirect?: string;
}
```

Each route handler is a pure function: `(req: TapemarkRequest, db: Database) => Promise<TapemarkResponse>`.

### Framework Adapters

Adapters are small packages that translate between the framework's request/response and the core's. Each is ~50 lines:

```typescript
// tapemark/hono
import { createAdminCore } from 'tapemark';

export function createAdmin(opts) {
  const core = createAdminCore(opts);
  const app = new Hono();
  app.all('*', async (c) => {
    const req = { method: c.req.method, path: c.req.path, ... };
    const res = await core.handle(req);
    if (res.redirect) return c.redirect(res.redirect, res.status);
    return c.html(res.html, res.status);
  });
  return app;
}
```

```typescript
// tapemark/next
import { createAdminCore } from 'tapemark';

export function createAdminHandler(opts) {
  const core = createAdminCore(opts);
  return async (req, res) => {
    const adminReq = { method: req.method, path: req.url, ... };
    const adminRes = await core.handle(adminReq);
    if (adminRes.redirect) return res.redirect(adminRes.status, adminRes.redirect);
    res.status(adminRes.status).send(adminRes.html);
  };
}
```

### Rendering

Components use a minimal JSX-to-string function (like `vhtml` or a custom ~100 line implementation). No runtime framework dependency. The JSX factory produces HTML strings at build time, not virtual DOM.

This means the current Hono JSX components would be ported to framework-agnostic JSX. The output is always a string.

## Auth Integration

The library does not implement auth. It accepts an `authorize` callback:

```typescript
interface TapemarkOptions {
  authorize?: (req: TapemarkRequest) => Promise<boolean>;
  // ...
}
```

The callback receives the raw request and returns whether access is allowed. Framework adapters can provide helpers to extract auth from framework-specific mechanisms:

```typescript
// Hono
createAdmin({
  authorize: honoAuth(requireAuth('admin')),
});

// Next.js
createAdmin({
  authorize: nextAuth(getServerSession),
});

// Simple token check
createAdmin({
  authorize: (req) => req.query.token === process.env.ADMIN_TOKEN,
});
```

If no `authorize` is provided, the panel is unprotected (useful for local dev). A warning is logged in production.

## Schema Versioning

### Admin-owned tables

The library manages its own tables, prefixed with `_tapemark_`:

- `_tapemark_meta` — key-value store for library state (schema version, settings)
- `_tapemark_table_config` — per-table display configuration (column types, labels, visibility, thumbnail sizes)

These tables are created automatically on first request (auto-migration). They are excluded from the table browser.

### Version tracking

```
_tapemark_meta
  key TEXT PRIMARY KEY
  value TEXT
```

Keys:
- `schema_version` — integer, incremented when the library's own schema changes
- `app_schema_hash` — hash of the app's current schema (from `sqlite_master`), used for sync compatibility checks

The app schema hash is computed as: `SHA-256(sorted CREATE TABLE statements from sqlite_master)`. This captures table structure without depending on a migration system.

### Auto-migration

On first request, the library:
1. Checks if `_tapemark_meta` exists
2. If not, creates all admin tables (initial setup)
3. If yes, reads `schema_version` and applies any pending admin migrations
4. Updates `app_schema_hash` with the current schema fingerprint

This happens once per cold start, not on every request (cached in memory).

## Content Sync

### Problem

D1 doesn't support binary SQLite file uploads. Syncing content between environments (local dev → production) requires SQL-level operations. There's a risk of serving empty data during the process.

### Design

Sync is a **pull or push of row data**, not schema. Schema must match before sync is allowed.

#### Pre-flight check

1. Read `app_schema_hash` from both source and target
2. If they differ, abort with error: "Schema mismatch — run migrations on target first"
3. If they match, proceed

#### Sync modes

**Full sync** (replace all content):
1. For each app table (excluding `_tapemark_*`, `d1_migrations`, `sqlite_*`, `_cf_*`):
   - Generate `INSERT OR REPLACE INTO table (cols...) VALUES (?, ?, ...)` in batches
   - Execute on target
2. For each app table, delete rows on target that don't exist on source:
   - `DELETE FROM table WHERE pk NOT IN (...)`
3. This is not atomic — there's a brief window of inconsistency

**Incremental sync** (future):
- Track `updated_at` columns where available
- Only sync rows modified since last sync
- Requires app cooperation (timestamp columns)

#### Remotes

Each database can have named remotes stored in `_tapemark_meta`, similar to git remotes. A remote defines where and how to sync.

```bash
# Add a remote
npx tapemark remote add production d1:jvelo-at-db
npx tapemark remote add staging scp:user@host:/var/data/app.db
npx tapemark remote add backup ftp://backup.example.com/db/app.db

# List remotes
npx tapemark remote list

# Remove a remote
npx tapemark remote remove staging
```

Stored in `_tapemark_meta` as JSON:

```
key: "remotes"
value: {
  "production": { "type": "d1", "database": "jvelo-at-db" },
  "staging": { "type": "scp", "host": "user@host", "path": "/var/data/app.db" },
  "backup": { "type": "ftp", "url": "ftp://backup.example.com/db/app.db" }
}
```

#### Remote types

| Type | Mechanism | Use case |
|------|-----------|----------|
| `d1` | SQL statements via wrangler CLI | Cloudflare Workers |
| `scp` | Upload full SQLite file | VPS, any SSH-accessible server |
| `ftp` | Upload full SQLite file | Traditional hosting |
| `s3` | Upload full SQLite file | Backup, Litestream-style |
| `libsql` | SQL via libSQL wire protocol | Turso |
| `file` | Direct file copy | Local environments |
| `http` | POST SQL batches to an endpoint | Custom sync servers |

For `scp`, `ftp`, `s3`, and `file` — these do a full binary file swap. The target is down briefly during the copy. Best suited for single-server deployments where the process can restart.

For `d1`, `libsql`, and `http` — these use the SQL-level `INSERT OR REPLACE` approach. No downtime but not atomic.

#### Sync commands

```bash
# Push to a named remote
npx tapemark sync ./local.db --to production

# Pull from a named remote
npx tapemark sync production --to ./local.db

# Ad-hoc (no saved remote)
npx tapemark sync ./local.db --to d1:jvelo-at-db

# Dry run
npx tapemark sync ./local.db --to production --dry-run

# Specific tables only
npx tapemark sync ./local.db --to production --tables users,starred_media
```

The sync command resolves named remotes from `_tapemark_meta` in the source database. Ad-hoc targets use the `type:value` syntax directly.

## Table Configuration

Stored in `_tapemark_table_config` as JSON per table:

```json
{
  "columns": {
    "media_url": { "display": "image", "width": 48 },
    "created_at": { "display": "datetime" },
    "metadata": { "display": "json", "hidden": true }
  }
}
```

### Display types

Each display type is a self-describing plugin: a renderer plus a JSON Schema for its options.

```typescript
interface DisplayType {
  name: string;
  description: string;
  schema: JSONSchema;                    // validated options
  render: (value: unknown, options: Record<string, unknown>) => string;
}
```

#### Built-in types

| Type | Rendering | Options schema |
|------|-----------|---------------|
| `text` | Truncated string (default) | `{ maxLength: number (80) }` |
| `image` | Inline thumbnail + hover preview | `{ height: number (48), maxPreview: number (240) }` |
| `link` | Clickable URL | `{ truncate: number (60), external: boolean (true) }` |
| `json` | Syntax-dimmed, collapsible | `{ maxDepth: number (3), collapsed: boolean (false) }` |
| `datetime` | Formatted timestamp | `{ format: string ("YYYY-MM-DD HH:mm"), relative: boolean (false) }` |
| `color` | Swatch + value | `{ swatchSize: number (12) }` |
| `enum` | Badge/label display | `{ colors: Record<string, string> }` |
| `markdown` | Rendered preview | `{ maxLength: number (200) }` |

#### Column config format

The per-column config separates the display type from its options:

```json
{
  "columns": {
    "media_url": {
      "display": "image",
      "options": { "height": 48, "maxPreview": 240 }
    },
    "status": {
      "display": "enum",
      "options": { "colors": { "active": "#4a4", "inactive": "#c44" } }
    },
    "created_at": {
      "display": "datetime",
      "options": { "format": "YYYY-MM-DD", "relative": true }
    },
    "metadata": {
      "display": "json",
      "options": { "maxDepth": 2, "collapsed": true }
    }
  }
}
```

#### Config editor UX

The table config form auto-generates option inputs from the display type's JSON Schema:

1. User selects a display type from the dropdown
2. A `<display-options>` web component reads the selected type's schema
3. It renders the appropriate inputs (number, string, boolean, object) with defaults pre-filled
4. On save, options are validated against the schema before storing

This means adding a new display type automatically gives it a config UI — no form code to write.

#### Custom display types

Consumers register custom types with their schema:

```typescript
createAdmin({
  displayTypes: {
    markdown: {
      name: 'markdown',
      description: 'Rendered markdown preview',
      schema: {
        type: 'object',
        properties: {
          maxLength: { type: 'number', default: 200, description: 'Preview truncation' },
        },
      },
      render: (value, opts) => renderMarkdownPreview(String(value), opts.maxLength),
    },
  },
});
```

Custom types appear in the config dropdown alongside built-ins. Their options schema drives the config form automatically.

## Security

- **SQL injection** — table and column names validated against `sqlite_master` before interpolation. Values always use parameter binding.
- **Auth** — delegated to host app. Library never handles credentials.
- **CSRF** — destructive operations (delete, update) require POST. Bulk delete uses a confirmation dialog.
- **No public exposure** — the panel should only be mounted behind authentication. The library logs a warning if no auth middleware is provided in production.

## File Structure (as library)

```
tapemark/
  core/
    index.ts            — createAdminCore() factory, core router
    db.ts               — schema introspection, CRUD, config, sync
    migrate.ts          — admin auto-migration logic
    render.ts           — minimal JSX-to-string runtime
    assets/
      tapemark.css      — all styles, served at /_tapemark/styles.css
      tapemark.js       — web components, served at /_tapemark/admin.js
    types.ts            — TapemarkRequest, TapemarkResponse, Database interface
    routes/
      tables.tsx        — table list
      rows.tsx          — row browser with pagination
      row-detail.tsx    — view/edit/delete single row
      row-create.tsx    — create row
      table-config.tsx  — per-table display config editor
      bulk-delete.tsx   — bulk row deletion
    components/
      TapemarkLayout.tsx   — HTML shell (own styles, no host dependency)
      DataTable.tsx     — generic data table with configurable cell rendering
      RowForm.tsx       — auto-generated form from column metadata
      Pagination.tsx    — prev/next with row range
      Flash.tsx         — success/error messages
  adapters/
    hono.ts             — Hono sub-app adapter
    next.ts             — Next.js API route / app router adapter
    koa.ts              — Koa middleware adapter
    express.ts          — Express middleware adapter
  db-adapters/
    d1.ts               — Cloudflare D1 adapter (passthrough)
    better-sqlite3.ts   — better-sqlite3 adapter (sync → async wrapper)
    libsql.ts           — libSQL/Turso adapter
  cli/
    index.ts            — CLI entry point, arg parsing
    serve.ts            — standalone server (open DB files, serve UI)
    sync.ts             — sync command
    remote.ts           — remote add/list/remove
    inspect.ts          — schema inspection and diff
  sync-adapters/
    d1.ts               — wrangler-based SQL sync
    scp.ts              — SSH file upload
    ftp.ts              — FTP file upload
    s3.ts               — S3-compatible upload
    libsql.ts           — libSQL wire protocol sync
    file.ts             — local file copy
    http.ts             — HTTP endpoint sync
```

## CLI

The library ships a `tapemark` binary for standalone use — no application code needed.

### Serve

Opens one or more SQLite files and serves the admin UI on them:

```bash
# Single database
npx tapemark serve ./my-app.db

# Multiple databases — each gets its own tab/section
npx tapemark serve ./users.db ./content.db ./analytics.db

# Custom port
npx tapemark serve ./data.db --port 4000

# Read-only mode (no writes, no deletes)
npx tapemark serve ./production-dump.db --readonly

# Glob pattern
npx tapemark serve ./databases/*.db
```

When serving multiple files, the UI adds a database switcher in the admin bar. Each database is independent — its own tables, config, schema version.

Under the hood: spins up a lightweight HTTP server (no framework dependency — uses Node's `http` module or `Bun.serve`), wires the core router with a `better-sqlite3` adapter for each file.

### Sync

Uses named remotes (stored in the database's `_tapemark_meta`) or ad-hoc targets:

```bash
# Push to a named remote
npx tapemark sync ./local.db --to production

# Ad-hoc target
npx tapemark sync ./local.db --to d1:jvelo-at-db

# Pull from remote
npx tapemark sync production --to ./local.db

# Dry run
npx tapemark sync ./local.db --to production --dry-run

# Specific tables
npx tapemark sync ./local.db --to production --tables users,starred_media
```

See the Remotes section under Content Sync for details on remote types and configuration.

### Inspect

Quick schema inspection without starting the UI:

```bash
# List tables and row counts
npx tapemark inspect ./data.db

# Show schema for a specific table
npx tapemark inspect ./data.db --table users

# Compare schemas between two databases
npx tapemark inspect ./local.db --diff d1:jvelo-at-db
```

## Integration API

```typescript
// Hono
import { createAdmin } from 'tapemark/hono';

app.route('/admin', createAdmin({
  authorize: (req) => checkAdmin(req),
  db: (c) => c.env.DB,                 // D1 binding accessor
}));

// Next.js (app router)
import { createAdminHandler } from 'tapemark/next';
import Database from 'better-sqlite3';

const db = new Database('local.db');
export const { GET, POST } = createAdminHandler({
  authorize: (req) => checkSession(req),
  db: () => db,
});

// Koa
import { createAdminMiddleware } from 'tapemark/koa';

router.all('/admin/(.*)', createAdminMiddleware({
  db: () => db,
}));

// Full options (any framework)
createAdmin({
  authorize: (req) => Promise<boolean>,
  db: ...,
  prefix: '/admin',                   // for generating internal links
  displayTypes: { ... },              // custom cell renderers
  tables: {
    users: { readonly: true },
    sessions: { hidden: true },
  },
});
```

## Repository Structure

npm workspaces monorepo. The core library is one package, each framework adapter and sync adapter is a separate package, and examples live alongside.

```
tapemark/
  package.json                          # workspace root
  packages/
    core/                               # tapemark
      package.json
      src/
        index.ts                        # createAdminCore(), core router
        db.ts                           # schema introspection, CRUD, config
        migrate.ts                      # auto-migration
        render.ts                       # JSX-to-string runtime
        styles.ts                       # CSS
        types.ts                        # TapemarkRequest, TapemarkResponse, Database
        routes/
        components/
        assets/
    adapters/
      hono/                             # tapemark-hono
        package.json
        src/index.ts
      next/                             # tapemark-next
        package.json
        src/index.ts
      express/                          # tapemark-express
        package.json
        src/index.ts
      koa/                              # tapemark-koa
        package.json
        src/index.ts
    db-adapters/
      d1/                               # tapemark-d1
        package.json
        src/index.ts
      better-sqlite3/                   # tapemark-better-sqlite3
        package.json
        src/index.ts
      libsql/                           # tapemark-libsql
        package.json
        src/index.ts
    sync-adapters/
      d1/                               # tapemark-sync-d1
        package.json
        src/index.ts
      scp/                              # tapemark-sync-scp
        package.json
        src/index.ts
      s3/                               # tapemark-sync-s3
        package.json
        src/index.ts
      ...
    cli/                                # tapemark-cli (bin: tapemark)
      package.json
      src/
        index.ts
        serve.ts
        sync.ts
        remote.ts
        inspect.ts
  examples/
    hono-d1/                            # Cloudflare Workers + D1
      package.json
      wrangler.toml
      src/index.ts
    next-sqlite/                        # Next.js + better-sqlite3
      package.json
      src/app/admin/[[...path]]/route.ts
    express-sqlite/                     # Express + better-sqlite3
      package.json
      src/index.ts
    koa-libsql/                         # Koa + Turso
      package.json
      src/index.ts
    standalone/                         # CLI-only, no framework
      package.json
      data/sample.db
      README.md                         # just "npx tapemark serve data/sample.db"
```

### Package dependencies

```
tapemark (core)          — zero dependencies
tapemark-hono            — peer: hono, depends: core
tapemark-next            — peer: next, depends: core
tapemark-express         — peer: express, depends: core
tapemark-koa             — peer: koa, depends: core
tapemark-d1              — depends: core (types only, D1 is a runtime API)
tapemark-better-sqlite3  — peer: better-sqlite3, depends: core
tapemark-libsql          — peer: @libsql/client, depends: core
tapemark-sync-*          — depends: core
tapemark-cli             — depends: core, better-sqlite3 adapter, all sync adapters
```

The core package has **zero runtime dependencies**. Framework and DB adapters declare their underlying library as a peer dependency. The CLI bundles everything needed for standalone use.

### Publishing

All packages are published under the `tapemark` npm scope or as `tapemark-*` flat names. The workspace root is not published.

Versioning: all packages share the same version number (like Babel). A single `npm version` at the root bumps everything. This keeps compatibility simple — `tapemark-hono@1.2.0` always works with `tapemark@1.2.0`.

## Inspiration

**[Datasette](https://datasette.io/)** by Simon Willison is a key inspiration. Datasette is an exploration and publishing tool for SQLite — it makes any SQLite file instantly browsable via a web UI, with JSON APIs, faceted search, and a plugin ecosystem.

This project overlaps in philosophy (SQLite as a first-class citizen, instant UI from a file, CLI-first workflow) but differs in focus:

- **Datasette** leans toward exploration, visualization, and publishing. It excels at making databases accessible to non-technical users and exposing them as public APIs, with a rich plugin ecosystem.
- **Tapemark** focuses equally on browsing and editing, adds schema-aware display configuration, multi-environment sync, and embeds into existing apps as a sub-route rather than running as its own server.

Other differences:
- Datasette is Python; this is TypeScript/JavaScript — runs natively on Cloudflare Workers, Bun, Deno, Node
- Datasette has its own server; this embeds into existing apps as a sub-route
- Datasette has a rich plugin system for visualization; this focuses on display types for editing context
- This project adds the sync/remote system for managing data across environments

Where they converge: the CLI experience (`datasette serve data.db` vs `npx tapemark serve data.db`), the philosophy that a SQLite file should be instantly useful, and the respect for SQLite as a legitimate production database.

## Open Questions

- **Static assets** — resolved. The library serves its own CSS and JS from `/_tapemark/styles.css` and `/_tapemark/admin.js`. No host app dependency for static files.
- **Pagination size** — currently hardcoded to 50. Should be configurable per-table.
- **Search/filter** — not implemented. Would need a client-side filter web component or a server-side query parameter.
- **Sort** — not implemented. Would need clickable column headers that add `?sort=col&dir=asc` query params.
- **Undo** — no undo for deletes. Could keep a soft-delete log in `_tapemark_meta` for a limited time.
- **Export** — no CSV/JSON export from the browse view. Natural addition.
