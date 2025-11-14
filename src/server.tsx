import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { getHomePage, getPageBySlug } from './lib/markdown.js';
import { setupRoutes } from './routes.js';

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }));

setupRoutes(app, {
  getHome: () => getHomePage(),
  getPage: (slug: string) => getPageBySlug(slug),
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
