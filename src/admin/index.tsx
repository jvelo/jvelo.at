import { tapemark } from '@jvelo/tapemark-hono';
import { createD1Adapter } from '@jvelo/tapemark-d1';
import { getSession } from '../auth';
import { getUrlMetadata } from '../lib/url-metadata';
import { generateBlurb } from '../lib/ai-blurb';
import { captureScreenshot } from '../lib/screenshot';
import type { D1Database, R2Bucket } from '../types';

interface Env {
  DB: D1Database;
  SCREENSHOTS: R2Bucket;
  ANTHROPIC_API_KEY?: string;
  OPENGRAPH_API_KEY?: string;
}

async function fetchAndStoreMetadata(
  db: D1Database,
  id: number,
  url: string,
  note: string | null,
  env: Env,
): Promise<void> {
  const metadata = await getUrlMetadata(db, url, { apiKey: env.OPENGRAPH_API_KEY });
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const blurb = await generateBlurb({
      title: metadata.title,
      description: metadata.description,
      note,
      apiKey: env.ANTHROPIC_API_KEY,
    });
    await db
      .prepare("UPDATE sites SET ai_blurb = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(blurb, id)
      .run();
  } catch (err) {
    console.error('Blurb generation failed:', err);
  }
}

export const adminApp = tapemark<Env>({
  db: (c) => createD1Adapter(c.env.DB as unknown as Parameters<typeof createD1Adapter>[0]),
  prefix: '/admin',
  name: 'admin',
  siteUrl: '/',
  siteName: 'jvelo.at',
  theme: 'depart',
  bundleFonts: false,
  authorize: async (c) => {
    const user = await getSession(c);
    if (!user) {
      return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`);
    }
    return user.role === 'admin';
  },
  tables: {
    sites: {
      hooks: {
        afterInsert: async (row, ctx) => {
          const env = ctx.env as Env;
          const id = Number(row.id);
          const url = String(row.url);
          const note = row.note == null ? null : String(row.note);
          await ctx.background(fetchAndStoreMetadata(env.DB, id, url, note, env));
        },
      },
      actions: {
        regenerate_blurb: {
          label: 'regenerate blurb',
          handler: async (pk, ctx) => {
            const env = ctx.env as Env;
            if (!env.ANTHROPIC_API_KEY) {
              return { success: false, message: 'ANTHROPIC_API_KEY not configured' };
            }
            const row = (await env.DB.prepare(
              `SELECT s.note, m.title, m.description
                 FROM sites s LEFT JOIN url_metadata m ON s.url = m.url
                WHERE s.id = ?`,
            )
              .bind(pk.id)
              .first()) as
              | { note: string | null; title: string | null; description: string | null }
              | null;
            if (!row) return { success: false, message: 'site not found' };
            try {
              const blurb = await generateBlurb({
                title: row.title,
                description: row.description,
                note: row.note,
                apiKey: env.ANTHROPIC_API_KEY,
              });
              await env.DB.prepare(
                "UPDATE sites SET ai_blurb = ?, updated_at = datetime('now') WHERE id = ?",
              )
                .bind(blurb, pk.id)
                .run();
              return { success: true, message: 'blurb regenerated' };
            } catch (err) {
              return { success: false, message: (err as Error).message };
            }
          },
        },
      },
    },
    url_metadata: {
      actions: {
        refetch: {
          label: 're-fetch metadata',
          handler: async (pk, ctx) => {
            const env = ctx.env as Env;
            const meta = await getUrlMetadata(env.DB, String(pk.url), {
              force: true,
              apiKey: env.OPENGRAPH_API_KEY,
            });
            return meta.fetch_error
              ? { success: false, message: `re-fetch failed: ${meta.fetch_error}` }
              : { success: true, message: 'metadata refreshed' };
          },
        },
        capture_screenshot_mshots: {
          label: 'mshots (free)',
          group: 'capture screenshot',
          handler: async (pk, ctx) => {
            const env = ctx.env as Env;
            const result = await captureScreenshot(env.DB, env.SCREENSHOTS, String(pk.url), {
              source: 'mshots',
            });
            return result.ok
              ? { success: true, message: `stored at ${result.storedUrl}` }
              : { success: false, message: result.message || 'capture failed' };
          },
        },
        capture_screenshot_opengraph: {
          label: 'opengraph (~10 req)',
          group: 'capture screenshot',
          handler: async (pk, ctx) => {
            const env = ctx.env as Env;
            const result = await captureScreenshot(env.DB, env.SCREENSHOTS, String(pk.url), {
              source: 'opengraph',
              apiKey: env.OPENGRAPH_API_KEY,
            });
            return result.ok
              ? { success: true, message: `stored at ${result.storedUrl}` }
              : { success: false, message: result.message || 'capture failed' };
          },
        },
      },
    },
  },
});

