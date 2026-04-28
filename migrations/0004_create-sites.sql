-- Migration number: 0004 	 2026-04-24T00:00:00.000Z

CREATE TABLE url_metadata (
  url TEXT PRIMARY KEY,
  canonical_url TEXT,
  title TEXT,
  description TEXT,
  favicon_url TEXT,
  og_image_url TEXT,
  screenshot_url TEXT,
  fetched_at TEXT NOT NULL,
  fetch_error TEXT,
  raw_response TEXT
);

CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  note TEXT,
  ai_blurb TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (url) REFERENCES url_metadata(url)
);

CREATE INDEX idx_sites_order ON sites(display_order DESC, created_at DESC);
