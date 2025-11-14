import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '../../content');

export interface PageData {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  hero_title?: string;
  content: string;
  html: string;
}

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
      title: data.title || slug,
      subtitle: data.subtitle,
      content,
      html: marked(content) as string,
    };
  } catch (error) {
    return null;
  }
}

export function getAllPages(): PageData[] {
  const pagesDir = path.join(contentDir, 'pages');
  const files = fs.readdirSync(pagesDir);

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      return getPageBySlug(slug);
    })
    .filter((page): page is PageData => page !== null);
}
