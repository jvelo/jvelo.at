# Implementation Plan

Derived from DESIGN.md. This document guides the transformation of the prototype in `src/admin/` into the standalone `tapemark` monorepo.

## Reference prototype

The current prototype lives at `src/admin/` in the jvelo.at repository. It works, but is tightly coupled to Hono JSX and has ad-hoc data structures. Use it as a behavioral reference — the feature set is correct, the internals need reworking.

## General directives

### Clean intermediary structures

The prototype returns raw query results as `Record<string, unknown>[]` and passes them through the system loosely typed. The production code should define proper intermediary types at every boundary.

**Schema introspection** should produce well-typed structures:

```typescript
// Not this (prototype style)
const { results } = await db.prepare('PRAGMA table_info(...)').all();
const columns = results as unknown as ColumnInfo[];

// But this — parsed into clean domain types
interface Column {
  name: string;
  type: ColumnType;          // parsed enum, not raw string
  nullable: boolean;         // not a 0/1 number
  defaultValue: string | null;
  primaryKeyPosition: number | null;  // null if not PK, 1+ if PK
}

interface Table {
  name: string;
  columns: Column[];
  primaryKey: string[];      // ordered PK column names
  rowCount: number;
}

interface Schema {
  tables: Table[];
  hash: string;              // for sync compatibility
}
```

A `SchemaIntrospector` class or module owns the raw SQL and returns these clean types. Nothing downstream ever sees `PRAGMA` results or `sqlite_master` rows.

**Row data** should be typed per-operation:

```typescript
// Query result
interface RowResult {
  columns: Column[];
  rows: CellValue[][];       // indexed by column order, not string keys
  total: number;
  page: number;
  pageSize: number;
}

// For forms
interface RowData {
  values: Map<string, CellValue>;
  primaryKey: Map<string, CellValue>;
}

type CellValue = string | number | null | Uint8Array;
```

### Separation of concerns

The prototype mixes DB queries, HTML generation, and request handling in the route files. Production code should have clear layers:

1. **Database layer** — queries and introspection. Returns domain types. No HTML, no request objects.
2. **Service layer** — business logic (validation, config resolution, pagination math). Calls DB layer. Returns view models.
3. **Route handlers** — map `TapemarkRequest` → call service → pass view model to component → return `TapemarkResponse`. Minimal logic.
4. **Components** — pure functions from view model to HTML string. No DB access, no side effects.

### Validation

The prototype validates table/column names with a regex + allowlist check scattered across functions. Centralize this:

