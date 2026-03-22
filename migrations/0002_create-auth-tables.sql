-- Migration number: 0002 	 2026-03-22T08:34:20.929Z

CREATE TABLE users (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE signin_codes (
  code TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX idx_signin_codes_email ON signin_codes(email);
CREATE INDEX idx_signin_codes_expires_at ON signin_codes(expires_at);
