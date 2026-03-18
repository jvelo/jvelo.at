import type { Hono } from 'hono';
import type { FC } from 'hono/jsx';
import { Layout, Hero, PageTitle } from './components/Layout';
import { SelectedWorks } from './components/SelectedWorks';
import { Expertise } from './components/Expertise';
import { ReachOut } from './components/ReachOut';
import { Sink } from './components/KitchenSink';

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
