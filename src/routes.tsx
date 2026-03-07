import type { Hono } from 'hono';
import { Layout, Hero, PageTitle, HomeHero, HomeNav, SelectedWorks } from './components/Layout';
import { Sink } from './components/KitchenSink';

interface PageData {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  hero_title?: string;
  content: string;
  html: string;
}

interface PageProvider {
  getHome: () => PageData;
  getPage: (slug: string) => PageData | null;
}

export function setupRoutes(app: Hono, provider: PageProvider) {
  app.get('/', async (c) => {
    const page = provider.getHome();

    return c.html(
      <Layout title={page.title} description={page.description} bodyClass="home-page">
        <div class="home-container">
          <div class="home-left">
            <HomeHero />
            <HomeNav />
          </div>
          <div class="home-right">
            <SelectedWorks />
          </div>
        </div>
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

    return c.html(
      <Layout title={page.title} description={page.subtitle}>
        <PageTitle title={page.title} subtitle={page.subtitle} />
        <div class="content" dangerouslySetInnerHTML={{ __html: page.html }}></div>
      </Layout>
    );
  });
}
