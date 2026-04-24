import type { D1Database, UrlMetadata } from '../types';

interface MicrolinkResponse {
  status: string;
  message?: string;
  data?: {
    url?: string;
    title?: string;
    description?: string;
    image?: { url?: string };
    logo?: { url?: string };
    screenshot?: { url?: string };
  };
}

interface FetchOptions {
  force?: boolean;
  apiKey?: string;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

async function callMicrolink(url: string, apiKey?: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<MicrolinkResponse> {
  const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true`;
  const headers: Record<string, string> = {};
  if (apiKey) headers['x-api-key'] = apiKey;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, { headers, signal: controller.signal });
    const body = (await res.json()) as MicrolinkResponse;
    if (!res.ok && body.status !== 'fail') {
      return { status: 'error', message: `HTTP ${res.status}: ${body.message || 'upstream error'}` };
    }
    return body;
  } catch (err) {
    const msg = (err as Error).name === 'AbortError' ? `Timed out after ${timeoutMs}ms` : (err as Error).message;
    return { status: 'error', message: msg };
  } finally {
    clearTimeout(timer);
  }
}

export async function getUrlMetadata(db: D1Database, url: string, options: FetchOptions = {}): Promise<UrlMetadata> {
  if (!options.force) {
    const cached = (await db.prepare('SELECT * FROM url_metadata WHERE url = ?').bind(url).first()) as unknown as UrlMetadata | null;
    if (cached && !cached.fetch_error) return cached;
  }

  const response = await callMicrolink(url, options.apiKey, options.timeoutMs);
  const ok = response.status === 'success';
  const data = response.data || {};
  const metadata: UrlMetadata = {
    url,
    canonical_url: ok ? (data.url ?? null) : null,
    title: ok ? (data.title ?? null) : null,
    description: ok ? (data.description ?? null) : null,
    favicon_url: ok ? (data.logo?.url ?? null) : null,
    og_image_url: ok ? (data.image?.url ?? null) : null,
    screenshot_url: ok ? (data.screenshot?.url ?? null) : null,
    fetched_at: new Date().toISOString(),
    fetch_error: ok ? null : (response.message || `microlink status=${response.status}`),
    raw_response: JSON.stringify(response),
  };

  await db.prepare(
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
       raw_response = excluded.raw_response`
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
