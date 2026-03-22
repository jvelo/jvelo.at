-- Migration number: 0001 	 2026-03-22T08:06:50.431Z

CREATE TABLE starred_media (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_width INTEGER NOT NULL,
  media_height INTEGER NOT NULL
);

CREATE INDEX idx_starred_media_created_at ON starred_media(created_at);
