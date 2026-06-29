import type { D1Database, UrlMetadata } from '../types';

// opengraph.io API: https://opengraph.io/documentation/
// Free tier requires an API key (signup at https://opengraph.io). 100 req/day,
// rate-limited per account (not shared egress IP), so it works correctly from
// Cloudflare Workers' shared outbound pool.

interface OpenGraphFields {
  title?: string;
  description?: string;
  image?: string;
  images?: string[];
  favicon?: string;
  url?: string;
  site_name?: string;
  type?: string;
}

interface OpenGraphResponse {
  hybridGraph?: OpenGraphFields;
  openGraph?: Record<string, unknown>;
  htmlInferred?: OpenGraphFields;
  requestInfo?: { responseCode?: number; redirects?: number; responseLength?: string };
  error?: { message?: string; code?: string | number };
}

interface FetchOptions {
  force?: boolean;
  apiKey?: string;
  timeoutMs?: number;
}

interface FetchResult {
  ok: boolean;
  message?: string;
  data?: OpenGraphResponse;
}

const DEFAULT_TIMEOUT_MS = 15_000;

async function callOpenGraph(
  url: string,
  apiKey: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<FetchResult> {
  const endpoint = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    const body = (await res.json()) as OpenGraphResponse;
    if (!res.ok) {
      return { ok: false, message: body.error?.message || `HTTP ${res.status}` };
    }
    if (body.error?.message) {
      return { ok: false, message: body.error.message };
    }
    return { ok: true, data: body };
  } catch (err) {
    const msg = (err as Error).name === 'AbortError' ? `Timed out after ${timeoutMs}ms` : (err as Error).message;
    return { ok: false, message: msg };
  } finally {
    clearTimeout(timer);
  }
}

export async function getUrlMetadata(
  db: D1Database,
  url: string,
  options: FetchOptions = {},
): Promise<UrlMetadata> {
  if (!options.force) {
    const cached = (await db
      .prepare('SELECT * FROM url_metadata WHERE url = ?')
      .bind(url)
      .first()) as unknown as UrlMetadata | null;
    if (cached && !cached.fetch_error) return cached;
  }

  let result: FetchResult;
  if (!options.apiKey) {
    result = { ok: false, message: 'OPENGRAPH_API_KEY not configured' };
  } else {
    result = await callOpenGraph(url, options.apiKey, options.timeoutMs);
  }

  const hg = result.data?.hybridGraph ?? {};
  const inf = result.data?.htmlInferred ?? {};
  const title = hg.title ?? inf.title ?? null;
  const description = hg.description ?? inf.description ?? null;
  const image = hg.image ?? inf.image ?? inf.images?.[0] ?? null;
  const favicon = hg.favicon ?? inf.favicon ?? null;
  const canonical = hg.url ?? inf.url ?? null;

  // opengraph.io returns 200 OK even when the upstream site served a tiny
  // bot-challenge / JS-required page that yields no real metadata. Demote
  // those to a fetch failure so they don't cache as success and so cleanup
  // tooling can spot them.
  if (result.ok && !title && !description && !image) {
    const length = result.data?.requestInfo?.responseLength;
    result = {
      ok: false,
      message: `No metadata extracted${length ? ` (upstream returned ${length} bytes)` : ''}`,
      data: result.data,
    };
  }

  const fetchedAt = new Date().toISOString();
  const rawResponse = JSON.stringify(result.data ?? { error: result.message });

  // screenshot_url is owned by the capture flow (lib/screenshot.ts); never
  // touch it here. On failure, preserve previously-fetched fields so a
  // transient error doesn't wipe a working row — only the fetch bookkeeping
  // (fetched_at, fetch_error, raw_response) changes.
  if (result.ok) {
    await db
      .prepare(
        `INSERT INTO url_metadata (url, canonical_url, title, description, favicon_url, og_image_url, fetched_at, fetch_error, raw_response)
         VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)
         ON CONFLICT(url) DO UPDATE SET
           canonical_url = excluded.canonical_url,
           title = excluded.title,
           description = excluded.description,
           favicon_url = excluded.favicon_url,
           og_image_url = excluded.og_image_url,
           fetched_at = excluded.fetched_at,
           fetch_error = NULL,
           raw_response = excluded.raw_response`,
      )
      .bind(url, canonical, title, description, favicon, image, fetchedAt, rawResponse)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO url_metadata (url, fetched_at, fetch_error, raw_response)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(url) DO UPDATE SET
           fetched_at = excluded.fetched_at,
           fetch_error = excluded.fetch_error,
           raw_response = excluded.raw_response`,
      )
      .bind(url, fetchedAt, result.message || 'unknown error', rawResponse)
      .run();
  }

  // Re-read so the return reflects what was persisted: on failure this carries
  // the preserved existing fields rather than the nulls of the failed fetch.
  const row = (await db
    .prepare('SELECT * FROM url_metadata WHERE url = ?')
    .bind(url)
    .first()) as unknown as UrlMetadata | null;
  if (row) return row;

  return {
    url,
    canonical_url: result.ok ? canonical : null,
    title: result.ok ? title : null,
    description: result.ok ? description : null,
    favicon_url: result.ok ? favicon : null,
    og_image_url: result.ok ? image : null,
    screenshot_url: null,
    fetched_at: fetchedAt,
    fetch_error: result.ok ? null : (result.message || 'unknown error'),
    raw_response: rawResponse,
  };
}
