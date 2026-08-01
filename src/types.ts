export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all(): Promise<{ results: Record<string, unknown>[] }>;
  first(): Promise<Record<string, unknown> | null>;
  run(): Promise<void>;
}

export interface R2Object {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
  size: number;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<void>;
  get(key: string): Promise<R2Object | null>;
  head(key: string): Promise<R2Object | null>;
  delete(key: string): Promise<void>;
}

export interface Bindings {
  DB: D1Database;
  SCREENSHOTS: R2Bucket;
  JWT_SECRET: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  SCW_TEM_SECRET_KEY: string;
  SCW_PROJECT_ID: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  ANTHROPIC_API_KEY?: string;
  OPENGRAPH_API_KEY?: string;
}

export type Role = 'admin' | 'member';

export interface AuthUser {
  email: string;
  role: Role;
}

export interface AppEnv {
  Bindings: Bindings;
  Variables: { user?: AuthUser };
}

export type PageType = 'page' | 'work';

export interface PageData {
  slug: string;
  type?: PageType;
  title: string;
  subtitle?: string;
  description?: string;
  hero_title?: string;
  image?: string;
  badge?: string;
  technologies?: string[];
  years?: string;
  license?: string;
  source?: string;
  content: string;
  html: string;
}

export interface PageProvider {
  getHome: () => PageData;
  getPage: (slug: string) => PageData | null;
}

export interface UrlMetadata {
  url: string;
  canonical_url: string | null;
  title: string | null;
  description: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  screenshot_url: string | null;
  fetched_at: string;
  fetch_error: string | null;
  raw_response: string | null;
}

export interface Site {
  id: number;
  url: string;
  note: string | null;
  ai_blurb: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteWithMetadata extends Site {
  title: string | null;
  description: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  screenshot_url: string | null;
  fetch_error: string | null;
  prefer_screenshot: number;
  image_source: 'og:image' | 'screenshot' | 'mshots';
}
