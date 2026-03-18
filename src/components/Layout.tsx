import type { FC } from 'hono/jsx';
import { Sidebar, SidebarNav } from './Sidebar';

interface LayoutProps {
  title: string;
  description?: string;
  bodyClass?: string;
  sidebar?: boolean;
  turnstileSiteKey?: string;
  children?: any;
}

export const Layout: FC<LayoutProps> = ({ title, description, bodyClass, sidebar = true, turnstileSiteKey = '', children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans:wght@400;700&family=IBM+Plex+Sans+Condensed:wght@700&family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/theme-switcher.js"></script>
        <script src="/page-loader.js"></script>
        <script src="/gallery.js" defer></script>
        <script src="/contact-form.js" defer></script>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      </head>
      <body id="#top" class={bodyClass || ''}>
        <div class="site-layout">
          <Header />
          {sidebar ? (
            <div class="page-container main-content">
              <aside class="sidebar">
                <Sidebar />
                <SidebarNav />
              </aside>
              <main class="page-body">
                {children}
              </main>
            </div>
          ) : (
            <main class="main-content page-body">
              {children}
            </main>
          )}
          <Footer />
        </div>
        <contact-form sitekey={turnstileSiteKey}></contact-form>
        <page-loader></page-loader>
      </body>
    </html>
  );
};

export const Header: FC = () => {
  return (
    <header class="header">
      <a href="#navigation">
        <div class="logo" role="img" aria-label="JV Logo"></div>
      </a>
      <div class="header-info">
        <h1 class="header-name">Jérôme Velociter</h1>
        <p class="header-subtitle header-subtitle--light">Product engineer</p>
        <p class="header-subtitle header-subtitle--dark">Software creative</p>
      </div>
    </header>
  );
};

export const Footer: FC = () => {
  return (
    <footer id="navigation" class="footer">
      <div class="anchor"></div>
      <a href="#top" class="back-to-top">
        <img src="/arrowup.svg" alt="Back to top" style="height: 50px;" />
      </a>
      <nav class="nav-menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/connect">Contact</a>
      </nav>
      <div class="theme-toggle">
        <theme-switcher></theme-switcher>
      </div>
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
