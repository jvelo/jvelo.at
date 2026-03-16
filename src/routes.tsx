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

const WorkPage: FC<{ page: PageData }> = ({ page }) => {
  const html = addHeadingIds(page.html);
  const toc = extractToc(html);

  return (
    <Layout title={page.title} description={page.description}>
      <article class="project">
        <nav class="breadcrumb">
          <a href="/works">selected works</a>
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
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
          {toc.length > 0 && (
            <aside class="content-aside toc">
              <h2 class="toc-title">Contents</h2>
              <nav>
                {toc.map((entry) => (
                  <a href={`#${entry.id}`} class="toc-link">{entry.text}</a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </article>
    </Layout>
  );
};

interface PageProvider {
  getHome: () => PageData;
  getPage: (slug: string) => PageData | null;
}

export function setupRoutes(app: Hono, provider: PageProvider) {
  app.get('/', async (c) => {
    const page = provider.getHome();

    return c.html(
      <Layout title={page.title} description={page.description}>
        <SelectedWorks />
        <Expertise />
        <ReachOut />
      </Layout>
    );
  });

  app.get('/kitchen-sink', async (c) => {
    return c.html(
      <Layout title="Kitchen Sink">
        <Sink />
      </Layout>
    );
  });

  app.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const page = provider.getPage(slug);

    if (!page) {
      return c.html(
        <Layout title="Page Not Found">
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
      return c.html(<WorkPage page={page} />);
    }

    return c.html(
      <Layout title={page.title} description={page.subtitle}>
        <PageTitle title={page.title} subtitle={page.subtitle} />
        <div class="content" dangerouslySetInnerHTML={{ __html: page.html }}></div>
      </Layout>
    );
  });
}