- A `NameValidator` that loads the schema once and exposes `assertTable(name)`, `assertColumn(table, name)`
- Called at the service layer, not in DB functions
- DB layer trusts its inputs (it's internal) — validation happens at the boundary

### Config resolution

The prototype loads config on every request. Production code should:

- Cache `_tapemark_table_config` contents in memory per cold start
- Invalidate on write (after saving config, clear the cache)
- Merge display type defaults with user overrides (schema-driven defaults, not hardcoded fallbacks)

### Error handling

The prototype silently returns null or empty results on errors. Production code should:

- Define an `TapemarkError` class with `status`, `message`, `detail`
- Route handlers catch and render error pages (not 500s with stack traces)
- DB adapter errors are wrapped with context ("failed to query table X: ...")
- Flash messages show user-facing errors; logs show technical detail

## Phased milestones

### Phase 1: Core extraction

Extract the database layer and core router into a framework-agnostic package.

**Tasks:**

- [ ] Set up monorepo with npm workspaces (`packages/core`, `packages/cli`, `examples/hono-d1`)
- [ ] Define `Database` adapter interface in `core/types.ts`
- [ ] Build `SchemaIntrospector` — clean `Table`, `Column`, `Schema` types from raw PRAGMA/sqlite_master queries
- [ ] Build `TableRepository` — generic CRUD operations returning typed results. Methods: `list`, `getRows`, `getRow`, `insertRow`, `updateRow`, `deleteRow`
- [ ] Build `ConfigStore` — read/write `_tapemark_table_config` with in-memory caching
- [ ] Build `TapemarkMigrator` — auto-create `_tapemark_meta` and `_tapemark_table_config` on first use, track schema version
- [ ] Build core router — `TapemarkRequest`/`TapemarkResponse` types, route matching, handler dispatch
- [ ] Define `DisplayType` interface with JSON Schema for options

**Quality gates:**
- All introspection returns clean types (no raw query results leaking)
- 100% unit test coverage on `SchemaIntrospector` and `TableRepository`
- Test fixtures: at least 3 SQLite databases with different schemas (simple PK, composite PK, no PK, various column types)

### Phase 2: Rendering

Build the JSX-to-string rendering layer and port components from the prototype.

**Tasks:**

- [ ] Choose or build JSX runtime (own minimal vs. vhtml vs. preact-render-to-string — evaluate bundle size, JSX compatibility, and maintenance burden before deciding)
- [ ] Port `TapemarkLayout` — self-contained HTML shell with inlined CSS, no external dependencies
- [ ] Port `DataTable` — receives typed `RowResult` + resolved `DisplayConfig`, renders cells via display type registry
- [ ] Port `RowForm` — receives `Column[]` + optional `RowData`, generates typed inputs
- [ ] Port `Pagination` — receives page info from `RowResult`
- [ ] Port `Flash` — success/error with prefix icons, auto-dismiss
- [ ] Build display type registry — built-in types with JSON Schema, `render()` returns HTML string
- [ ] Build `<display-options>` web component — reads schema, renders config inputs, swaps on type change
- [ ] Inline `admin.js` — serve from a core route (`/_assets/admin.js`) instead of relying on host app's public directory

**Quality gates:**
- Components are pure functions: `(viewModel) => string`
- No framework imports in any component
- Visual test: render each component with fixture data, snapshot the HTML output

### Phase 3: Framework adapters

Build the thin adapter layer for each target framework.

**Tasks:**

- [ ] Build Hono adapter — mount as sub-app, extract DB from `c.env`
- [ ] Build Express adapter — middleware that handles `/admin/*`
- [ ] Build Next.js adapter — catch-all API route or app router handler
- [ ] Build Koa adapter — middleware
- [ ] Each adapter: auth integration helper that wraps the framework's auth mechanism into `authorize: (req) => boolean`

**Quality gates:**
- Each adapter is < 100 lines
- Each has a working example in `examples/`
- Integration test: start server, hit `/admin`, verify HTML response

### Phase 4: DB adapters

**Tasks:**

- [ ] D1 adapter — passthrough (D1 already matches the interface, but wrap for error handling)
- [ ] better-sqlite3 adapter — sync-to-async wrapper
- [ ] libSQL adapter — map client methods to Database interface

**Quality gates:**
- Each adapter tested against the same fixture schema
- better-sqlite3 adapter tested with `SchemaIntrospector` end-to-end

### Phase 5: CLI

**Tasks:**

- [ ] Arg parser (use a lightweight lib like `citty` or `cac`, not a heavy framework)
- [ ] `serve` command — open SQLite files, start HTTP server, mount core with better-sqlite3 adapter
- [ ] Multi-database support — database switcher in admin bar when serving multiple files
- [ ] `inspect` command — schema dump, table list, row counts, schema diff
- [ ] `remote` command — add/list/remove remotes in `_tapemark_meta`
- [ ] `sync` command — pre-flight schema check, batch INSERT OR REPLACE, delete orphans

**Quality gates:**
- `npx tapemark serve test.db` works end-to-end with zero config
- Sync tested: create two fixture databases, sync, verify identical content

### Phase 6: Sync adapters

**Tasks:**

- [ ] `d1` sync — generate SQL, execute via wrangler CLI
- [ ] `file` sync — copy SQLite file
- [ ] `scp` sync — upload via SSH
- [ ] `s3` sync — upload to S3-compatible storage
- [ ] Others as needed

**Quality gates:**
- Each adapter has a mock/integration test
- Dry-run mode produces correct output without side effects

## Testing strategy

### Unit tests

- **SchemaIntrospector**: test with various SQLite schemas (all column types, composite PKs, tables with no PK, FTS tables to ensure they're excluded, views)
- **TableRepository**: CRUD operations on fixture data. Test edge cases: null values, empty strings, unicode, very long text, blob columns
- **ConfigStore**: read/write/cache invalidation
- **NameValidator**: valid names, SQL injection attempts, reserved words
- **Core router**: route matching, query param extraction, body parsing
- **Display types**: each built-in type renders correctly with default and custom options

### Integration tests

- **End-to-end per adapter**: start server → request table list → browse rows → create row → edit row → delete row → bulk delete. Verify HTML responses at each step.
- **Sync**: create source DB with known data → sync to empty target → verify target matches → modify source → sync again → verify incremental changes
- **Migration**: start with empty DB → verify admin tables auto-created → upgrade schema version → verify migration applied

### Fixture databases

Maintain a set of `.db` files in `test/fixtures/`:
- `simple.db` — 2-3 tables, text PKs, basic types
- `complex.db` — composite PKs, all SQLite type affinities, nullable columns, defaults
- `empty.db` — schema but no data
- `large.db` — 10k+ rows for pagination testing (generated, not committed — built by a test setup script)

### Visual testing

No heavy visual regression framework. Instead:
- Snapshot test each component's HTML output with known inputs
- A `dev` script that serves all components in isolation for manual inspection (like a Storybook but simpler — just a single page that renders each component variant)

## Notes for implementers

- The prototype's `db.ts` is the most important file to study — it has the right queries but wrong abstractions. The SQL is correct, the types around it need reworking.
- **CSS lives in a proper `.css` file**, not a JS string. The prototype inlines CSS via `styles.ts` + `raw()` — this was expedient but wrong for a real project. The production code ships a `tapemark.css` file served by the library itself at `GET /_tapemark/styles.css` (same for `admin.js` at `GET /_tapemark/admin.js`). No dependency on the host app's static file setup.
- **No inline styles in JSX.** The prototype has scattered `style="..."` attributes on elements (DataTable image sizing, table-config form inputs, layout tweaks). In the production code, all styling must live in the CSS file. Components should only use CSS classes. If a value is dynamic (e.g., image thumbnail height from config), use a CSS custom property set via a `style` attribute on a container, and reference it in the stylesheet.
- Web components (`<confirm-button>`, `<display-options>`) are the right pattern for client interactivity. They work across all frameworks. Add more as needed but keep them small and focused.
- The `admin_table_config` design (JSON in a TEXT column) is intentionally denormalized. Don't normalize it — the config is always read and written as a whole per table. JSON keeps it simple and schema-flexible.
- The always-dark theme is a deliberate design choice, not a shortcut. The admin panel should look distinct from the host application. The prototype's visual style (dark background, white text, gold accent `#FFD043`, muted borders, compact density) is the reference — implement the same theme until further notice.
- Departure Mono as the primary font gives the panel its identity. It defines the "control panel" aesthetic. If it can't be bundled (licensing), fall back to IBM Plex Mono — but try to bundle it.
- The `admin_table_config` table in the prototype is renamed to `_tapemark_table_config` but the JSON structure and display type system carry over unchanged.
