-- Migration number: 0007 	 2026-06-14T00:00:00.000Z
--
-- Adds a per-URL "prefer screenshot" flag. When set, the sites_with_metadata
-- view promotes the stored screenshot above og:image in image_source. Lives on
-- url_metadata (not sites) so any future consumer of url_metadata gets the
-- same preference for free — see CLAUDE.md "Atlas" section.

ALTER TABLE url_metadata ADD COLUMN prefer_screenshot INTEGER NOT NULL DEFAULT 0;
