import { html } from 'hono/html';

interface LayoutProps {
  title: string;
  description?: string;
  children: any;
}

export const Layout = ({ title, description, children }: LayoutProps) => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${description ? html`<meta name="description" content="${description}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;700&family=PT+Sans:wght@400;700&family=PT+Mono&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <script src="/app.js" defer></script>
</head>
<body>
  <div class="site-layout">
    ${Header()}
    <main class="main-content">
      ${children}
    </main>
    ${Footer()}
  </div>
</body>
</html>`;
};

export const Header = () => {
  return html`
    <header class="header" id="top">
      <a href="#navigation">
        <img src="/logo.png" alt="JV Logo" class="logo" />
      </a>
    </header>
  `;
};

export const Footer = () => {
  return html`
    <footer id="navigation" class="footer">
      <a href="#top" class="back-to-top">
        <img src="/arrowup.svg" alt="Back to top" style="height: 50px;" />
      </a>
      <nav class="nav-menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/connect">Connect</a>
        <a href="/pgp">PGP</a>
      </nav>
    </footer>
  `;
};

export const Hero = ({ title }: { title: string }) => {
  return html`
    <h1 class="hero">${title}</h1>
  `;
};

export const PageTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return html`
    <div class="page-header">
      <h1 class="page-title">${title}</h1>
      ${subtitle ? html`<p class="page-subtitle">${subtitle}</p>` : ''}
    </div>
  `;
};
