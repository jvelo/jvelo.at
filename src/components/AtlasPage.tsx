import type { FC } from 'hono/jsx';
import { Layout, PageTitle } from './Layout';
import { useAuth } from '../auth';
import type { SiteWithMetadata } from '../types';

interface AtlasPageProps {
  entries: SiteWithMetadata[];
  turnstileSiteKey?: string;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// WordPress's free mshots service — used as a last-resort visual when the
// site exposes neither an og:image nor a stored screenshot. First load
// for a given URL returns a placeholder while mshots renders the page in
// the background; subsequent loads get the cached screenshot.
function mshotsUrl(url: string): string {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=600&h=375`;
}

export const AtlasPage: FC<AtlasPageProps> = ({ entries, turnstileSiteKey = '' }) => {
  const user = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Layout title="Atlas" description="A collection of websites worth visiting" turnstileSiteKey={turnstileSiteKey} sidebar={false}>
      <div class="atlas-page">
        <PageTitle title="Atlas" subtitle="Corners of the web worth wandering into." />

        {entries.length === 0 ? (
          <p class="atlas-empty">Nothing here yet.</p>
        ) : (
          <ul class="atlas-list">
            {entries.map((entry) => {
              const mshots = mshotsUrl(entry.url);
              const visual = entry.og_image_url || entry.screenshot_url || mshots;
              // If we picked og:image or a stored screenshot and it 404s
              // at load time, fall back to mshots; if mshots also fails,
              // hide the broken icon and let the bordered frame stand alone.
              const fallback = visual === mshots ? '' : mshots;
              const host = hostname(entry.url);
              const title = entry.title || host;
              return (
                <li>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="atlas-link"
                    aria-label={`Visit ${title} (${host})`}
                  >
                    <div class="atlas-visual">
                      <img
                        src={visual}
                        data-fallback={fallback}
                        onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback){this.src=this.dataset.fallback;}else{this.style.display='none';}"
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div class="atlas-meta">
                      <div class="atlas-heading">
                        {entry.favicon_url && (
                          <img
                            src={entry.favicon_url}
                            alt=""
                            class="atlas-favicon"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                          />
                        )}
                        <h3 class="atlas-title">{title}</h3>
                      </div>
                      <span class="atlas-host">{host}</span>
                      {entry.ai_blurb ? (
                        <p class="atlas-blurb">{entry.ai_blurb}</p>
                      ) : (
                        entry.description && <p class="atlas-description">{entry.description}</p>
                      )}
                      {isAdmin && entry.fetch_error && <p class="atlas-error">fetch error: {entry.fetch_error}</p>}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};
