import type { FC } from 'hono/jsx';
import { Layout } from './Layout';
import { extractToc, addHeadingIds } from '../lib/html';
import type { PageData } from '../types';

const ProjectMeta: FC<{ technologies?: string[]; years?: string; license?: string; source?: string }> = ({ technologies, years, license, source }) => {
  if (!technologies?.length && !years && !license && !source) return null;
  return (
    <>
      {technologies && technologies.length > 0 && (
        <section class="aside-section">
          <h2 class="aside-heading">Technologies</h2>
          <ul class="aside-tags">
            {technologies.map((tech) => (
              <li>{tech}</li>
            ))}
          </ul>
        </section>
      )}
      {years && (
        <section class="aside-section">
          <h2 class="aside-heading">Years active</h2>
          <p class="aside-meta">{years}</p>
        </section>
      )}
      {license && (
        <section class="aside-section">
          <h2 class="aside-heading">License</h2>
          <p class="aside-meta">{license}</p>
        </section>
      )}
      {source && (
        <section class="aside-section">
          <h2 class="aside-heading">Source</h2>
          <p class="aside-meta"><a href={source} class="aside-link">GitHub</a></p>
        </section>
      )}
    </>
  );
};

export const WorkPage: FC<{ page: PageData; turnstileSiteKey?: string }> = ({ page, turnstileSiteKey }) => {
  const html = addHeadingIds(page.html);
  const toc = extractToc(html);
  const hasMeta = !!(page.technologies?.length || page.years || page.license || page.source);

  return (
    <Layout title={page.title} description={page.description} image={`/og/${page.slug}.png`} path={`/${page.slug}`} turnstileSiteKey={turnstileSiteKey}>
      <article class="project">
        <nav class="breadcrumb">
          <a href="/">selected works</a>
          <span class="breadcrumb-sep">&gt;</span>
          <span>{page.slug}</span>
        </nav>
        <h1 class="project-name">{page.title}</h1>
        {page.subtitle && <p class="project-tagline">{page.subtitle}</p>}
        <div class="content-with-aside">
          <div class="content-primary prose">
            {page.image && (
              <div class="hero-cover border-backdrop">
                <img src={page.image} alt={page.title} />
              </div>
            )}
            {hasMeta && (
              <div class="project-meta-mobile">
                <ProjectMeta technologies={page.technologies} years={page.years} license={page.license} source={page.source} />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
            <section class="work-cta">
              <p class="work-cta-text">Working on an ambitious product?</p>
              <a href="#contact">Let's talk →</a>
            </section>
          </div>
          <aside class="content-aside">
            {toc.length > 0 && (
              <section class="toc">
                <h2 class="aside-heading">Contents</h2>
                <nav>
                  {toc.map((entry) => (
                    <a href={`#${entry.id}`} class="toc-link">{entry.text}</a>
                  ))}
                </nav>
              </section>
            )}
            {hasMeta && <hr class="aside-divider" />}
            <ProjectMeta technologies={page.technologies} years={page.years} license={page.license} source={page.source} />
          </aside>
        </div>
      </article>
    </Layout>
  );
};
