import type { Hono } from 'hono';
import type { FC } from 'hono/jsx';
import { Layout, PageTitle } from './components/Layout';
import { SelectedWorks } from './components/SelectedWorks';
import { Expertise } from './components/Expertise';
import { ReachOut } from './components/ReachOut';
import { Sink } from './components/KitchenSink';
import {
  generateCode, formatCode, signToken, verifyToken,
  isRegistered, getUserRole, storeCode, verifyCode, cleanupExpiredCodes,
  setSession, clearSession, getSession, sendSigninEmail,
  requireAuth,
} from './auth';

export { requireAuth };

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all(): Promise<{ results: Record<string, unknown>[] }>;
  first(): Promise<Record<string, unknown> | null>;
  run(): Promise<void>;
}

interface PageData {
  slug: string;
  type?: 'page' | 'work';
  title: string;
  subtitle?: string;
  description?: string;
  hero_title?: string;
  image?: string;
  badge?: string;
  technologies?: string[];
  years?: string;
  license?: string;
  source?: string;
  content: string;
  html: string;
}

interface TocEntry {
  id: string;
  text: string;
}

function extractToc(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    entries.push({ id: match[1], text: match[2].replace(/<[^>]*>/g, '') });
  }
  return entries;
}

function addHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    return `<h2${attrs} id="${id}">${content}</h2>`;
  });
}

const ProjectMeta: FC<{ technologies?: string[]; years?: string; license?: string; source?: string }> = ({ technologies, years, license, source }) => {
  if (!technologies?.length && !years && !license && !source) return null;
  return (
    <>
      {technologies && technologies.length > 0 && (
        <section class="aside-section">
          <h2 class="aside-heading">Technologies</h2>
          <ul class="aside-tags">
            {technologies.map((tech) => (
              <li>{tech}</li>
            ))}
          </ul>
        </section>
      )}
      {years && (
        <section class="aside-section">
          <h2 class="aside-heading">Years active</h2>
          <p class="aside-meta">{years}</p>
        </section>
      )}
      {license && (
        <section class="aside-section">
          <h2 class="aside-heading">License</h2>
          <p class="aside-meta">{license}</p>
        </section>
      )}
      {source && (
        <section class="aside-section">
          <h2 class="aside-heading">Source</h2>
          <p class="aside-meta"><a href={source} class="aside-link">GitHub</a></p>
        </section>
      )}
    </>
  );
};

const WorkPage: FC<{ page: PageData; turnstileSiteKey?: string }> = ({ page, turnstileSiteKey }) => {
  const html = addHeadingIds(page.html);
  const toc = extractToc(html);
  const hasMeta = !!(page.technologies?.length || page.years || page.license || page.source);

  return (
    <Layout title={page.title} description={page.description} turnstileSiteKey={turnstileSiteKey} bodyClass="page-work">
      <article class="project">
        <nav class="breadcrumb">
          <a href="/">selected works</a>
          <span class="breadcrumb-sep">&gt;</span>
          <span>{page.slug}</span>
        </nav>
        <h1 class="project-name">{page.title}</h1>
        {page.subtitle && <p class="project-tagline">{page.subtitle}</p>}
        <div class="content-with-aside">
          <div class="content-primary prose">
            {page.image && (
              <div class="hero-cover border-backdrop">
                <img src={page.image} alt={page.title} />
              </div>
            )}
            {hasMeta && (
              <div class="project-meta-mobile">
                <ProjectMeta technologies={page.technologies} years={page.years} license={page.license} source={page.source} />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
            <section class="work-cta">
              <p class="work-cta-text">Working on an ambitious product?</p>
              <a href="#contact" class="work-cta-link" onclick="event.preventDefault(); document.querySelector('contact-form').open();">Let's talk →</a>
            </section>
          </div>
          <aside class="content-aside">
            {toc.length > 0 && (
              <section class="toc">
                <h2 class="aside-heading">Contents</h2>
                <nav>
                  {toc.map((entry) => (
                    <a href={`#${entry.id}`} class="toc-link">{entry.text}</a>
                  ))}
                </nav>
              </section>
            )}
            {hasMeta && <hr class="aside-divider" />}
            <ProjectMeta technologies={page.technologies} years={page.years} license={page.license} source={page.source} />
          </aside>
        </div>
      </article>
    </Layout>
  );
};

interface PageProvider {
  getHome: () => PageData;
  getPage: (slug: string) => PageData | null;
}

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

interface EmailConfig {
  scwSecretKey: string;
  scwProjectId: string;
  toEmail: string;
  fromEmail: string;
}

async function sendEmail(name: string, email: string, message: string, config: EmailConfig): Promise<boolean> {
  const res = await fetch('https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': config.scwSecretKey,
    },
    body: JSON.stringify({
      from: { email: config.fromEmail, name: `${name} (via jvelo.at)` },
      to: [{ email: config.toEmail }],
      subject: `Contact from ${name}`,
      text: message,
      project_id: config.scwProjectId,
      additional_headers: [
        { key: 'Reply-To', value: `${name} <${email}>` },
      ],
    }),
  });

  if (!res.ok) {
    console.error('Scaleway email error:', res.status, await res.text());
  }
  return res.ok;
}

