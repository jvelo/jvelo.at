import type { D1Database, R2Bucket } from '../types';

export type ScreenshotSource = 'mshots' | 'opengraph';

interface CaptureOptions {
  source: ScreenshotSource;
  apiKey?: string;
  timeoutMs?: number;
}

interface CaptureResult {
  ok: boolean;
  message?: string;
  storedUrl?: string;
}

const DEFAULT_TIMEOUT_MS = 30_000;

// mshots returns a tiny placeholder PNG (~2-4KB) on first request while it
// renders the real screenshot in the background. We use this threshold to
// detect the placeholder and surface it to the caller — the user can
// re-trigger the capture in a minute to get the real shot.
const MSHOTS_PLACEHOLDER_MAX_BYTES = 6_000;

function mshotsEndpoint(url: string): string {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=750`;
}

function opengraphScreenshotEndpoint(url: string, apiKey: string): string {
  return `https://opengraph.io/api/1.1/screenshot/${encodeURIComponent(url)}?app_id=${encodeURIComponent(apiKey)}&dimensions=lg`;
}

function parseScreenshotResponse(bytes: ArrayBuffer): { screenshotUrl?: string; error?: { message?: string } } | null {
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

async function fetchBytes(url: string, timeoutMs: number): Promise<{ bytes: ArrayBuffer; contentType: string } | { error: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const contentType = res.headers.get('content-type') || 'image/png';
    const bytes = await res.arrayBuffer();
    return { bytes, contentType };
  } catch (err) {
    const msg = (err as Error).name === 'AbortError' ? `Timed out after ${timeoutMs}ms` : (err as Error).message;
    return { error: msg };
  } finally {
    clearTimeout(timer);
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function r2Key(siteUrl: string, source: ScreenshotSource): string {
  // Deterministic per-(url, source) — re-captures overwrite, no garbage to GC.
  const slug = siteUrl.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 80);
  return `${source}/${hostOf(siteUrl)}/${slug}.png`;
}

export async function captureScreenshot(
  db: D1Database,
  r2: R2Bucket,
  siteUrl: string,
  options: CaptureOptions,
): Promise<CaptureResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let sourceUrl: string;
  if (options.source === 'opengraph') {
    if (!options.apiKey) return { ok: false, message: 'OPENGRAPH_API_KEY not configured' };
    // opengraph's screenshot endpoint returns JSON with a screenshotUrl field,
    // then we fetch that to get the actual bytes.
    const apiResp = await fetchBytes(opengraphScreenshotEndpoint(siteUrl, options.apiKey), timeoutMs);
    if ('error' in apiResp) return { ok: false, message: `opengraph: ${apiResp.error}` };
    const json = parseScreenshotResponse(apiResp.bytes);
    if (!json?.screenshotUrl) {
      return { ok: false, message: json?.error?.message || 'opengraph: no screenshotUrl in response' };
    }
    sourceUrl = json.screenshotUrl;
  } else {
    sourceUrl = mshotsEndpoint(siteUrl);
  }

  const fetched = await fetchBytes(sourceUrl, timeoutMs);
  if ('error' in fetched) return { ok: false, message: `fetch: ${fetched.error}` };

  if (options.source === 'mshots' && fetched.bytes.byteLength < MSHOTS_PLACEHOLDER_MAX_BYTES) {
    return {
      ok: false,
      message: `mshots returned placeholder (${fetched.bytes.byteLength} bytes); retry in ~30s`,
    };
  }

  const key = r2Key(siteUrl, options.source);
  await r2.put(key, fetched.bytes, { httpMetadata: { contentType: fetched.contentType } });

  // Worker-served path; the /screenshots/:key route reads R2 and returns bytes.
  const storedUrl = `/screenshots/${key}`;

  await db
    .prepare(
      `INSERT INTO url_metadata (url, fetched_at, screenshot_url)
       VALUES (?, ?, ?)
       ON CONFLICT(url) DO UPDATE SET
         screenshot_url = excluded.screenshot_url`,
    )
    .bind(siteUrl, new Date().toISOString(), storedUrl)
    .run();

  return { ok: true, storedUrl };
}
