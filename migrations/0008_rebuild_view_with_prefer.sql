-- Migration number: 0008 	 2026-06-14T00:00:00.000Z
--
-- Rebuild sites_with_metadata so image_source respects prefer_screenshot,
-- and surface the flag itself for the admin UI. SQLite has no
-- CREATE OR REPLACE VIEW, so we drop and recreate.

DROP VIEW IF EXISTS sites_with_metadata;

CREATE VIEW sites_with_metadata AS
  SELECT
    s.id,
    s.url,
    s.note,
    s.ai_blurb,
    s.display_order,
    s.created_at,
    s.updated_at,
    m.canonical_url,
    m.title,
    m.description,
    m.favicon_url,
    m.og_image_url,
    m.screenshot_url,
    m.fetched_at,
    m.fetch_error,
    COALESCE(m.prefer_screenshot, 0) AS prefer_screenshot,
    CASE
      WHEN COALESCE(m.prefer_screenshot, 0) = 1 AND m.screenshot_url IS NOT NULL THEN 'screenshot'
      WHEN m.og_image_url IS NOT NULL THEN 'og:image'
      WHEN m.screenshot_url IS NOT NULL THEN 'screenshot'
      ELSE 'mshots'
    END AS image_source
  FROM sites s
  LEFT JOIN url_metadata m ON s.url = m.url;
