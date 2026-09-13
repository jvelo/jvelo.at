import { Hono } from 'hono';
import { contentBundle } from './content-bundle';
import { setupRoutes } from './routes';
import { adminApp } from './admin/index';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

// Canonical host is the bare domain. Redirect www permanently.
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname !== 'www.jvelo.at') return next();
  url.hostname = 'jvelo.at';
  return c.redirect(url.toString(), 301);
});

app.route('/admin', adminApp);

setupRoutes(app, {
  getHome: () => contentBundle.home,
  getPage: (slug: string) => contentBundle.pages[slug] || null,
  getResume: () => contentBundle.resume,
});

export default app;
