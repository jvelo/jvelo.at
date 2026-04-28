import type { FC } from 'hono/jsx';
import { Layout } from './Layout';
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

export const AtlasPage: FC<AtlasPageProps> = ({ entries, turnstileSiteKey = '' }) => {
  const user = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Layout title="Atlas" description="A collection of websites worth visiting" turnstileSiteKey={turnstileSiteKey} sidebar={false}>
      <div class="atlas-page">
        <h1 class="page-title">atlas</h1>
        <p class="page-subtitle">Corners of the web worth wandering into.</p>

        {entries.length === 0 ? (
          <p class="atlas-empty">Nothing here yet.</p>
        ) : (
          <ul class="atlas-list">
            {entries.map((entry) => {
              const visual = entry.og_image_url || entry.screenshot_url;
              const host = hostname(entry.url);
              return (
                <li class="atlas-item">
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" class="atlas-link">
                    <div class="atlas-visual">
                      {visual ? (
                        <img src={visual} alt="" loading="lazy" />
                      ) : (
                        <div class="atlas-visual-placeholder" />
                      )}
                    </div>
                    <div class="atlas-meta">
                      <div class="atlas-heading">
                        {entry.favicon_url && <img src={entry.favicon_url} alt="" class="atlas-favicon" loading="lazy" />}
                        <h3 class="atlas-title">{entry.title || host}</h3>
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
