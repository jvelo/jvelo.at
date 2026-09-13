---
title: Tapemark
type: work
subtitle: Open source SQLite browser and admin panel.
description: A self-contained admin panel for SQLite databases. Point it at a database file and browse, edit, and follow relations. Embeds in Hono applications on Node or Cloudflare Workers with D1.
image: /images/tapemark.png
technologies:
  - TypeScript
  - SQLite
  - Preact
  - Hono
  - Cloudflare D1
years: 2026–present
license: MPL 2.0
source: https://github.com/jvelo/tapemark
---

## Motivation

I initially built Tapemark as the back office for the 
Cloudflare [D1](https://www.cloudflare.com/products/d1/) database behind this very website. I 
later extracted it into a reusable open-source package because the same need comes up in many 
small applications.

Database browsers like Datasette make a database easy to 
browse and query. At the other end, frameworks like React Admin let you build a complete SPA, 
with resources to describe and an API to provide.

Tapemark sits in between: it reads the schema 
of a SQLite-compatible database and produces an admin interface that can run on its own or 
inside an existing application.

## What it does

Tapemark is available both as a CLI and as a library that can be mounted inside an application. 
Nothing needs configuring before the first run. Point the CLI at a .db file and you get tables, 
rows, forms, and relations. Mount the library inside an application and it becomes that 
application’s admin panel, behind its existing authentication.

The interface provides paginated browsing across tables and views, forms for creating and 
editing rows, and bulk deletion. Everything is derived from the schema, so a new column shows up 
on its own.

Foreign keys get real treatment. A reference cell links to the related row and shows a readable 
label instead of an ID, chosen from the target table by a heuristic or an explicitly configured 
column. In forms, references become typeahead fields.

Cell display types cover the usual needs: text, image with hover preview, link, JSON,
datetime, color swatch, enum badge, reference, Markdown, and UUID. Each one has an options form,
and applications can register their own.

<figure>
<img src="/images/tapemark-config.png" alt="Tapemark display config page for a table, with a display type and options per column" />
<figcaption>Schema-derived columns with configurable display types, labels, and visibility.</figcaption>
</figure>

When an admin panel needs to do more than edit rows, Tapemark provides **hooks and actions**. Hooks 
run after inserts, updates, or deletes, with access to the database and a fire-and-
forget helper for background work. Actions add buttons to rows or lists. Each action controls 
when it appears and which database changes it can make. Finally, per-table read-only and hidden
flags, together with a global read-only mode, keep the dangerous parts out of reach.

Three themes ship with their fonts bundled, so an admin panel looks finished on day one.

<figure>
<img src="/images/tapemark-themes.png" alt="The same Tapemark row form in the Depart and Hubot themes" />
<figcaption>The same row form in the Depart and Hubot themes. The third theme, Plex, is the one on the config page above</figcaption>
</figure>

## Architecture

Tapemark is server-rendered. Pages are written in JSX and rendered to HTML on the server with Preact.
Browser-side JavaScript is limited to a handful of small web components for confirmations, image
previews, and typeahead fields. There is no client router or hydration, and no frontend
application bundle. This lets Tapemark embed into an application without bringing its own
frontend build or runtime assumptions.

The core does not depend on a server framework. It takes a request as plain data and returns a
status, headers, and HTML. Small adapters connect it to web runtimes and database drivers:

- `@jvelo/tapemark` is the core: schema introspection, routing, rendering, display types,
  hooks and actions.
- `@jvelo/tapemark-hono` mounts it as a Hono sub-application, on Workers, Node, or Bun.
- `@jvelo/tapemark-d1` and `@jvelo/tapemark-better-sqlite3` are the database adapters, behind
  a four-method interface.
- `@jvelo/tapemark-cli` serves one or several database files from the command line.

Wiring it into a Hono application on Cloudflare takes a few lines:

```typescript
app.route("/admin", tapemark({
  db: (c) => createD1Adapter(c.env.DB),
  prefix: "/admin",
  authorize: async (c) => isAdmin(c),
}));
```

## In production

Tapemark runs the admin of this website: the curated sites list, the starred media collection,
and their metadata all live in Cloudflare D1 and are managed through it.
