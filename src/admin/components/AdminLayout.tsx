import type { FC } from 'hono/jsx';
import { raw } from 'hono/utils/html';
import { adminStyles } from '../styles';

interface Crumb {
  label: string;
  href?: string;
}

interface AdminLayoutProps {
  title: string;
  crumbs?: Crumb[];
  children?: any;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ title, crumbs = [], children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — admin</title>
        <style>{raw(adminStyles)}</style>
        <script src="/admin.js" defer></script>
      </head>
      <body>
        <div class="admin">
          <div class="admin-bar">
            <span class="admin-bar-title"><a href="/admin">admin</a></span>
            {crumbs.length > 0 && (
              <div class="admin-crumbs">
                {crumbs.map((c, i) => (
                  <>
                    {i > 0 && <span>/</span>}
                    {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
                  </>
                ))}
              </div>
            )}
            <a href="/">← site</a>
          </div>
          <div class="admin-body">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};
