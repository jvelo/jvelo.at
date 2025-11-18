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
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;700&family=PT+Sans:wght@400;700&family=PT+Mono&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/theme-switcher.js"></script>
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
        <div class="logo" role="img" aria-label="JV Logo"></div>
      </a>
      <div class="header-info">
        <h1 class="header-name">Jérôme Velociter</h1>
        <p class="header-subtitle">Software creative</p>
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
        <a href="/connect">Connect</a>
        <a href="/pgp">PGP</a>
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

export const HomeNav: FC = () => {
  return (
    <nav class="home-nav">
      <a href="/projects" class="home-nav-link">Projects</a>
      <a href="/work" class="home-nav-link">Work</a>
      <a href="/services" class="home-nav-link">Services</a>
      <div class="home-social-links">
        <a href="https://github.com/jvelo" rel="noopener noreferrer" aria-label="GitHub">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>
    </nav>
  );
};

export const HomeHero: FC = () => {
  return (
    <section class="home-hero">
      <div class="hero-header">
        <h1 class="hero-name">Jérôme Velociter</h1>
        <p class="hero-subtitle">Software creative</p>
      </div>
      <div class="hero-photo">
        <img src="/images/jvelo.png" alt="Jérôme Velociter" class="border-backdrop" />
      </div>
      <div class="hero-text">
        <p>8-bit digital native, grown general purpose hacker.</p>
        <p>I bring ideas to life with software.</p>
        <p>I'm available for consulting and freelancing work, <a href="/connect">let's get in touch</a></p>
      </div>
    </section>
  );
};

interface Project {
  title: string;
  description: string;
  image: string;
  badge?: string;
  link: string;
}

export const ProjectCard: FC<Project> = ({ title, description, image, badge, link }) => {
  return (
    <article class="project-card">
      <div class="project-image border-backdrop">
        <img src={image} alt={title} />
      </div>
      <div class="project-content">
        <div class="project-header">
          <h3 class="project-title">{title}</h3>
          {badge && <span class="project-badge">{badge}</span>}
        </div>
        <p class="project-description">{description}</p>
        <a href={link} class="project-link">Learn more</a>
      </div>
    </article>
  );
};

export const SelectedWorks: FC = () => {
  const projects: Project[] = [
    {
      title: "Typebar",
      description: "A text editor aimed at building delightful writing experiences. Built upon the HTML canvas element, written in #TypeScript with zero dependencies.",
      image: "/images/typebar.png",
      badge: "private beta",
      link: "#"
    },
    {
      title: "Dotpad",
      description: "A low-level library for building infinite-canvas spatial applications. Written in #TypeScript",
      image: "/images/dotpad.png",
      badge: "private beta",
      link: "#"
    },
    {
      title: "BiomeOS",
      description: "An extensible controlled environment platform for agronomic research and indoor farming production",
      image: "/images/biomeos.png",
      link: "#"
    }
  ];

  return (
    <section class="selected-works">
      <h2 class="section-title">SELECTED WORKS</h2>
      <div class="projects-grid">
        {projects.map((project) => (
          <ProjectCard {...project} />
        ))}
      </div>
    </section>
  );
};
