import { Hono } from 'hono';
import { contentBundle } from './content-bundle';
import { setupRoutes } from './routes';
import { adminApp } from './admin/index';

const app = new Hono();

app.route('/admin', adminApp);

setupRoutes(app, {
  getHome: () => contentBundle.home,
  getPage: (slug: string) => contentBundle.pages[slug] || null,
});

export default app;
