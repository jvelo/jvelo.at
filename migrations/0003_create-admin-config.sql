-- Migration number: 0003 	 2026-03-22T12:25:56.236Z

CREATE TABLE admin_table_config (
  table_name TEXT PRIMARY KEY,
  config TEXT NOT NULL DEFAULT '{}'
);
