import type { Child, FC } from 'hono/jsx';
import { useAuth } from '../auth';
import { useLatestTrack } from '../lib/lastfm';

const SITE_URL = 'https://jvelo.at';

interface LayoutProps {
  title: string;
  description?: string;
  // Social preview card, 1200x630, under /public/og
  image?: string;
  // Canonical path of the page, used for og:url when known
  path?: string;
  turnstileSiteKey?: string;
  children?: Child;
}

export const Layout: FC<LayoutProps> = ({ title, description, image = '/og/home.png', path, turnstileSiteKey = '', children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jérôme Velociter" />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        {path && <meta property="og:url" content={`${SITE_URL}${path}`} />}
        <meta property="og:image" content={`${SITE_URL}${image}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans:wght@400;700&family=IBM+Plex+Sans+Condensed:wght@700&family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/theme-switcher.js"></script>
        <script src="/page-loader.js"></script>
        <script src="/gallery.js" defer></script>
        <script src="/contact-form.js" defer></script>
        {turnstileSiteKey && <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>}
      </head>
      <body id="top">
        <div class="page">
          <Header />
          <main class="main-content">
            {children}
          </main>
        </div>
        <Footer />
        <contact-form sitekey={turnstileSiteKey}></contact-form>
        <page-loader></page-loader>
      </body>
    </html>
  );
};

export const Header: FC = () => {
  return (
    <header class="header">
      <a href="#navigation" class="brand" aria-label="Menu">
        <span class="logo"></span>
      </a>
    </header>
  );
};

export const SocialLinks: FC = () => (
  <>
    <a href="https://github.com/jvelo" rel="noopener noreferrer" aria-label="GitHub">
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </a>
    <a href="https://www.linkedin.com/in/jvelociter/" rel="noopener noreferrer" aria-label="LinkedIn">
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path>
      </svg>
    </a>
    <a href="https://x.com/intent/follow?screen_name=jvelo_at" rel="noopener noreferrer" aria-label="X">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
      </svg>
    </a>
  </>
);

export const Footer: FC = () => {
  const user = useAuth();
  const isAdmin = user?.role === 'admin';
  const track = useLatestTrack();

  return (
    <footer id="navigation" class="footer">
      <div class="anchor"></div>
      <a href="#top" class="back-to-top">
        <img src="/arrowup.svg" alt="Back to top" />
      </a>
      <div class="footer-inner">
        <div class="footer-main">
          <div class="footer-navigation">
            <nav class="nav-menu">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/resume">Résumé</a>
              <a href="/connect">Contact</a>
            </nav>
            <nav class="nav-secondary">
              {user ? (
                <>
                  <a href="/starred-media">Starred media</a>
                  <a href="/atlas">Atlas</a>
                  {isAdmin && <a href="/kitchen-sink">Kitchen sink</a>}
                  {isAdmin && <a href="/admin">Admin</a>}
                  <span class="nav-secondary-sep" />
                  <a href="/logout">Sign out</a>
                </>
              ) : (
                <a href="/login">Members space</a>
              )}
            </nav>
            <div class="footer-social">
              <SocialLinks />
            </div>
          </div>
          <div class="footer-artwork" aria-hidden="true">
            <img class="footer-artwork-owl" src="/images/footer-owl.png" alt="" width="1536" height="1024" loading="lazy" decoding="async" data-no-gallery />
            <img class="footer-artwork-crows" src="/images/footer-crows-right-seam.png" alt="" width="1086" height="1448" loading="lazy" decoding="async" data-no-gallery />
          </div>
        </div>
        <div class="footer-bottom">
          <div class="theme-toggle">
            <theme-switcher></theme-switcher>
          </div>
          {track && (
            <a href={track.url} rel="noopener noreferrer" class="footer-listening">
              <span class="footer-listening-art">
                {track.image && <img src={track.image} alt="" width="56" height="56" loading="lazy" data-no-gallery onerror="this.remove()" />}
              </span>
              <span class="footer-listening-text">
                <span class="footer-listening-label">{track.nowPlaying ? 'Now playing' : 'Last played'}</span>
                <span class="footer-listening-title">{track.name}</span>
                <span class="footer-listening-meta">{track.artist}{track.album && ` · ${track.album}`}</span>
              </span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export const PageTitle: FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div class="page-header">
      <h1 class="page-title">{title}</h1>
      {subtitle && <p class="page-subtitle">{subtitle}</p>}
    </div>
  );
};
