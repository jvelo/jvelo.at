import type { Context, Hono } from 'hono';
import type { Child } from 'hono/jsx';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { Layout, PageTitle } from './components/Layout';
import { WorkPage } from './components/WorkPage';
import { SelectedWorks } from './components/SelectedWorks';
import { Expertise } from './components/Expertise';
import { ReachOut } from './components/ReachOut';
import { Hero } from './components/Hero';
import { Sink } from './components/KitchenSink';
import { AtlasPage } from './components/AtlasPage';
import { verifyTurnstile, sendContactEmail } from './lib/contact';
import {
  generateCode, signToken, verifyToken, signRedirect, verifyRedirect,
  isRegistered, getUserRole, storeCode, verifyCode, cleanupExpiredCodes,
  setSession, clearSession, getSession, sendSigninEmail,
  requireAuth, AuthContext,
} from './auth';
import type { AppEnv, PageProvider, SiteWithMetadata } from './types';

export { requireAuth };

type AppContext = Context<AppEnv>;

function getTurnstileKey(c: AppContext): string {
  // env is absent under the Node dev server
  return c.env?.TURNSTILE_SITE_KEY || '';
}

function render(c: AppContext, jsx: Child, status?: ContentfulStatusCode) {
  const user = c.get('user') || null;
  return c.html(<AuthContext value={user}>{jsx}</AuthContext>, status);
}

function loginError(c: AppContext, message: string, redirect?: string) {
  const query = redirect ? `redirect=${encodeURIComponent(redirect)}&` : '';
  return c.redirect(`/login?${query}error=${encodeURIComponent(message)}`);
}

const CODE_EXPIRED_ERROR = 'Code or link has expired. Please request a new one.';
const CODE_INVALID_ERROR = 'Invalid or expired code. Please try again.';

interface StarredMediaRow {
  id: string;
  media_url: string;
  media_width: number;
  media_height: number;
}

const STARRED_MEDIA_PAGE_SIZE = 25;
// Deterministic per-seed shuffle: the numeric tail of each id times the seed,
// modulo a large prime, gives a stable random order that survives pagination.
const STARRED_MEDIA_QUERY = `SELECT id, media_url, media_width, media_height FROM starred_media
   ORDER BY (CAST(substr(id, -8) AS INTEGER) * ?) % 2147483647 LIMIT ${STARRED_MEDIA_PAGE_SIZE} OFFSET ?`;

