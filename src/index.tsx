import { Hono } from 'hono';
import { contentBundle } from './content-bundle';
import { setupRoutes } from './routes';
import { adminApp } from './admin/index';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

app.route('/admin', adminApp);

setupRoutes(app, {
  getHome: () => contentBundle.home,
  getPage: (slug: string) => contentBundle.pages[slug] || null,
});

export default app;
