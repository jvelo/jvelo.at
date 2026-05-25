import type { D1Database, UrlMetadata } from '../types';

// opengraph.io API: https://opengraph.io/documentation/
// Free tier requires an API key (signup at https://opengraph.io). 100 req/day,
// rate-limited per account (not shared egress IP), so it works correctly from
// Cloudflare Workers' shared outbound pool.

interface OpenGraphHybridGraph {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  url?: string;
  site_name?: string;
  type?: string;
}

interface OpenGraphResponse {
  hybridGraph?: OpenGraphHybridGraph;
  openGraph?: Record<string, unknown>;
  htmlInferred?: Record<string, unknown>;
  requestInfo?: { responseCode?: number; redirects?: number };
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
  const metadata: UrlMetadata = {
    url,
    canonical_url: result.ok ? (hg.url ?? null) : null,
    title: result.ok ? (hg.title ?? null) : null,
    description: result.ok ? (hg.description ?? null) : null,
    favicon_url: result.ok ? (hg.favicon ?? null) : null,
    og_image_url: result.ok ? (hg.image ?? null) : null,
    // opengraph.io has a separate /screenshot endpoint that counts against
    // the same daily quota; we leave screenshot_url null and let the
    // page-level mshots fallback handle missing visuals.
    screenshot_url: null,
    fetched_at: new Date().toISOString(),
    fetch_error: result.ok ? null : (result.message || 'unknown error'),
    raw_response: JSON.stringify(result.data ?? { error: result.message }),
  };

  await db
    .prepare(
      `INSERT INTO url_metadata (url, canonical_url, title, description, favicon_url, og_image_url, screenshot_url, fetched_at, fetch_error, raw_response)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(url) DO UPDATE SET
         canonical_url = excluded.canonical_url,
         title = excluded.title,
         description = excluded.description,
         favicon_url = excluded.favicon_url,
         og_image_url = excluded.og_image_url,
         screenshot_url = excluded.screenshot_url,
         fetched_at = excluded.fetched_at,
         fetch_error = excluded.fetch_error,
         raw_response = excluded.raw_response`,
    )
    .bind(
      metadata.url,
      metadata.canonical_url,
      metadata.title,
      metadata.description,
      metadata.favicon_url,
      metadata.og_image_url,
      metadata.screenshot_url,
      metadata.fetched_at,
      metadata.fetch_error,
      metadata.raw_response,
    )
    .run();

  return metadata;
}
