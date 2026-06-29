-- Migration number: 0006 	 2026-06-13T00:00:00.000Z
--
-- Add a derived `image_source` column to sites_with_metadata. Reflects the
-- server's intended source for the card visual, mirroring the priority used
-- at render time in AtlasPage.tsx (og:image > stored screenshot > mshots).
-- SQLite has no CREATE OR REPLACE VIEW, so we drop and recreate.

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
    CASE
      WHEN m.og_image_url IS NOT NULL THEN 'og:image'
      WHEN m.screenshot_url IS NOT NULL THEN 'screenshot'
      ELSE 'mshots'
    END AS image_source
  FROM sites s
  LEFT JOIN url_metadata m ON s.url = m.url;
