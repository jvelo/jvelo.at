export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all(): Promise<{ results: Record<string, unknown>[] }>;
  first(): Promise<Record<string, unknown> | null>;
  run(): Promise<void>;
}

export interface PageData {
  slug: string;
  type?: 'page' | 'work';
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
}
