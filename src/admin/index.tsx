import { tapemark } from '@jvelo/tapemark-hono';
import { createD1Adapter } from '@jvelo/tapemark-d1';
import { getSession } from '../auth';
import type { D1Database } from '../types';

export const adminApp = tapemark({
  db: (c) => createD1Adapter((c.env as Record<string, unknown>).DB as D1Database),
  prefix: '/admin',
  name: 'admin',
  siteUrl: '/',
  siteName: 'jvelo.at',
  authorize: async (c) => {
    const user = await getSession(c);
    if (!user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(c.req.path)}`;
      c.redirect(loginUrl);
      return false;
    }
    return user.role === 'admin';
  },
});
