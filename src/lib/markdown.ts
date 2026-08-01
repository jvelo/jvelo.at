import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import type { PageData, PageType } from '../types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '../../content');

export function getHomePage(): PageData {
  const filePath = path.join(contentDir, 'home', 'index.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: 'home',
    title: data.title || 'Home',
    description: data.description,
    hero_title: data.hero_title,
    content,
    html: marked(content) as string,
  };
}

export function getPageBySlug(slug: string): PageData | null {
  try {
    const filePath = path.join(contentDir, 'pages', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      type: (data.type as PageType) || undefined,
      title: data.title || slug,
      subtitle: data.subtitle,
      description: data.description,
      image: data.image,
      badge: data.badge,
      technologies: data.technologies,
      years: data.years,
      license: data.license,
      source: data.source,
      content,
      html: marked(content) as string,
    };
  } catch {
    return null;
  }
}
