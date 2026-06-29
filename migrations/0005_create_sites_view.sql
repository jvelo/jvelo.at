-- Migration number: 0005 	 2026-04-29T00:00:00.000Z
--
-- Joined view used by /atlas (and surfaced read-only in the Tapemark admin).
-- LEFT JOIN so sites without yet-fetched metadata still appear in the list.
-- Column names match the `SiteWithMetadata` type in src/types.ts.

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
    m.fetch_error
  FROM sites s
  LEFT JOIN url_metadata m ON s.url = m.url;