export function setupRoutes(app: Hono<AppEnv>, provider: PageProvider) {
  // Read session on all requests (non-blocking)
  app.use('*', async (c, next) => {
    const user = await getSession(c);
    if (user) c.set('user', user);
    return next();
  });

  app.get('/', async (c) => {
    const page = provider.getHome();
    return render(c,
      <Layout title={page.title} description={page.description} path="/" turnstileSiteKey={getTurnstileKey(c)}>
        <Hero />
        <SelectedWorks />
        <Expertise />
        <ReachOut />
      </Layout>
    );
  });

  app.get('/resume', (c) => c.redirect('/Jerome_Velociter_Tech_Product_Lead_2026.pdf'));

  app.get('/kitchen-sink', async (c) => {
    return render(c,
      <Layout title="Kitchen Sink" turnstileSiteKey={getTurnstileKey(c)}>
        <Sink />
      </Layout>
    );
  });

  app.post('/contact', async (c) => {
    const body = await c.req.json<{ name: string; email: string; message: string; token: string }>();
    const { name, email, message, token } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return c.json({ error: 'All fields are required.' }, 400);
    }

    const env = c.env;
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      return c.json({ error: 'Server configuration error.' }, 500);
    }

    const valid = await verifyTurnstile(token, turnstileSecret);
    if (!valid) {
      return c.json({ error: 'Verification failed. Please try again.' }, 403);
    }

    const sent = await sendContactEmail(name.trim(), email.trim(), message.trim(), {
      scwSecretKey: env.SCW_TEM_SECRET_KEY,
      scwProjectId: env.SCW_PROJECT_ID,
      toEmail: env.CONTACT_TO_EMAIL,
      fromEmail: env.CONTACT_FROM_EMAIL,
    });
    if (!sent) {
      return c.json({ error: 'Failed to send message. Please try again later.' }, 500);
    }

    return c.json({ ok: true });
  });

  // -- Starred media --

  app.get('/api/starred-media', requireAuth('member'), async (c) => {
    const seed = parseInt(c.req.query('seed') || '0', 10) || 1;
    const offset = parseInt(c.req.query('offset') || '0', 10) || 0;
    const { results } = await c.env.DB.prepare(STARRED_MEDIA_QUERY).bind(seed, offset).all();
    return c.json({ items: results, hasMore: results.length === STARRED_MEDIA_PAGE_SIZE });
  });

  app.get('/starred-media', requireAuth('member'), async (c) => {
    const seed = Math.floor(Math.random() * 2147483646) + 1;
    const { results } = await c.env.DB.prepare(STARRED_MEDIA_QUERY).bind(seed, 0).all();
    const items = results as unknown as StarredMediaRow[];

    return render(c,
      <Layout title="Starred media" turnstileSiteKey={getTurnstileKey(c)}>
        <div class="starred-media-page">
          <h1 class="page-title">starred media</h1>
          <div class="masonry" id="masonry-grid" data-cols="3">
            {[0, 1, 2].map((colIdx) => (
              <div class="masonry-col">
                {items.filter((_, i) => i % 3 === colIdx).map((item) => (
                  <div class="masonry-item">
                    <img
                      src={item.media_url}
                      width={item.media_width}
                      height={item.media_height}
                      style={`aspect-ratio: ${item.media_width} / ${item.media_height};`}
                      loading="lazy"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button id="load-more" class="load-more" data-seed={String(seed)} data-offset={String(STARRED_MEDIA_PAGE_SIZE)}>
            Load more
          </button>
        </div>
        <script src="/starred-media.js" defer></script>
      </Layout>
    );
  });

  // -- Auth routes --

  app.get('/login', async (c) => {
    const redirect = c.req.query('redirect') || '/';
    const error = c.req.query('error') || '';

    return render(c,
      <Layout title="Sign in" turnstileSiteKey={getTurnstileKey(c)}>
        <div class="auth-page">
          <h1 class="page-title">Sign in</h1>
          {error && <p class="auth-error">{error}</p>}
          <form method="post" action="/login" class="auth-form">
            <input type="hidden" name="redirect" value={redirect} />
            <label for="email" class="auth-label">Email address</label>
            <input type="email" id="email" name="email" required class="auth-input" placeholder="you@example.com" autocomplete="email" />
            <button type="submit" class="auth-button">Send sign-in code</button>
          </form>
        </div>
      </Layout>
    );
  });

  app.post('/login', async (c) => {
    const body = await c.req.parseBody();
    const email = (body.email as string || '').trim().toLowerCase();
    const redirect = (body.redirect as string) || '/';

    if (!email || !/^[\w.+\-]+@[\w.-]+\.\w+$/.test(email)) {
      return loginError(c, 'Please enter a valid email address.', redirect);
    }

    const env = c.env;
    const db = env.DB;
    const secret = env.JWT_SECRET;

    await cleanupExpiredCodes(db);

    // Always show verify page (silent success for unregistered emails)
    const registered = await isRegistered(db, email);
    if (registered) {
      const code = generateCode();
      await storeCode(db, email, code);

      const token = await signToken(code, redirect, secret);
      const origin = new URL(c.req.url).origin;
      const magicLinkUrl = `${origin}/auth/verify?token=${token}`;

      await sendSigninEmail(email, code, magicLinkUrl, {
        scwSecretKey: env.SCW_TEM_SECRET_KEY,
        scwProjectId: env.SCW_PROJECT_ID,
        fromEmail: env.CONTACT_FROM_EMAIL,
      });
    }

    // Sign redirect so the code-entry form can't be tampered with
    const redirectSig = await signRedirect(redirect, secret);

    return render(c,
      <Layout title="Enter your code" turnstileSiteKey={getTurnstileKey(c)}>
        <div class="auth-page">
          <h1 class="page-title">Check your email</h1>
          <p class="auth-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>
          <form method="post" action="/auth/verify" class="auth-form" id="code-form">
            <input type="hidden" name="redirect" value={redirect} />
            <input type="hidden" name="redirect_sig" value={redirectSig} />
            <div class="code-inputs" id="code-inputs">
              <input type="text" maxLength={1} class="code-digit" data-index="0" autocomplete="one-time-code" inputMode="text" />
              <input type="text" maxLength={1} class="code-digit" data-index="1" inputMode="text" />
              <input type="text" maxLength={1} class="code-digit" data-index="2" inputMode="text" />
              <span class="code-separator">-</span>
              <input type="text" maxLength={1} class="code-digit" data-index="3" inputMode="text" />
              <input type="text" maxLength={1} class="code-digit" data-index="4" inputMode="text" />
              <input type="text" maxLength={1} class="code-digit" data-index="5" inputMode="text" />
            </div>
            <input type="hidden" name="code" id="code-hidden" />
            <button type="submit" class="auth-button">Verify</button>
          </form>
          <p class="auth-hint">Or click the link in the email.</p>
        </div>
        <script src="/auth.js" defer></script>
      </Layout>
    );
  });

  app.get('/auth/verify', async (c) => {
    const tokenParam = c.req.query('token') || '';
    const db = c.env.DB;

    // Redirect is inside the signed token — no separate HMAC needed
    const result = await verifyToken(tokenParam, c.env.JWT_SECRET);
    if (!result) {
      return loginError(c, CODE_EXPIRED_ERROR);
    }

    const email = await verifyCode(db, result.code);
    if (!email) {
      return loginError(c, CODE_EXPIRED_ERROR);
    }

    const role = await getUserRole(db, email);
    if (!role) {
      return loginError(c, CODE_INVALID_ERROR);
    }

    await setSession(c, { email, role });
    return c.redirect(result.redirect);
  });

  app.post('/auth/verify', async (c) => {
    const body = await c.req.parseBody();
    const code = (body.code as string || '').trim().toUpperCase();
    const redirect = (body.redirect as string) || '/';
    const redirectSig = (body.redirect_sig as string) || '';
    const db = c.env.DB;

    // Verify redirect HMAC to prevent open redirect
    const validRedirect = await verifyRedirect(redirect, redirectSig, c.env.JWT_SECRET);
    if (!validRedirect) {
      return loginError(c, 'Invalid request.');
    }

    if (!code || !/^[A-Z0-9]{6}$/.test(code)) {
      return loginError(c, 'Please enter a valid 6-character code.', redirect);
    }

    const email = await verifyCode(db, code);
    if (!email) {
      return loginError(c, CODE_INVALID_ERROR, redirect);
    }

    const role = await getUserRole(db, email);
    if (!role) {
      return loginError(c, CODE_INVALID_ERROR, redirect);
    }

    await setSession(c, { email, role });
    return c.redirect(redirect);
  });

  app.get('/logout', async (c) => {
    clearSession(c);
    return c.redirect('/');
  });

  // -- Atlas (curated sites; managed via Tapemark admin at /admin/sites) --

  app.get('/atlas', requireAuth('member'), async (c) => {
    const { results } = await c.env.DB.prepare(
      `SELECT id, url, note, ai_blurb, display_order, created_at, updated_at,
              title, description, favicon_url, og_image_url, screenshot_url, fetch_error,
              prefer_screenshot, image_source
         FROM sites_with_metadata
         ORDER BY display_order DESC, created_at DESC`
    ).all();

    return render(c,
      <AtlasPage entries={results as unknown as SiteWithMetadata[]} turnstileSiteKey={getTurnstileKey(c)} />
    );
  });

  // R2-backed screenshot proxy. Captures populate keys like
  // <source>/<host>/<slug>.png; see src/lib/screenshot.ts. R2 keys are
  // deterministic per (url, source), so re-captures overwrite the same key —
  // we rely on ETag revalidation (not immutable caching) to surface updates.
  app.get('/screenshots/*', async (c) => {
    const key = c.req.path.replace(/^\/screenshots\//, '');
    if (!key || key.includes('..')) return c.notFound();
    const r2 = c.env.SCREENSHOTS;
    if (!r2) return c.notFound();

    const cacheControl = 'public, max-age=300, must-revalidate';

    const ifNoneMatch = c.req.header('if-none-match');
    if (ifNoneMatch) {
      const head = await r2.head(key);
      if (head && head.httpEtag === ifNoneMatch) {
        return new Response(null, {
          status: 304,
          headers: { etag: head.httpEtag, 'cache-control': cacheControl },
        });
      }
    }

    const obj = await r2.get(key);
    if (!obj) return c.notFound();
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('etag', obj.httpEtag);
    headers.set('cache-control', cacheControl);
    return new Response(obj.body, { headers });
  });

  // -- Content pages (catch-all, must be last) --

  app.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const page = provider.getPage(slug);
    const tsKey = getTurnstileKey(c);

    if (!page) {
      return render(c,
        <Layout title="Page Not Found" turnstileSiteKey={tsKey}>
          <PageTitle title="404 - Page Not Found" subtitle="The page you're looking for doesn't exist." />
          <div class="content">
            <p><a href="/">Return to home</a></p>
          </div>
        </Layout>,
        404
      );
    }

    if (page.type === 'work') {
      return render(c, <WorkPage page={page} turnstileSiteKey={tsKey} />);
    }

    return render(c,
      <Layout title={page.title} description={page.subtitle} path={`/${slug}`} turnstileSiteKey={tsKey}>
        <PageTitle title={page.title} subtitle={page.subtitle} />
        <div class="content" dangerouslySetInnerHTML={{ __html: page.html }}></div>
      </Layout>
    );
  });
}
