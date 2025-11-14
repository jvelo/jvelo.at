import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { getHomePage, getPageBySlug } from './lib/markdown.js';
import { Layout, Hero, PageTitle } from './components/Layout.js';
import { html, raw } from 'hono/html';

const app = new Hono();

// Helper to add artificial delay for development
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Serve static files from public directory
app.use('/*', serveStatic({ root: './public' }));

// Home page route
app.get('/', async (c) => {
  // Add delay to see transition animation (remove in production)
  await delay(300);

  const page = getHomePage();

  return c.html(
    Layout({
      title: page.title,
      description: page.description,
      children: html`
        ${page.hero_title ? Hero({ title: page.hero_title }) : ''}
        <div class="content">
          ${raw(page.html)}
        </div>
      `,
    })
  );
});

// Dynamic page routes
app.get('/:slug', async (c) => {
  // Add delay to see transition animation (remove in production)
  await delay(300);

  const slug = c.req.param('slug');
  const page = getPageBySlug(slug);

  if (!page) {
    return c.html(
      Layout({
        title: 'Page Not Found',
        children: html`
          <div class="content">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go home</a>
          </div>
        `,
      }),
      404
    );
  }

  return c.html(
    Layout({
      title: page.title,
      description: page.subtitle,
      children: html`
        ${PageTitle({ title: page.title, subtitle: page.subtitle })}
        <div class="content">
          ${raw(page.html)}
        </div>
      `,
    })
  );
});

const port = Number(process.env.PORT) || 3000;

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  const { serve } = await import('@hono/node-server');
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
