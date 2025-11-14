import { Hono } from 'hono';
import { contentBundle } from './content-bundle';
import { setupRoutes } from './routes';

const app = new Hono();

setupRoutes(app, {
  getHome: () => contentBundle.home,
  getPage: (slug: string) => contentBundle.pages[slug] || null,
});

export default app;
