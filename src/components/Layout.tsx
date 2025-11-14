import type { FC } from 'hono/jsx';

interface LayoutProps {
  title: string;
  description?: string;
  children?: any;
}

export const Layout: FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;700&family=PT+Sans:wght@400;700&family=PT+Mono&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/page-loader.js"></script>
      </head>
      <body id="#top">
        <div class="site-layout">
          <Header />
          <main class="main-content">
            {children}
          </main>
          <Footer />
        </div>
        <page-loader></page-loader>
      </body>
    </html>
  );
};

export const Header: FC = () => {
  return (
    <header class="header">
      <a href="#navigation">
        <img src="/logo.png" alt="JV Logo" class="logo" />
      </a>
    </header>
  );
};

export const Footer: FC = () => {
  return (
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
  );
};

export const Hero: FC<{ title: string }> = ({ title }) => {
  return <h1 class="hero">{title}</h1>;
};

export const PageTitle: FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div class="page-header">
      <h1 class="page-title">{title}</h1>
      {subtitle && <p class="page-subtitle">{subtitle}</p>}
    </div>
  );
};
