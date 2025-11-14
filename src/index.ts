import { Hono } from 'hono';
import { contentBundle } from './content-bundle';
import { html, raw } from 'hono/html';

const app = new Hono();

function Layout({ title, description, children }: { title: string; description?: string; children: any }) {
  return html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${description ? html`<meta name="description" content="${description}">` : ''}
    <link rel="stylesheet" href="/styles.css">
    <script src="/page-loader.js"></script>
  </head>
  <body>
    <div class="site-layout">
      ${Header()}
      <main class="main-content">${children}</main>
      ${Footer()}
    </div>
    <page-loader></page-loader>
  </body>
</html>`;
}

function Header() {
  return html`
    <header class="header" id="top">
      <a href="#navigation">
        <img src="/logo.png" alt="JV Logo" class="logo" />
      </a>
    </header>
  `;
}

function Footer() {
  return html`
    <footer id="navigation" class="footer">
      <a href="#top" class="back-to-top">
        <img src="/arrowup.svg" alt="Back to top" />
      </a>
      <nav class="nav-menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/connect">Connect</a>
        <a href="/pgp">PGP</a>
      </nav>
    </footer>
  `;
}

function Hero({ title }: { title: string }) {
  return html`
    <div class="hero">
      <h1 class="hero-title">${title}</h1>
    </div>
  `;
}

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return html`
    <div class="page-title">
      <h1>${title}</h1>
      ${subtitle ? html`<p class="subtitle">${subtitle}</p>` : ''}
    </div>
  `;
}

app.get('/', async (c) => {
  const page = contentBundle.home;

  return c.html(Layout({
    title: page.title,
    description: page.description,
    children: html`
      ${page.hero_title ? Hero({ title: page.hero_title }) : ''}
      <div class="content">${raw(page.html)}</div>
    `,
  }));
});

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const page = contentBundle.pages[slug];

  if (!page) {
    return c.html(Layout({
      title: 'Page Not Found',
      children: html`
        <div class="page-title">
          <h1>404 - Page Not Found</h1>
          <p class="subtitle">The page you're looking for doesn't exist.</p>
        </div>
        <div class="content">
          <p><a href="/">Return to home</a></p>
        </div>
      `,
    }), 404);
  }

  return c.html(Layout({
    title: page.title,
    description: page.subtitle,
    children: html`
      ${PageTitle({ title: page.title, subtitle: page.subtitle })}
      <div class="content">${raw(page.html)}</div>
    `,
  }));
});

export default app;
