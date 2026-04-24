import type { FC } from 'hono/jsx';
import { Layout } from './Layout';
import { useAuth } from '../auth';
import type { SiteWithMetadata } from '../types';

interface ElsewherePageProps {
  sites: SiteWithMetadata[];
  flashMessage?: string;
  turnstileSiteKey?: string;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export const ElsewherePage: FC<ElsewherePageProps> = ({ sites, flashMessage, turnstileSiteKey = '' }) => {
  const user = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Layout title="Elsewhere" description="A collection of websites worth visiting" turnstileSiteKey={turnstileSiteKey} sidebar={false}>
      <div class="elsewhere-page">
        <h1 class="page-title">elsewhere</h1>
        <p class="page-subtitle">Corners of the web worth wandering into.</p>

        {flashMessage && <p class="elsewhere-flash">{flashMessage}</p>}

        {isAdmin && (
          <details class="elsewhere-add">
            <summary>Add a site</summary>
            <form method="post" action="/elsewhere" class="elsewhere-add-form">
              <label class="elsewhere-field">
                <span>URL</span>
                <input type="url" name="url" required placeholder="https://example.com" />
              </label>
              <label class="elsewhere-field">
                <span>Note (optional — your take on why this site is interesting)</span>
                <textarea name="note" rows={3} />
              </label>
              <button type="submit">Add &amp; fetch metadata</button>
            </form>
          </details>
        )}

        {sites.length === 0 ? (
          <p class="elsewhere-empty">Nothing here yet.</p>
        ) : (
          <ul class="elsewhere-list">
            {sites.map((site) => {
              const visual = site.og_image_url || site.screenshot_url;
              const host = hostname(site.url);
              return (
                <li class="elsewhere-item">
                  <a href={site.url} target="_blank" rel="noopener noreferrer" class="elsewhere-link">
                    <div class="elsewhere-visual">
                      {visual ? (
                        <img src={visual} alt="" loading="lazy" />
                      ) : (
                        <div class="elsewhere-visual-placeholder" />
                      )}
                    </div>
                    <div class="elsewhere-meta">
                      <div class="elsewhere-heading">
                        {site.favicon_url && <img src={site.favicon_url} alt="" class="elsewhere-favicon" loading="lazy" />}
                        <h3 class="elsewhere-title">{site.title || host}</h3>
                      </div>
                      <span class="elsewhere-host">{host}</span>
                      {site.ai_blurb ? (
                        <p class="elsewhere-blurb">{site.ai_blurb}</p>
                      ) : (
                        site.description && <p class="elsewhere-description">{site.description}</p>
                      )}
                      {isAdmin && site.fetch_error && <p class="elsewhere-error">fetch error: {site.fetch_error}</p>}
                    </div>
                  </a>
                  {isAdmin && (
                    <div class="elsewhere-actions">
                      <form method="post" action={`/elsewhere/${site.id}/refetch`}>
                        <button type="submit">Re-fetch metadata</button>
                      </form>
                      <form method="post" action={`/elsewhere/${site.id}/regenerate`}>
                        <button type="submit">Regenerate blurb</button>
                      </form>
                      <form method="post" action={`/elsewhere/${site.id}/delete`} onsubmit="return confirm('Delete this site?')">
                        <button type="submit" class="danger">Delete</button>
                      </form>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};