function getTurnstileKey(c: { env: unknown }): string {
  return ((c.env as Record<string, string>)?.TURNSTILE_SITE_KEY) || '';
}

export function setupRoutes(app: Hono, provider: PageProvider) {
  app.get('/', async (c) => {
    const page = provider.getHome();
    const tsKey = getTurnstileKey(c);

    return c.html(
      <Layout title={page.title} description={page.description} turnstileSiteKey={tsKey}>
        <SelectedWorks />
        <Expertise />
        <ReachOut />
      </Layout>
    );
  });

  app.get('/kitchen-sink', async (c) => {
    const tsKey = getTurnstileKey(c);
    return c.html(
      <Layout title="Kitchen Sink" turnstileSiteKey={tsKey}>
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

    const env = c.env as Record<string, string>;
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      return c.json({ error: 'Server configuration error.' }, 500);
    }

    const valid = await verifyTurnstile(token, turnstileSecret);
    if (!valid) {
      return c.json({ error: 'Verification failed. Please try again.' }, 403);
    }

    const sent = await sendEmail(name.trim(), email.trim(), message.trim(), {
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

  app.get('/api/starred-media', requireAuth('member'), async (c) => {
    const db = (c.env as Record<string, unknown>).DB as D1Database;
    const seed = parseInt(c.req.query('seed') || '0', 10) || 1;
    const offset = parseInt(c.req.query('offset') || '0', 10) || 0;
    const { results } = await db.prepare(
      'SELECT id, media_url, media_width, media_height FROM starred_media ORDER BY (CAST(substr(id, -8) AS INTEGER) * ?) % 2147483647 LIMIT 25 OFFSET ?'
    ).bind(seed, offset).all();
    return c.json({ items: results, hasMore: results.length === 25 });
  });

  app.get('/starred-media', requireAuth('member'), async (c) => {
    const db = (c.env as Record<string, unknown>).DB as D1Database;
    const seed = Math.floor(Math.random() * 2147483646) + 1;
    const { results } = await db.prepare(
      'SELECT id, media_url, media_width, media_height FROM starred_media ORDER BY (CAST(substr(id, -8) AS INTEGER) * ?) % 2147483647 LIMIT 25'
    ).bind(seed).all();
    const tsKey = getTurnstileKey(c);

    return c.html(
      <Layout title="Starred media" turnstileSiteKey={tsKey} sidebar={false}>
        <div class="starred-media-page">
          <h1 class="page-title">starred media</h1>
          <div class="masonry" id="masonry-grid">
            {results.map((item: any) => (
              <div class="masonry-item">
                <img
                  src={item.media_url}
                  width={item.media_width}
                  height={item.media_height}
                  loading="lazy"
                  alt=""
                />
              </div>
            ))}
          </div>
          <button id="load-more" class="load-more" data-seed={String(seed)} data-offset="25">
            Load more
          </button>
        </div>
        <script src="/starred-media.js" defer></script>
      </Layout>
    );
  });

  // -- Auth routes --

  app.get('/login', async (c) => {
    const tsKey = getTurnstileKey(c);
    const redirect = c.req.query('redirect') || '/';
    const error = c.req.query('error') || '';

    return c.html(
      <Layout title="Sign in" turnstileSiteKey={tsKey} sidebar={false}>
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
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Please enter a valid email address.')}`);
    }

    const db = (c.env as Record<string, unknown>).DB as D1Database;
    const env = c.env as Record<string, string>;

    // Cleanup expired codes opportunistically
    await cleanupExpiredCodes(db);

    // Always redirect to verify page (silent success for unregistered emails)
    const registered = await isRegistered(db, email);
    if (registered) {
      const code = generateCode();
      await storeCode(db, email, code);

      const secret = env.JWT_SECRET || '';
      const token = await signToken(code, secret);
      const origin = new URL(c.req.url).origin;
      const magicLinkUrl = `${origin}/auth/verify?token=${token}&redirect=${encodeURIComponent(redirect)}`;

      await sendSigninEmail(email, code, magicLinkUrl, {
        scwSecretKey: env.SCW_TEM_SECRET_KEY,
        scwProjectId: env.SCW_PROJECT_ID,
        fromEmail: env.CONTACT_FROM_EMAIL,
      });
    }

    return c.html(
      <Layout title="Enter your code" turnstileSiteKey={getTurnstileKey(c)} sidebar={false}>
        <div class="auth-page">
          <h1 class="page-title">Check your email</h1>
          <p class="auth-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>
          <form method="post" action="/auth/verify" class="auth-form" id="code-form">
            <input type="hidden" name="redirect" value={redirect} />
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
    const redirect = c.req.query('redirect') || '/';
    const db = (c.env as Record<string, unknown>).DB as D1Database;
    const env = c.env as Record<string, string>;

    const code = await verifyToken(tokenParam, env.JWT_SECRET || '');
    if (!code) {
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Code or link has expired. Please request a new one.')}`);
    }

    const email = await verifyCode(db, code);
    if (!email) {
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Code or link has expired. Please request a new one.')}`);
    }

    const role = await getUserRole(db, email);
    if (!role) {
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Invalid or expired code. Please try again.')}`);
    }

    await setSession(c, { email, role });
    return c.redirect(redirect);
  });

  app.post('/auth/verify', async (c) => {
    const body = await c.req.parseBody();
    const code = (body.code as string || '').trim().toUpperCase();
    const redirect = (body.redirect as string) || '/';
    const db = (c.env as Record<string, unknown>).DB as D1Database;

    if (!code || !/^[A-Z0-9]{6}$/.test(code)) {
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Please enter a valid 6-character code.')}`);
    }

    const email = await verifyCode(db, code);
    if (!email) {
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Invalid or expired code. Please try again.')}`);
    }

    const role = await getUserRole(db, email);
    if (!role) {
      return c.redirect(`/login?redirect=${encodeURIComponent(redirect)}&error=${encodeURIComponent('Invalid or expired code. Please try again.')}`);
    }

    await setSession(c, { email, role });
    return c.redirect(redirect);
  });

  app.get('/logout', async (c) => {
    clearSession(c);
    return c.redirect('/');
  });

  app.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const page = provider.getPage(slug);
    const tsKey = getTurnstileKey(c);

    if (!page) {
      return c.html(
        <Layout title="Page Not Found" turnstileSiteKey={tsKey}>
          <div class="page-title">
            <h1>404 - Page Not Found</h1>
            <p class="subtitle">The page you're looking for doesn't exist.</p>
          </div>
          <div class="content">
            <p><a href="/">Return to home</a></p>
          </div>
        </Layout>,
        404
      );
    }

    if (page.type === 'work') {
      return c.html(<WorkPage page={page} turnstileSiteKey={tsKey} />);
    }

    return c.html(
      <Layout title={page.title} description={page.subtitle} turnstileSiteKey={tsKey}>
        <PageTitle title={page.title} subtitle={page.subtitle} />
        <div class="content" dangerouslySetInnerHTML={{ __html: page.html }}></div>
      </Layout>
    );
  });
}
